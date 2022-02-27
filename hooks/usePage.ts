import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db as client } from '../firebase/clientApp'
import { PageData, Scope, User } from '../types'
import useUser from './useUser'

type AuthUser = boolean | User | undefined | Error | null

const checkScope = (user: AuthUser, scope: Scope) => {
  if (scope === 'public' || (user && scope === 'login')) {
    return true
  }

  return false
}

const getCurrentPage = async (
  storyId: string,
  number: number,
  setPage: any
) => {
  const pageQuery = query(
    collection(client, 'stories', storyId, 'pages'),
    where('number', '==', number)
  )
  const pageDocs = await getDocs(pageQuery)

  if (!pageDocs.empty && pageDocs.docs[0]) {
    const pageData = pageDocs.docs[0].data() as PageData
    setPage(pageData)
  }
}

export default function usePage(
  storyId: string,
  number: number,
  scope: Scope
): PageData | undefined {
  const [page, setPage] = useState<PageData>()
  const [user] = useUser()

  useEffect(() => {
    if (checkScope(user, scope)) {
      getCurrentPage(storyId, number, setPage)
    } else {
      setPage({
        number: 1,
        content: 'このページは表示できません。',
      })
    }
  }, [user, scope])

  return page!
}
