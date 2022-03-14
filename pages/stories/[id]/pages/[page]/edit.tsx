import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { SubmitHandler } from 'react-hook-form'
import { Spinner } from '../../../../../components/atoms'
import PageForm from '../../../../../components/organisms/PageForm'
import { Layout } from '../../../../../components/templates'
import useStory from '../../../../../hooks/useStory'
import { Page } from '../../../../../types'

const onSubmit: SubmitHandler<Page> = (data) => {
  console.log(data)
}

const PageEdit = () => {
  const router = useRouter()
  const { id, page } = router.query
  const pageNumber = parseInt(page as string)

  const [storyInfo] = useStory(id as string)
  const user = useAuthUser()

  return (
    <Layout title="ページを編集する">
      {storyInfo && (
        <PageForm
          onSubmit={onSubmit}
          pageNumber={pageNumber}
          storyInfo={storyInfo}
        />
      )}
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Spinner,
})(PageEdit)
