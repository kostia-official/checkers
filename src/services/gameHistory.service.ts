import {
  collection,
  addDoc,
  getDoc,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Firestore,
  DocumentData,
  Timestamp,
} from '@firebase/firestore';
import { AddGameHistoryInput, GameHistoryModel } from './types';
import { firebaseClient } from '@common/firebase';
import { BoardState, LimitedJumpsCount } from '@common/types';
import { getDocs, onSnapshot, query, where, doc, orderBy, deleteDoc } from 'firebase/firestore';

export class GameHistoryService {
  db: Firestore;
  collection = 'gameHistory';

  constructor(db: Firestore) {
    this.db = db;
  }

  gameHistoryConverter = {
    toFirestore: (doc: DocumentData) => ({
      ...doc,
      createdAt: Timestamp.fromDate(doc.createdAt),
      boardState: JSON.stringify(doc.boardState),
      limitedJumpsCount: JSON.stringify(doc.limitedJumpsCount),
    }),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
      const data = snapshot.data(options) as any;
      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt.toDate(),
        boardState: JSON.parse(data.boardState) as BoardState,
        limitedJumpsCount: JSON.parse(data.limitedJumpsCount) as LimitedJumpsCount,
      } as GameHistoryModel;
    },
  };

  async add(input: AddGameHistoryInput): Promise<GameHistoryModel> {
    const historyRef = collection(this.db, this.collection).withConverter(
      this.gameHistoryConverter
    );
    const id = doc(historyRef).id;
    const docRef = await addDoc(historyRef, {
      ...input,
      id,
      createdAt: new Date(),
    });
    const docSnap = await getDoc(docRef.withConverter(this.gameHistoryConverter));

    return docSnap.data() as GameHistoryModel;
  }

  onUpdatedByGameId(gameId: string, cb: (data: GameHistoryModel[]) => void) {
    const docsRef = collection(this.db, this.collection).withConverter(this.gameHistoryConverter);

    const q = query(docsRef, where('gameId', '==', gameId), orderBy('createdAt'));

    return onSnapshot(q, (querySnapshot) => {
      const items: GameHistoryModel[] = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      cb(items);
    });
  }

  async getByGameId(gameId: string): Promise<GameHistoryModel[]> {
    const docsRef = collection(this.db, this.collection).withConverter(this.gameHistoryConverter);

    const q = query(docsRef, where('gameId', '==', gameId), orderBy('createdAt'));
    const querySnapshot = await getDocs(q);

    const result: GameHistoryModel[] = [];
    querySnapshot.forEach((doc) => {
      result.push(doc.data());
    });

    return result;
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.db, this.collection, id));
  }
}

export const gameHistoryService = new GameHistoryService(firebaseClient.firestore);
