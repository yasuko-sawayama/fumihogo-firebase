import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next/types'
import Layout from '../../../../../components/templates/Layout'
import { db } from '../../../../../firebase/clientApp'
import { getTimestampString } from '../../../../../utils/common'

type PageProps = {
  story?: {
    id: string
    title: string
  }
  page?: {
    id: string
    content: string
    number: number
  }
}

const Page = (props: PageProps) => {
  if (!props.story) return <>Page Not Found</>
  const { title, id } = props.story
  if (!props.page)
    return (
      <Layout title={`${title}`}>
        <p>公開は許可されていません。</p>
      </Layout>
    )
  const { number, content } = props.page

  console.log(props)

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
    <Layout title={`${title}:page${number}`} headerButtons={buttons}>
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

export const getStaticPaths: GetStaticPaths = async () => {
  const pageQuery = query(collectionGroup(db, 'pages'))
  const pageSnapshots = await getDocs(pageQuery)

  pageSnapshots.docs.forEach(async (doc) => {})
  const paths = pageSnapshots.docs
    .filter((page) => !!page.ref.parent?.parent)
    .map((page) => ({
      params: {
        id: page.ref.parent?.parent?.id,
        page: page.data().number?.toString() || '1',
      },
    }))

  return {
    paths,
    fallback: false,
  }
}

// TODO: ServerSidePropsにして認証情報と照合する
export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params?.id || !context.params?.page) {
    return {
      props: {},
    }
  }

  const storySnapshot = await getDoc(doc(db, 'stories', `${context.params.id}`))
  const storyData = {
    id: storySnapshot.id,
    ...storySnapshot.data(),
    timestamp: getTimestampString(storySnapshot),
  }

  // 小説が取得できなかった場合はとりあえず{}を返しておく
  if (!storySnapshot.exists()) {
    return {
      props: {},
    }
  }

  const emptyPageProps = {
    props: {
      story: storyData,
    },
    revalidate: 10,
  }

  // 公開範囲がpublicでない場合はページの中身を返さない
  if (storySnapshot.data().scope !== 'public') {
    return emptyPageProps
  }

  const pageQuery = query(
    collection(db, 'stories', `${context.params.id}`, 'pages'),
    where('number', '==', parseInt(`${context.params.page}`))
  )

  const pageSnapshot = await getDocs(pageQuery)
  const pageData = pageSnapshot.docs[0]

  // ページの中身が取得できなかった場合はページの中身を返さない
  if (pageSnapshot.empty) {
    return emptyPageProps
  }

  // publicなページのみ中身付きでレンダリングする
  return {
    props: {
      story: storyData,
      page: {
        ...pageData.data(),
        timestamp: getTimestampString(pageData),
      },
      revalidate: 10,
    },
  }
}
