import { getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { GetStaticProps } from 'next/types'
import Layout from '../../components/templates/Layout'
import { storiesCol } from '../../firebase/clientApp'
import { Story } from '../../types'
import { getTimestampString } from '../../utils/common'

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
  const res = await getDocs(storiesCol)

  const stories = res.docs.map((story) => ({
    ...story.data(),
    id: story.id,
    timestamp: getTimestampString(story),
  }))

  return {
    props: {
      stories,
    },
    revalidate: 10,
  }
}
