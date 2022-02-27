const admin = require('firebase-admin')
import { applicationDefault } from 'firebase-admin/app'

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: applicationDefault(),
      projectId: 'fumihogo-3dbe6',
      databaseURL: 'https://fumihogo-3dbe6.firebaseio.com',
    })
  } catch (error) {
    console.log('Firebase admin initialization error', error.stack)
  }
}

export default admin

export const db = admin.firestore()
export const auth = admin.auth()
