import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import {
  AuthAction,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { VFC } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Spinner } from '../../../../components/atoms'
import PageForm from '../../../../components/organisms/PageForm'
import { Layout } from '../../../../components/templates'
import { db } from '../../../../firebase/clientApp'
import { Page } from '../../../../types'
import { Story } from '../../../../types/index'
import { getStoryData } from '../../../../utils/common'

type Props = {
  story: Story
  lastPage: number
}
const NewPage: VFC<Props> = ({ story, lastPage }) => {
  const router = useRouter()
  const { id } = router.query

  const onSubmit: SubmitHandler<Page> = async (data) => {
    const docId = id?.toString() || ''

    try {
      const docRef = doc(db, 'stories', docId)
      const pageCollectinRef = collection(docRef, 'pages')

      await addDoc(pageCollectinRef, {
        ...data,
        number: lastPage,
        timestamp: serverTimestamp(),
      })

      await updateDoc(docRef, {
        totalPages: lastPage,
      })

      console.log('Page written in document: ', docId)
      router.push(`/stories/${docId}/pages/${lastPage}`)
      toast.success('ページを追加しました!')
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  return (
    <Layout title="新しいページを書く">
      <h2>タイトル：{story?.title}</h2>
      <div className="mt-5 sm:col-span-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          新しくページを追加することができます。
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          ページ単位で更新することができます。新しいページを書いてください。
        </p>
      </div>
      {story && (
        <PageForm onSubmit={onSubmit} pageNumber={lastPage} storyInfo={story} />
      )}
    </Layout>
  )
}

export default withAuthUser<Props>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Spinner,
})(NewPage)

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

    if (storyData && storyData.author.uid === AuthUser.id) {
      return {
        props: {
          story: storyData as Story,
          lastPage: storyData.totalPages + 1,
        },
      }
    }

    // 編集権限がない場合は小説一覧に飛ばす
    return {
      redirect: {
        destination: `/stories/`,
        permanent: false,
      },
    }
  }
)
