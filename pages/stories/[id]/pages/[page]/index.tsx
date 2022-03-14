import { doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { withAuthUserTokenSSR } from 'next-firebase-auth'
import Link from 'next/link'
import { storiesCol } from '../../../../../components/models/index'
import Layout from '../../../../../components/templates/Layout'
import { pageSubCol } from '../../../../../firebase/clientApp'
import { getTimestampString } from '../../../../../utils/common'

type PageProps = {
  story: {
    id: string
    title: string
  }
  page: {
    id: string
    content: string
    number: number
  }
  myStory: boolean
}

// withAuthUserTokenSSRを通すとInferGetServerSidePropsTypeが使えない？
const Page = ({
  story: { title, id },
  page: { number, content },
  myStory,
}: PageProps) => {
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

  return (
    <Layout
      title={`${title}:page${number}`}
      headerButtons={myStory ? buttons : null}
    >
      <>
        <p>page: {number}</p>
        <p>
          <Link href={`/stories/${id}/pages/new`}>
            <a>新規ページ</a>
          </Link>
        </p>
        {content}
      </>
    </Layout>
  )
}

export default Page

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
