import { useRouter } from 'next/router'
import { SubmitHandler } from 'react-hook-form'
import PageForm from '../../../../../components/organisms/PageForm'
import { Layout } from '../../../../../components/templates'
import useStory from '../../../../../hooks/useStory'
import { PageData } from '../../../../../types'

const onSubmit: SubmitHandler<PageData> = (data) => {
  console.log(data)
}

const PageEdit = () => {
  const router = useRouter()
  const { id, page } = router.query
  const pageNumber = parseInt(page as string)

  const [storyInfo] = useStory(id as string)

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

export default PageEdit
