import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { GetStaticPaths, GetStaticProps } from 'next/types'
import Layout from '../../../components/templates/Layout'
import { db as client } from '../../../firebase/clientApp'
import usePage from '../../../hooks/usePage'
import { getTimestampString } from '../../../utils/common'
import db from '../../../utils/db'

type StoryProps = {
  story: {
    id: string
    title: string
    description?: string
    restriction?: boolean
    timestamp?: Date
    scope: Scope
  }
  pages: [{ content: string }]
}

const Story = ({
  story: { id, title, description, restriction, timestamp, scope },
  pages,
}: StoryProps) => {
  const conditionalPage = usePage(id, 1, scope)

  return (
    <Layout title={title}>
      <header>
        <h1>{title}</h1>
        <div>{description}</div>
        <p>{restriction && 'R-18'}</p>
        <p>{timestamp}</p>
        {scope === 'public' ? (
          <p>{JSON.stringify(pages)}</p>
        ) : (
          <p>{conditionalPage && JSON.stringify(conditionalPage)}</p>
        )}

        <p>公開範囲</p>
        <p>{scope}</p>
      </header>
    </Layout>
  )
}

export default Story

export const getStaticPaths: GetStaticPaths = async () => {
  const stories = await db.collection('stories').get()
  const paths = stories.docs.map((story) => ({
    params: {
      id: story.id,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context?.params?.id) {
    return null
  }

  const docSnap = await getDoc(
    doc(client, 'stories', context.params.id.toString())
  )

  const docData = docSnap.data()

  if (docSnap.exists()) {
    const story = {
      id: docSnap.id,
      ...docData,
      timestamp: getTimestampString(docSnap),
    }

    const pageDocs = await getDocs(
      collection(client, 'stories', docSnap.id, 'pages')
    )

    // 公開範囲がpublicの時だけページ内容を取得
    const pages =
      docData?.scope === 'public'
        ? pageDocs.docs.map((doc) => ({
            ...doc.data(),
            timestamp: getTimestampString(doc),
          }))
        : {}

    return {
      props: {
        story,
        pages,
      },
      revalidate: 10,
    }
  }

  return null
}
