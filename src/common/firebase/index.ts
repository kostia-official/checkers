import { FirebaseOptions, FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { config as devConfig } from '../../config/dev';
import { config as testConfig } from '../../config/test';
import { Auth, getAuth } from 'firebase/auth';

const isTest = process.env.NODE_ENV === 'test';

export class FirebaseClient {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;

  constructor(config: FirebaseOptions, name: string) {
    this.app = initializeApp(config, name);
    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }
}

export const firebaseClient = new FirebaseClient(isTest ? testConfig.firebase : devConfig.firebase, 'checkers');
