import { getDocs, query, setDoc, where } from 'firebase/firestore'
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Spinner } from '../../../../../components/atoms'
import PageForm from '../../../../../components/organisms/PageForm'
import { Layout } from '../../../../../components/templates'
import { pageDoc, pageSubCol } from '../../../../../firebase/clientApp'
import useStory from '../../../../../hooks/useStory'
import { Page } from '../../../../../types'
import { getStoryData } from '../../../../../utils/common'

type Props = {
  pageData: Page
  pageId: number
}
const PageEdit: FC<Props> = ({ pageData, pageId }) => {
  const router = useRouter()
  const { id, page } = router.query
  const pageNumber = parseInt(page as string)

  const [storyInfo] = useStory(id as string)
  const user = useAuthUser()
  const formData: Page = pageData
  const onSubmit: SubmitHandler<Page> = async (data) => {
    const storyId = id?.toString() || ''

    try {
      // TODO: Story情報更新
      const pageRef = pageDoc(storyId, pageId.toString())
      await setDoc(pageRef, data)
      router.push(`/stories/${id}/pages/${page}`)
      toast.success('編集しました')
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  return (
    <Layout title="ページを編集する">
      {storyInfo && (
        <PageForm
          onSubmit={onSubmit}
          pageNumber={pageNumber}
          storyInfo={storyInfo}
          defaultValues={formData}
        />
      )}
    </Layout>
  )
}

export default withAuthUser<Props>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Spinner,
})(PageEdit)

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

    if (storyData && storyData.userId === AuthUser.id) {
      const pageQuery = query(
        pageSubCol(storyData.id),
        where('number', '==', parseInt(`${params.page}`))
      )

      const pageSnapshot = await getDocs(pageQuery)
      const pageData = pageSnapshot.docs[0]

      if (pageData.exists()) {
        return {
          props: {
            //storyData,
            pageData: pageData.data(),
            pageId: pageData.id,
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
