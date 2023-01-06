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
} from 'firebase/firestore';
import { CreateGameInput, GameModel, UpdateGameInput } from './types';
import { firebaseClient } from '@common/firebase';
import { Color } from '@common/types';
import { gameHistoryService } from './gameHistory.service';
import { mapGameTypeToStrategy } from '@common/mappers';
import { WithFieldValue } from '@common/utilTypes';

export interface JoinGameArgs {
  id: string;
  inviteeId: string;
  inviteeColor: Color;
}

export interface FinishGameArgs {
  id: string;
  winnerId: string;
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
    const gamesRef = await addDoc(collection(this.db, this.collection), { ...input, createdAt: new Date() });
    const gameSnap = await getDoc(gamesRef.withConverter(this.gameConverter));
    const game = gameSnap.data() as GameModel;

    const strategy = new mapGameTypeToStrategy[game.gameType]();

    const created = await gameHistoryService.add({
      gameId: game.id,
      boardState: strategy.makeInitialBoardState(),
      currentPlayerColor: Color.White,
    });
    console.log('created', created);

    return game;
  }

  async get(id: string): Promise<GameModel | undefined> {
    const docRef = doc(this.db, this.collection, id).withConverter(this.gameConverter);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? (docSnap.data() as GameModel) : undefined;
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

  async joinGame({ id, inviteeColor, inviteeId }: JoinGameArgs): Promise<void> {
    await this.update(id, { inviteeId, inviteeColor, startedAt: new Date() });
  }

  async finishGame({ id, winnerId }: FinishGameArgs): Promise<void> {
    await this.update(id, { winnerId, endedAt: new Date() });
  }

  async unfinishGame(id: string): Promise<void> {
    await this.update(id, { winnerId: deleteField(), endedAt: deleteField() });
  }
}

export const gameService = new GameService(firebaseClient.firestore);
