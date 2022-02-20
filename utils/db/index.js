import admin from 'firebase-admin'
import serviceAccount from './firebase-account.json'

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://fumihogo-3dbe6.firebaseio.com',
    })
  } catch (error) {
    console.log('Firebase admin initialization error', error.stack)
  }
}
export default admin.firestore()
