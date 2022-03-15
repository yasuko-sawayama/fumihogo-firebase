import {
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore'
import { AuthUser } from 'next-firebase-auth'
import { pageSubCol, storiesCol } from '../firebase/clientApp'
import { Story } from '../types'

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

export const getPageData = async (
  storyData: Story,
  user: AuthUser,
  pageNumber: number
) => {
  if (!storyData?.id) {
    throw new Error('Story Data Missing')
  }

  const checkScope = () => {
    switch (storyData.scope) {
      case 'public':
        return true
      case 'login':
        return !!user.id
    }

    return false
  }

  if (checkScope()) {
    const pageQuery = query(
      pageSubCol(storyData.id),
      where('number', '==', parseInt(`${pageNumber}`))
    )

    const pageSnapshot = await getDocs(pageQuery)
    const pageData = pageSnapshot.docs[0]

    if (pageData) {
      return {
        ...pageData.data(),
        timestamp: getTimestampString(pageData),
      }
    }
  }
}

export const getTimestampString = (
  doc: QueryDocumentSnapshot | DocumentSnapshot
): string => doc.data()?.timestamp?.toDate()?.toLocaleString('ja-JP') || ''
