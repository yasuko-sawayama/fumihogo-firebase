import {
  addDoc,
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  BasicInfoFieldsArea,
  CancelButton,
  Form,
  Input,
  SubmitButton,
  TextArea,
} from '../../../../components/molecurles/Form'
import { Layout } from '../../../../components/templates'
import { db } from '../../../../firebase/clientApp'
import useUser from '../../../../hooks/useUser'
import { PageData, Story } from '../../../../types'

const resolver: Resolver<PageData> = async (values) => {
  return {
    values: {
      ...values,
      number: values.number as number,
    },
    errors: {},
  }
}

const NewPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PageData>({ resolver })

  const [user] = useUser({ redirectTo: '/auth' })
  const router = useRouter()
  const { id } = router.query
  const [storyInfo, setStoryInfo] = useState<Story>()
  const [lastPage, setLastPage] = useState<number>(1)
  useEffect(() => {
    if (!id) return
    const storyId = id as string

    const getStory = async () => {
      const docRef = doc(db, 'stories', storyId)
      const storySnapshot = (await getDoc(docRef)) as DocumentSnapshot<Story>

      if (!storySnapshot) {
        router.push('/stories')
      }
      setStoryInfo(storySnapshot?.data())
      setLastPage((storySnapshot.data()?.totalPages as number) + 1)
    }
    getStory()
  }, [id, router])

  const onSubmit: SubmitHandler<PageData> = async (data) => {
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
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h1>タイトル：{storyInfo?.title}</h1>
        <BasicInfoFieldsArea>
          <div className="sm:col-span-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              新しくページを追加することができます。
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              ページ単位で更新することができます。新しいページを書いてください。
            </p>
          </div>
          <div className="sm:col-span-6">
            <Input
              label="ページタイトル"
              type="text"
              autoComplete="title"
              {...register('title', {
                maxLength: {
                  value: 200,
                  message: 'ページタイトルは200文字以内で入力してください。',
                },
              })}
              errors={errors}
            />
          </div>
        </BasicInfoFieldsArea>

        {/*         <div className="pt-8">
            TODO: ページ単位でR-18指定、公開範囲設定できるようにする
        </div> */}
        <div className="pt-8">
          <h3 className="text-lg font-medium leading-6 text-gray-900">本文</h3>
          <div className="sm:col-span-6">
            <TextArea
              label={`ページ${lastPage}`}
              defaultValue=""
              required={true}
              rows={20}
              {...register('content', {
                maxLength: {
                  value: 50000,
                  message: 'Ⅰページは5万文字以内で入力してください。',
                },
              })}
              errors={errors}
            />
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-center">
            <CancelButton href={`/stories/${id}`}>小説に戻る</CancelButton>
            <SubmitButton>ページを作成する</SubmitButton>
          </div>
        </div>
      </Form>
    </Layout>
  )
}

export default NewPage
