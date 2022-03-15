import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import { withAuthUser } from 'next-firebase-auth'
import {
  GetStaticPaths,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next/types'
import { VFC } from 'react'
import StoryLayout from '../../../components/templates/StoryLayout'
import { db as client, storiesCol } from '../../../firebase/clientApp'
import usePage from '../../../hooks/usePage'
import { Story as StoryType } from '../../../types'
import { Page } from '../../../types/index'
import { getTimestampString } from '../../../utils/common'
type StoryProps = {
  story: StoryType
  pages: Page[] | null
}

const Story: VFC<StoryProps> = ({ story, story: { scope, author }, pages }) => {
  const conditionalPage = usePage(story, 1)

  return (
    <StoryLayout
      author={author}
      story={story}
      page={scope === 'public' ? pages && pages[0] : conditionalPage}
    />
  )
}

export default withAuthUser<StoryProps>()(Story)

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
    ) as DocumentReference<StoryType>
  )

  const docData = docSnap.data()
  if (!docData) {
    throw new Error('story not found')
  }

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
      ? (pageDocs.docs.map((doc) => ({
          ...doc.data(),
          timestamp: getTimestampString(doc),
        })) as Page[])
      : null

  return {
    props: {
      story,
      pages,
    },
    revalidate: 10,
  }
}
