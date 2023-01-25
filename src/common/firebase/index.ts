import { FirebaseOptions, FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import {
  Messaging,
  getMessaging,
  getToken,
  isSupported as getIsSupported,
} from 'firebase/messaging';
import { config as devConfig, config } from '../../config/dev';
import { config as testConfig } from '../../config/test';
import { Auth, getAuth } from 'firebase/auth';

const isTest = process.env.NODE_ENV === 'test';

export class FirebaseClient {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  messaging: Messaging;

  constructor(config: FirebaseOptions, name: string) {
    this.app = initializeApp(config, name);
    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.messaging = getMessaging(this.app);
  }

  async getPushToken(): Promise<string | null> {
    try {
      const serviceWorkerRegistration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );

      const isSupported = await getIsSupported();
      if (!this.messaging || !isSupported) return null;

      return await getToken(this.messaging, {
        vapidKey: config.firebase.vapidKey,
        serviceWorkerRegistration,
      });
    } catch (err) {
      console.error('getPushToken error', err);
      return null;
    }
  }
}

export const firebaseClient = new FirebaseClient(
  isTest ? testConfig.firebase : devConfig.firebase,
  'checkers'
);
