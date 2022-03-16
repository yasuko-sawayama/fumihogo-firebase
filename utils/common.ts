import {
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore'
import { AuthUser } from 'next-firebase-auth'
import { pageSubCol, storyDoc } from '../firebase/clientApp'
import { Story } from '../types'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const getStoryData = async (id: string) => {
  const storySnapshot = await getDoc(storyDoc(id))
  if (storySnapshot.exists()) {
    const storyData = storySnapshot.data()

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

    if (pageData.exists()) {
      return {
        ...pageData.data(),
      }
    }
  }
}

export const getTimestampString = (
  doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot
): string => doc.data()?.timestamp?.toDate()?.toLocaleString('ja-JP') || ''
