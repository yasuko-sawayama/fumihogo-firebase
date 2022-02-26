import { initializeApp } from 'firebase/app'
import {
  collection,
  CollectionReference,
  connectFirestoreEmulator,
  DocumentData,
  getFirestore,
} from 'firebase/firestore'
/* import 'firebase/auth'
import 'firebase/firestore' */

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}

const firebase = initializeApp(clientCredentials)
// export const analytics = getAnalytics(firebase)

export default firebase

export const db = getFirestore()

if (
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' ||
  process.env.NODE_ENV === 'test'
) {
  console.log('setup to connect local firebase emulator suite')
  try {
    const config = require('./firebase.json')
    connectFirestoreEmulator(
      db,
      config.emulators.firestore.host,
      config.emulators.firestore.port
    )
  } catch {
    // do nothing
  }
}

// This is just a helper to add the type to the db responses
export const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>
}