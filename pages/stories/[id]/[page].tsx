import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore'
import { GetStaticPaths, GetStaticProps } from 'next/types'
import Layout from '../../../components/templates/Layout'
import { db } from '../../../firebase/clientApp'
import { getTimestampString } from '../../../utils/common'

type PageProps = {
  story?: {
    title: string
  }
  page?: {
    content: string
    number: number
  }
}

const Page = (props: PageProps) => {
  if (!props.story) return <>Page Not Found</>
  const { title } = props.story
  if (!props.page)
    return (
      <Layout title={`${title}:page${number}`}>
        <p>公開は許可されていません。</p>
      </Layout>
    )
  const { number, content } = props.page

  return (
    <Layout title={`${title}:page${number}`}>
      <>
        <p>page: {number}</p>
        {content}
      </>
    </Layout>
  )
}

export default Page

export const getStaticPaths: GetStaticPaths = async () => {
  const pageQuery = query(
    collectionGroup(db, 'pages'),
    where('number', '==', 1)
  )
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

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params?.id || !context.params?.page) {
    return {
      props: {},
    }
  }

  const storySnapshot = await getDoc(doc(db, 'stories', `${context.params.id}`))
  const storyData = {
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
