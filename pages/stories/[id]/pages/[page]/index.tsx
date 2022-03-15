import { getDocs, query, where } from 'firebase/firestore'
import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import { VFC } from 'react'
import { StoryLayout } from '../../../../../components/templates'
import { pageSubCol } from '../../../../../firebase/clientApp'
import { Page, Story } from '../../../../../types'
import { getStoryData, getTimestampString } from '../../../../../utils/common'

type PageProps = {
  story: Story
  page: Page
  myStory: boolean
}

const Page: VFC<PageProps> = ({ story, page }) => {
  return <StoryLayout author={story.author} story={story} page={page} />
}

export default withAuthUser<PageProps>()(Page)

export const getServerSideProps = withAuthUserTokenSSR()(
  async ({ params, AuthUser }) => {
    if (!params?.id || typeof params.id !== 'string' || !params?.page) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    const storyData = await getStoryData(params.id)

    const checkScope = () => {
      switch (storyData?.scope) {
        case 'public':
          return true
        case 'login':
          return !!AuthUser.id
      }

      return false
    }

    if (storyData && checkScope()) {
      const pageQuery = query(
        pageSubCol(storyData.id),
        where('number', '==', parseInt(`${params.page}`))
      )

      const pageSnapshot = await getDocs(pageQuery)
      const pageData = pageSnapshot.docs[0]

      if (pageData) {
        return {
          props: {
            story: storyData,
            page: {
              ...pageData.data(),
              timestamp: getTimestampString(pageData),
            },
            myStory: storyData.userId === AuthUser.id,
          },
        }
      }
    }

    // 閲覧権限がない場合は小説トップに飛ばす
    return {
      redirect: {
        destination: `/stories/${params?.id}/`,
        permanent: false,
      },
    }
  }
)
