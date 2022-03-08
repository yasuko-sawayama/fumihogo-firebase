import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  BasicInfoFieldsArea,
  CancelButton,
  Form,
  Input,
  SubmitButton,
  TextArea,
} from '../../../components/atoms/Form'
import { Layout } from '../../../components/templates'
import { db } from '../../../firebase/clientApp'
import useUser from '../../../hooks/useUser'
import { PageData } from '../../../types'

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
  const { id, page } = router.query

  /*   if (!id) {
    router.push('/stories')
  } */

  const onSubmit: SubmitHandler<PageData> = async (data) => {
    const { title, number, content } = data

    const docId = id?.toString() || ''

    try {
      const docRef = doc(db, 'stories', docId)
      const pageCollectinRef = collection(docRef, 'pages')

      addDoc(pageCollectinRef, {
        ...data,
        // なぜかこうしないとnumberにstringが入っている。。。
        number: parseInt(number as unknown as string),
        timestamp: serverTimestamp(),
      })

      console.log('Page written in document: ', docId)
      router.push(`/stories/${docId}/${number}`)
      toast.success('ページを追加しました!')
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  return (
    <Layout title="新しいページを書く">
      <Form onSubmit={handleSubmit(onSubmit)}>
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
          <div className="col-span-1">
            <Input
              label="ページ位置"
              type="number"
              {...register('number', { valueAsNumber: true })}
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
              label="ページ1"
              defaultValue=""
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
