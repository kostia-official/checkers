import {
  collection,
  addDoc,
  getDoc,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Firestore,
  doc,
  updateDoc,
  DocumentData,
  Timestamp,
  onSnapshot,
  deleteField,
  runTransaction,
} from 'firebase/firestore';
import { CreateGameInput, GameModel, UpdateGameInput } from './types';
import { firebaseClient } from '@common/firebase';
import { Color } from '@common/types';
import { gameHistoryService } from './gameHistory.service';
import { mapGameTypeToStrategy } from '@common/mappers';
import { WithFieldValue } from '@common/utilTypes';
import { gamePlayerService } from '@services/gamePlayer.service';
import { ServiceError } from '@common/enums';

export interface JoinGameArgs {
  id: string;
  inviteeId: string;
  inviteeColor: Color;
}

export interface FinishGameArgs {
  id: string;
  winnerId?: string;
  isDraw?: boolean;
}

export interface SubmitReadyArgs {
  id: string;
  gamePlayerId: string;
}

export interface CreateNewGameData extends CreateGameInput {
  inviterColor: Color;
  inviteeColor?: Color;
}

export class GameService {
  private db: Firestore;
  private collection = 'games';

  constructor(db: Firestore) {
    this.db = db;
  }

  private gameConverter = {
    toFirestore: (game: DocumentData) => ({
      ...game,
      createdAt: Timestamp.fromDate(game.createdAt),
      startedAt: Timestamp.fromDate(game.startedAt),
      endedAt: Timestamp.fromDate(game.endedAt),
    }),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt.toDate(),
        startedAt: data.startedAt?.toDate(),
        endedAt: data.endedAt?.toDate(),
      } as GameModel;
    },
  };

  async create(input: CreateGameInput): Promise<GameModel> {
    const gamesRef = await addDoc(collection(this.db, this.collection), {
      ...input,
      createdAt: new Date(),
    });
    const gameSnap = await getDoc(gamesRef.withConverter(this.gameConverter));
    return gameSnap.data() as GameModel;
  }

  async createNewGame({ inviterColor, inviteeColor, ...data }: CreateNewGameData): Promise<GameModel> {
    const game = await this.create(data);

    const strategy = new mapGameTypeToStrategy[game.gameType]();

    await Promise.all([
      gameHistoryService.add({
        gameId: game.id,
        boardState: strategy.makeInitialBoardState(),
        currentPlayerColor: Color.White,
      }),
      gamePlayerService.create({
        userId: data.inviterId,
        gameId: game.id,
        color: inviterColor,
        isReady: false,
      }),
      data.inviteeId &&
        inviteeColor &&
        gamePlayerService.create({
          userId: data.inviteeId,
          gameId: game.id,
          color: inviteeColor,
          isReady: false,
        }),
    ]);

    return game;
  }

  async get(id: string): Promise<GameModel | undefined> {
    const docRef = doc(this.db, this.collection, id).withConverter(this.gameConverter);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(ServiceError.NotFound);
    }

    return docSnap.data();
  }

  async update(id: string, input: WithFieldValue<UpdateGameInput>): Promise<GameModel> {
    const docRef = doc(this.db, this.collection, id);
    await updateDoc(docRef, input);

    const docSnap = await getDoc(docRef.withConverter(this.gameConverter));
    return docSnap.data() as GameModel;
  }

  onUpdate(id: string, cb: (game: GameModel) => void) {
    return onSnapshot(doc(this.db, this.collection, id).withConverter(this.gameConverter), (doc) => {
      cb(doc.data() as GameModel);
    });
  }

  async getGamePlayers(id: string) {
    const game = await this.get(id);

    const [inviter, invitee] = await Promise.all([
      game?.inviterId ? gamePlayerService.get({ gameId: id, userId: game?.inviterId }) : undefined,
      game?.inviteeId ? gamePlayerService.get({ gameId: id, userId: game?.inviteeId }) : undefined,
    ]);

    return { game, inviter, invitee };
  }

  async submitReadyGame({ id, gamePlayerId }: SubmitReadyArgs): Promise<void> {
    await runTransaction(this.db, async (transaction) => {
      await gamePlayerService.setReady(gamePlayerId);

      const { inviter, invitee } = await this.getGamePlayers(id);
      const canStartGame = inviter?.isReady && invitee?.isReady;

      if (!canStartGame) return;

      const gameRef = doc(this.db, this.collection, id);

      transaction.update(gameRef, { startedAt: new Date() });
    });
  }

  async joinGame({ id, inviteeColor, inviteeId }: JoinGameArgs): Promise<void> {
    await gamePlayerService.create({
      gameId: id,
      color: inviteeColor,
      isReady: false,
      userId: inviteeId,
    });
    await this.update(id, { inviteeId });
  }

  async finishGame({ id, winnerId, isDraw = false }: FinishGameArgs): Promise<void> {
    await this.update(id, { winnerId: winnerId || deleteField(), endedAt: new Date(), isDraw });
  }

  async unfinishGame(id: string): Promise<void> {
    await this.update(id, { winnerId: deleteField(), endedAt: deleteField(), isDraw: deleteField() });
  }
}

export const gameService = new GameService(firebaseClient.firestore);
