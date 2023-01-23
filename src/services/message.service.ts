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
import { MessageModel, SendMessageInput } from './types';
import { firebaseClient } from '@common/firebase';
import { query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { getSnapshotData } from '@common/utils';
import { userService } from '@services/user.service';

export class MessageService {
  private readonly db: Firestore;

  collection = 'messages';

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
      } as MessageModel;
    },
  };

  async send(input: SendMessageInput): Promise<MessageModel> {
    const userId = await userService.getCurrentUserId();
    const requestRef = await addDoc(collection(this.db, this.collection), {
      ...input,
      senderId: userId,
      createdAt: new Date(),
    });
    const requestSnap = await getDoc(requestRef.withConverter(this.converter));
    return requestSnap.data() as MessageModel;
  }

  private getRoomMessagesQuery(roomId: string) {
    const docsRef = collection(this.db, this.collection).withConverter(this.converter);
    return query(docsRef, where('roomId', '==', roomId), orderBy('createdAt'));
  }

  async getRoomMessages(roomId: string): Promise<MessageModel[] | undefined> {
    const q = this.getRoomMessagesQuery(roomId);
    const querySnapshot = await getDocs(q);

    return getSnapshotData(querySnapshot);
  }

  onRoomMessagesUpdated(gameId: string, cb: (data: MessageModel[]) => void) {
    const q = this.getRoomMessagesQuery(gameId);

    return onSnapshot(q, (querySnapshot) => {
      cb(getSnapshotData(querySnapshot));
    });
  }
}

export const messageService = new MessageService(firebaseClient.firestore);
