import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Spinner } from '../../../../components/atoms'
import PageForm from '../../../../components/organisms/PageForm'
import { Layout } from '../../../../components/templates'
import { db } from '../../../../firebase/clientApp'
import useStory from '../../../../hooks/useStory'
import { Page } from '../../../../types'

const NewPage = () => {
  const user = useAuthUser()
  const router = useRouter()
  const { id } = router.query

  // TODO: SSR化
  const [storyInfo, lastPage] = useStory(id as string)

  useEffect(() => {
    // 取得中は何もしない
    if (!user.id || !storyInfo || !storyInfo.author.uid) {
      return
    }

    if (user.id !== storyInfo.author.uid) {
      router.push('/')
    }
  }, [user, storyInfo, router])

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
      <h2>タイトル：{storyInfo?.title}</h2>
      <div className="mt-5 sm:col-span-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          新しくページを追加することができます。
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          ページ単位で更新することができます。新しいページを書いてください。
        </p>
      </div>
      {storyInfo && (
        <PageForm
          onSubmit={onSubmit}
          pageNumber={lastPage}
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
})(NewPage)
