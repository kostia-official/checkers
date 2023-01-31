import {
  collection,
  addDoc,
  getDoc,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Firestore,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { GamePlayerModel, CreateGamePlayerInput, UpdateGamePlayerInput } from './types';
import { firebaseClient } from '@common/firebase';
import { getDocs, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { WithFieldValue } from '@common/utilTypes';

export interface GetGamePlayerArgs {
  gameId: string;
  userId: string;
}

export class GamePlayerService {
  private readonly db: Firestore;

  collection = 'gamePlayers';

  constructor(db: Firestore) {
    this.db = db;
  }

  private readonly converter = {
    toFirestore: (doc: DocumentData) => ({
      ...doc,
      joinedAt: Timestamp.fromDate(doc.joinedAt),
      lastMovedAt: Timestamp.fromDate(doc.lastMovedAt),
    }),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
      const data = snapshot.data(options) as any;
      return {
        ...data,
        id: snapshot.id,
        joinedAt: data.joinedAt?.toDate(),
        lastMovedAt: data.lastMovedAt?.toDate(),
      } as GamePlayerModel;
    },
  };

  async create(input: CreateGamePlayerInput): Promise<GamePlayerModel> {
    const requestRef = await addDoc(collection(this.db, this.collection), {
      ...input,
      joinedAt: new Date(),
    });
    const requestSnap = await getDoc(requestRef.withConverter(this.converter));
    return requestSnap.data() as GamePlayerModel;
  }

  onUpdated(id: string, cb: (data: GamePlayerModel | undefined) => void) {
    const docRef = doc(this.db, this.collection, id).withConverter(this.converter);

    return onSnapshot(docRef, (querySnapshot) => {
      cb(querySnapshot.data());
    });
  }

  async get({ gameId, userId }: GetGamePlayerArgs): Promise<GamePlayerModel | undefined> {
    const docsRef = collection(this.db, this.collection).withConverter(this.converter);
    const q = query(docsRef, where('gameId', '==', gameId), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs[0]?.data();
  }

  async update(id: string, input: WithFieldValue<UpdateGamePlayerInput>): Promise<GamePlayerModel> {
    const docRef = doc(this.db, this.collection, id);
    await updateDoc(docRef, input);

    const docSnap = await getDoc(docRef.withConverter(this.converter));
    return docSnap.data() as GamePlayerModel;
  }

  async setReady(id: string, timeEndsAt?: Date): Promise<GamePlayerModel> {
    return this.update(id, { isReady: true, ...(timeEndsAt && { timeEndsAt }) });
  }
}

export const gamePlayerService = new GamePlayerService(firebaseClient.firestore);
