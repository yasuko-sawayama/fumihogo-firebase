import Link from 'next/link'
import { GetStaticProps } from 'next/types'
import Layout from '../../components/templates/Layout'
import { Story } from '../../types'
import db from '../../utils/db'

type Props = {
  stories: Story[]
}

const StoriesIndex = ({ stories }: Props) => (
  <Layout title="小説一覧">
    <ul>
      {stories.map((story) => (
        <li key={story.id}>
          <Link href={`/stories/${story.id}`}>
            <a>
              {story.title}（{story.scope}）
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
)

export default StoriesIndex

export const getStaticProps: GetStaticProps = async () => {
  const res = await db.collection('stories').get()

  const stories = res.docs.map((story) => ({
    id: story.id,
    ...story.data(),
    timestamp: story.data()?.timestamp?.toDate()?.toLocaleString('ja-JP') || '',
  }))

  return {
    props: {
      stories,
    },
    revalidate: 10,
  }
}
