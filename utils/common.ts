import {
  doc,
  DocumentSnapshot,
  getDoc,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { storiesCol } from '../firebase/clientApp'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const getStoryData = async (id: string) => {
  const storySnapshot = await getDoc(doc(storiesCol, `${id}`))
  if (storySnapshot.exists()) {
    const storyData = {
      id: storySnapshot.id,
      ...storySnapshot.data(),
      timestamp: getTimestampString(storySnapshot),
    }

    return storyData
  }
}
export const getTimestampString = (
  doc: QueryDocumentSnapshot | DocumentSnapshot
): string => doc.data()?.timestamp?.toDate()?.toLocaleString('ja-JP') || ''
