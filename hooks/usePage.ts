import { User } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db as client } from '../firebase/clientApp'
import { PageData, Scope } from '../types'
import useUser from './useUser'

type AuthUser = boolean | User | undefined | Error | null

const checkScope = (user: AuthUser, scope: Scope) => {
  if (scope === 'public' || (user && scope === 'login')) {
    return true
  }

  return false
}

export default function usePage(
  storyId: string,
  number: number,
  scope: Scope
): PageData | undefined {
  const [page, setPage] = useState<PageData>()
  const [user] = useUser()

  const getCurrentPage = async (storyId: string, number: number) => {
    const pageQuery = query(
      collection(client, 'stories', storyId, 'pages'),
      where('number', '==', number)
    )
    const pageDocs = await getDocs(pageQuery)
    const pageData = pageDocs.docs[0].data() as PageData

    if (!pageDocs.empty && pageDocs.docs[0]) {
      setPage(pageData)
    }
  }

  useEffect(() => {
    if (checkScope(user, scope)) {
      getCurrentPage(storyId, number)
    }
  }, [user, scope])

  return page
}
