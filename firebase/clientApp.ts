import { getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  collection,
  CollectionReference,
  connectFirestoreEmulator,
  doc,
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { Page, Story } from '../types'
import { getTimestampString } from '../utils/common'

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

const firebase = getApps()[0] || initializeApp(clientCredentials)

// export const analytics = getAnalytics(firebase)

export default firebase

export const db = getFirestore()
export const auth = getAuth(firebase)

if (
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' ||
  process.env.NODE_ENV === 'test'
) {
  //console.log('setup to connect local firebase emulator suite')
  try {
    const config = require('./firebase.json')
    connectFirestoreEmulator(
      db,
      config.emulators.firestore.host,
      config.emulators.firestore.port
    )
    connectAuthEmulator(auth, `http://localhost:${config.emulators.auth.port}`)
  } catch {
    // do nothing
  }
}

// This is just a helper to add the type to the db responses
export const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>
}

const createDoc = <T = DocumentData>(collectionName: string, docId: string) => {
  return doc(db, collectionName, docId) as DocumentReference<T>
}

export const createSubCollection = <T = DocumentData>(
  parentCollectionName: string,
  parentId: string,
  collectionName: string
) => {
  return collection(db, parentCollectionName, parentId, collectionName)
}

const storyCoverter: FirestoreDataConverter<Story> = {
  toFirestore: (data) => ({
    ...data,
    timestamp: serverTimestamp(),
  }),
  fromFirestore: (snap: QueryDocumentSnapshot, options): Story => ({
    id: snap.id,
    ...(snap.data(options) as Story),
    timestamp: getTimestampString(snap),
  }),
}

export const storiesCol =
  createCollection<Story>('stories').withConverter(storyCoverter)

export const storyDoc = (docId: string) =>
  createDoc<Story>('stories', docId).withConverter(storyCoverter)

const pageConverter: FirestoreDataConverter<Page> = {
  toFirestore: (data) => ({
    ...data,
    timestamp: serverTimestamp(),
  }),
  fromFirestore: (snap: QueryDocumentSnapshot, options): Page => ({
    ...snap.data(options),
    content: snap.data().content || '',
    number: (snap.data().number as number) || 1,
    timestamp: getTimestampString(snap),
  }),
}

export const pageDoc = (parentId: string, pageId: string) =>
  doc(db, 'stories', parentId, 'pages', pageId).withConverter(
    pageConverter
  ) as DocumentReference<Page>

export const pageSubCol = (parentId: string) =>
  createSubCollection<Page>('stories', parentId, 'pages').withConverter(
    pageConverter
  )
