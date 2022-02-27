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
import StoryLayout from '../../../components/templates/StoryLayout'
import { db as client } from '../../../firebase/clientApp'
import usePage from '../../../hooks/usePage'
import { Story, User } from '../../../types'
import { PageData } from '../../../types/index'
import { getTimestampString } from '../../../utils/common'
import { auth } from '../../../utils/firebase-admin'
type StoryProps = {
  author: User
  story: Story
  pages: PageData[] | null
}

const Story = ({ author, story, story: { id, scope }, pages }: StoryProps) => {
  const conditionalPage = usePage(id, 1, scope)

  return (
    <StoryLayout
      author={author}
      story={story}
      page={scope === 'public' ? pages && pages[0] : conditionalPage}
    />
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

  // 著者データ取得
  const authorRecord = (await auth.getUser(docData.userId)) as User

  // FIXME: キャストする方法がわからないので一つずつ代入
  const author: User = {
    uid: authorRecord.uid,
    displayName: authorRecord.displayName,
    photoURL: authorRecord.photoURL,
    reloadUserInfo: {
      screenName: authorRecord.reloadUserInfo?.screenName || '',
    },
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
      ? pageDocs.docs.map((doc) => ({
          ...doc.data(),
          timestamp: getTimestampString(doc),
        }))
      : null

  return {
    props: {
      author,
      story,
      pages,
    },
    revalidate: 10,
  }
}
