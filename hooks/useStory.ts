import { doc, DocumentSnapshot, getDoc } from 'firebase/firestore'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { db } from '../firebase/clientApp'
import { Story } from '../types'

export default function useStory(id: string): [Story, number] {
  const [storyInfo, setStoryInfo] = useState<Story>()
  const [lastPage, setLastPage] = useState<number>(1)

  const getStory = async () => {
    if (!id || storyInfo?.id === id) {
      return
    }

    const docRef = doc(db, 'stories', id)
    const storySnapshot = (await getDoc(docRef)) as DocumentSnapshot<Story>

    if (!storySnapshot) {
      router.push('/stories')
    }
    setStoryInfo(storySnapshot?.data())
    setLastPage((storySnapshot.data()?.totalPages as number) + 1)
  }

  useEffect(() => {
    getStory()
  }, [id])

  return [storyInfo as Story, lastPage]
}
