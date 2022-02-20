import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { GetStaticPaths, GetStaticProps } from 'next/types'
import Layout from '../../../components/templates/Layout'
import { db } from '../../../firebase/clientApp'
import { getTimestampString } from '../../../utils/common'

type PageProps = {
  story: {
    title: string
  }
  page: {
    content: string
    number: number
  }
}

const Page = ({ story: { title }, page: { content, number } }: PageProps) => {
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

  const paths = pageSnapshots.docs
    .filter((page) => !!page.ref.parent?.parent)
    .map((page) => ({
      params: {
        id: page.ref.parent.parent.id,
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
      props: {
        page: {},
      },
    }
  }

  const storySnapshot = await getDoc(doc(db, 'stories', `${context.params.id}`))
  const pageQuery = query(
    collection(db, 'stories', `${context.params.id}`, 'pages'),
    where('number', '==', parseInt(`${context.params.page}`))
  )
  const pageSnapshot = await getDocs(pageQuery)
  const pageData = pageSnapshot.docs[0]

  if (pageSnapshot.empty) {
    return {
      props: {},
    }
  }

  return {
    props: {
      story: {
        ...storySnapshot.data(),
        timestamp: getTimestampString(storySnapshot),
      },
      page: {
        ...pageData.data(),
        timestamp: getTimestampString(pageData),
      },
    },
  }
}
