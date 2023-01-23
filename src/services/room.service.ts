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
import { RoomModel, CreateRoomInput } from './types';
import { firebaseClient } from '@common/firebase';
import { doc } from 'firebase/firestore';

export class RoomService {
  private readonly db: Firestore;

  collection = 'rooms';

  constructor(db: Firestore) {
    this.db = db;
  }

  private readonly converter = {
    toFirestore: (doc: DocumentData) => ({
      ...doc,
      createdAt: Timestamp.fromDate(doc.createdAt),
    }),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
      const data = snapshot.data(options) as any;
      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt.toDate(),
      } as RoomModel;
    },
  };

  async create(input: CreateRoomInput): Promise<RoomModel> {
    const requestRef = await addDoc(collection(this.db, this.collection), {
      ...input,
      createdAt: new Date(),
    });
    const requestSnap = await getDoc(requestRef.withConverter(this.converter));
    return requestSnap.data() as RoomModel;
  }

  async get(id: string): Promise<RoomModel | undefined> {
    const docSnap = await getDoc(doc(this.db, this.collection, id).withConverter(this.converter));
    return docSnap.data() as RoomModel;
  }
}

export const roomService = new RoomService(firebaseClient.firestore);
