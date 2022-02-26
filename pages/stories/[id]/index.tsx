import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import {
  GetStaticPaths,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next/types'
import { storiesCol } from '../../../components/models/index'
import Layout from '../../../components/templates/Layout'
import StoryTemplate from '../../../components/templates/StoryTemplate'
import { db as client } from '../../../firebase/clientApp'
import usePage from '../../../hooks/usePage'
import useUser from '../../../hooks/useUser'
import { Story } from '../../../types'
import { PageData } from '../../../types/index'
import { getTimestampString } from '../../../utils/common'

type StoryProps = {
  story: Story
  pages: PageData[] | null
}

const Story = ({ story, story: { id, scope }, pages }: StoryProps) => {
  const [user] = useUser({ redirectTo: '/auth' })
  const conditionalPage = usePage(id, 1, scope)

  return (
    <Layout>
      <StoryTemplate
        story={story}
        page={scope === 'public' ? pages && pages[0] : conditionalPage}
      />
    </Layout>
  )
}

export default Story

export const getStaticPaths: GetStaticPaths = async () => {
  const stories = await getDocs(storiesCol)

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

type PageParams = {
  id: string
}

export const getStaticProps = async (
  context: GetStaticPropsContext<PageParams>
): Promise<GetStaticPropsResult<StoryProps>> => {
  const docSnap = await getDoc(
    doc(
      client,
      'stories',
      context?.params?.id.toString() || 'xxx'
    ) as DocumentReference<Story>
  )

  const docData = docSnap.data()!

  const story = {
    ...docData,
    id: docSnap.id,
    timestamp: getTimestampString(docSnap),
  }

  const pageRef = collection(storiesCol, docSnap.id, 'pages')
  const pageDocs = await getDocs(pageRef)

  // 公開範囲がpublicの時だけページ内容を取得
  const pages =
    docData?.scope === 'public'
      ? pageDocs.docs.map((doc) => ({
          ...doc.data(),
          timestamp: getTimestampString(doc),
        }))
      : null

  return {
    props: {
      story,
      pages,
    },
    revalidate: 10,
  }
}
