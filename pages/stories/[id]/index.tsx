import { withAuthUserTokenSSR } from 'next-firebase-auth'
import { VFC } from 'react'
import StoryLayout from '../../../components/templates/StoryLayout'
import { Story as StoryType } from '../../../types'
import { Page } from '../../../types/index'
import { getPageData, getStoryData } from '../../../utils/common'

type StoryProps = {
  story: StoryType
  page?: Page | null
  authMessage?: string | null
}

const Story: VFC<StoryProps> = ({
  story,
  story: { author },
  page,
  authMessage,
}) => {
  return (
    <StoryLayout
      author={author}
      story={story}
      page={page}
      authMessage={authMessage}
    />
  )
}

export default Story

export const getServerSideProps = withAuthUserTokenSSR()(
  async ({ params, AuthUser }) => {
    if (!params?.id || typeof params.id !== 'string') {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    const storyData = await getStoryData(params.id)
    if (storyData) {
      const pageData = await getPageData(storyData, AuthUser, 1)

      if (pageData) {
        return {
          props: {
            story: storyData,
            page: pageData,
          },
        }
      }

      return {
        props: {
          story: storyData,
          authMessage: '閲覧できません',
        },
      }
    }

    // 小説データが取得できない場合はトップに飛ばす
    return {
      redirect: {
        destination: `/stories/`,
        permanent: false,
      },
    }
  }
)
