import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { GetStaticPaths, GetStaticProps } from 'next/types'
import Layout from '../../../components/templates/Layout'
import { db as client } from '../../../firebase/clientApp'
import { getTimestampString } from '../../../utils/common'
import db from '../../../utils/db'

type StoryProps = {
  story: {
    title: string
    description?: string
    restriction?: boolean
    timestamp?: Date
  }
  pages: [{ content: string }]
}

const Story = ({
  story: { title, description, restriction, timestamp },
  pages,
}: StoryProps) => (
  <Layout title={title}>
    <header>
      <h1>{title}</h1>
      <div>{description}</div>
      <p>{restriction && 'R-18'}</p>
      <p>{timestamp}</p>
      <p>{JSON.stringify(pages)}</p>
    </header>
  </Layout>
)

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
    return {
      props: {},
    }
  }

  const docSnap = await getDoc(
    doc(client, 'stories', context.params.id.toString())
  )

  if (docSnap.exists()) {
    const story = {
      ...docSnap.data(),
      timestamp: getTimestampString(docSnap),
    }

    const pageDocs = await getDocs(
      collection(client, 'stories', docSnap.id, 'pages')
    )

    const pages = pageDocs.docs.map((doc) => ({
      ...doc.data(),
      timestamp: getTimestampString(doc),
    }))

    return {
      props: {
        story,
        pages,
      },
      revalidate: 10,
    }
  } else {
    return {
      props: {},
    }
  }
}
