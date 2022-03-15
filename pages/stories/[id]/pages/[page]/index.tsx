import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import { VFC } from 'react'
import { StoryLayout } from '../../../../../components/templates'
import { Page, Story } from '../../../../../types'
import { getPageData, getStoryData } from '../../../../../utils/common'

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
    if (
      !params?.id ||
      typeof params.id !== 'string' ||
      !params?.page ||
      typeof params.page !== 'string'
    ) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    const storyData = await getStoryData(params.id)

    if (storyData) {
      const pageData = await getPageData(
        storyData,
        AuthUser,
        parseInt(params.page)
      )

      if (pageData) {
        return {
          props: {
            story: storyData,
            page: pageData,
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
