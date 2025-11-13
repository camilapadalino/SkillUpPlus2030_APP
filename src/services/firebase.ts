import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DB_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from '@env';


const firebaseConfig = {
  apiKey: FIREBASE_API_KEY || 'AIzaSyDUFnhvk6RVWlps7KuyfQ259bnS-C88bmE',
  authDomain: FIREBASE_AUTH_DOMAIN || 'mobile-globalsolution2.firebaseapp.com',
  databaseURL:
    FIREBASE_DB_URL ||
    'https://mobile-globalsolution2-default-rtdb.firebaseio.com',
  projectId: FIREBASE_PROJECT_ID || 'mobile-globalsolution2',
  storageBucket: FIREBASE_STORAGE_BUCKET || 'mobile-globalsolution2.appspot.com',
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID || '347204160737',
  appId: FIREBASE_APP_ID || '1:347204160737:web:e31c711f05ced398e07ba0',
};

const app = initializeApp(firebaseConfig);

const { getReactNativePersistence } = require('firebase/auth');


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


export const db = getDatabase(app);
