import { collection, getDocs, query, where } from 'firebase/firestore'
import { AuthUserContext, useAuthUser } from 'next-firebase-auth'
import { useEffect, useState } from 'react'
import { db as client } from '../firebase/clientApp'
import { PageData, Scope, Story } from '../types'

const checkScope = (user: AuthUserContext, scope: Scope) => {
  if (scope === 'public' || (user.id && scope === 'login')) {
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

const selectMessage = (scope: string) => {
  switch (scope) {
    case 'login':
      return 'ログインしないと表示されません'
  }
  return 'このページは表示できません。'
}

export default function usePage(
  story: Story,
  number: number
): PageData | undefined {
  const [page, setPage] = useState<PageData>()
  const user = useAuthUser()

  useEffect(() => {
    if (checkScope(user, story.scope)) {
      getCurrentPage(story.id, number, setPage)
    } else {
      setPage({
        number: 1,
        content: selectMessage(story.scope),
      })
    }
  }, [user, story.scope, number, story.id])

  return page!
}
