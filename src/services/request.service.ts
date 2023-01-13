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
  query,
  where,
  orderBy,
  getDocs,
  Unsubscribe,
} from 'firebase/firestore';
import { RequestModel, CreateRequestInput, UpdateRequestInput } from './types';
import { firebaseClient } from '@common/firebase';
import { userService } from '@services/user.service';
import { getSnapshotData } from '@common/utils';
import { WithFieldValue } from '@common/utilTypes';

export class RequestService {
  private db: Firestore;
  private collection = 'requests';

  constructor(db: Firestore) {
    this.db = db;
  }

  private requestConverter = {
    toFirestore: (game: DocumentData) => ({
      ...game,
      createdAt: Timestamp.fromDate(game.createdAt),
      acceptedAt: Timestamp.fromDate(game.endedAt),
    }),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt.toDate(),
        acceptedAt: data.acceptedAt?.toDate(),
      } as RequestModel;
    },
  };

  async create(input: CreateRequestInput): Promise<RequestModel> {
    const requestRef = await addDoc(collection(this.db, this.collection), { ...input, createdAt: new Date() });
    const requestSnap = await getDoc(requestRef.withConverter(this.requestConverter));
    return requestSnap.data() as RequestModel;
  }

  private async getReceivedRequestsQuery(gameId: string) {
    const userId = await userService.getCurrentUserId();

    const docsRef = collection(this.db, this.collection).withConverter(this.requestConverter);
    return query(docsRef, where('gameId', '==', gameId), where('receiverId', '==', userId), orderBy('createdAt'));
  }

  async getReceivedRequests(gameId: string): Promise<RequestModel[]> {
    const q = await this.getReceivedRequestsQuery(gameId);
    const querySnapshot = await getDocs(q);

    return getSnapshotData(querySnapshot);
  }

  async onReceivedRequestsUpdated(gameId: string, cb: (data: RequestModel[]) => void): Promise<Unsubscribe> {
    const q = await this.getReceivedRequestsQuery(gameId);

    return onSnapshot(q, (querySnapshot) => {
      cb(getSnapshotData(querySnapshot));
    });
  }

  private async getSentRequestsQuery(gameId: string) {
    const userId = await userService.getCurrentUserId();

    const docsRef = collection(this.db, this.collection).withConverter(this.requestConverter);
    return query(docsRef, where('gameId', '==', gameId), where('senderId', '==', userId), orderBy('createdAt'));
  }

  async getSentRequests(gameId: string): Promise<RequestModel[]> {
    const q = await this.getSentRequestsQuery(gameId);
    const querySnapshot = await getDocs(q);

    return getSnapshotData(querySnapshot);
  }

  async onSentRequestsUpdated(gameId: string, cb: (data: RequestModel[]) => void) {
    const q = await this.getSentRequestsQuery(gameId);

    return onSnapshot(q, (querySnapshot) => {
      cb(getSnapshotData(querySnapshot));
    });
  }

  async update(id: string, input: WithFieldValue<UpdateRequestInput>): Promise<RequestModel> {
    const docRef = doc(this.db, this.collection, id);
    await updateDoc(docRef, input);

    const docSnap = await getDoc(docRef.withConverter(this.requestConverter));
    return docSnap.data() as RequestModel;
  }

  async accept(id: string): Promise<RequestModel> {
    return this.update(id, { acceptedAt: new Date() });
  }

  async decline(id: string): Promise<RequestModel> {
    return this.update(id, { declinedAt: new Date() });
  }

  async acknowledgeResponse(id: string): Promise<RequestModel> {
    return this.update(id, { responseAckAt: new Date() });
  }
}

export const requestService = new RequestService(firebaseClient.firestore);
