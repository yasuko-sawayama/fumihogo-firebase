import { doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import Link from 'next/link'
import { VFC } from 'react'
import { StoryLayout } from '../../../../../components/templates'
import { pageSubCol, storiesCol } from '../../../../../firebase/clientApp'
import { Page, Story } from '../../../../../types'
import { getTimestampString } from '../../../../../utils/common'

type PageProps = {
  story: Story
  page: Page
  myStory: boolean
}

const Page: VFC<PageProps> = ({ story, story: { id }, page, myStory }) => {
  const buttons = [
    <Link href={`/stories/${id}/pages/{page.id}/edit`} key="edit" passHref>
      <button
        type="button"
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        TODO: 編集
      </button>
    </Link>,
    <Link href={`/stories/${id}/pages/new`} key="publish" passHref>
      <button
        type="button"
        className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
      >
        新規ページ
      </button>
    </Link>,
  ]

  return <StoryLayout author={story.author} story={story} page={page} />
}

export default withAuthUser<PageProps>()(Page)

export const getServerSideProps = withAuthUserTokenSSR()(
  async ({ params, AuthUser }) => {
    if (!params?.id || !params?.page) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    const storySnapshot = await getDoc(doc(storiesCol, `${params.id}`))
    const storyData = {
      id: storySnapshot.id,
      ...storySnapshot.data(),
      timestamp: getTimestampString(storySnapshot),
    }

    const checkScope = () => {
      switch (storyData.scope) {
        case 'public':
          return true
        case 'login':
          return !!AuthUser.id
      }

      return false
    }

    if (storySnapshot.exists() && checkScope()) {
      const pageQuery = query(
        pageSubCol(storyData.id),
        where('number', '==', parseInt(`${params.page}`))
      )

      const pageSnapshot = await getDocs(pageQuery)
      const pageData = pageSnapshot.docs[0]

      if (pageData) {
        return {
          props: {
            story: storyData,
            page: {
              ...pageData.data(),
              timestamp: getTimestampString(pageData),
            },
            myStory: storyData.userId === AuthUser.id,
          },
        }
      }
    }

    // 閲覧権限がない場合は小説トップに飛ばす
    return {
      redirect: {
        destination: `/stories/${params?.id}/`,
        permanent: false,
      },
    }
  }
)
