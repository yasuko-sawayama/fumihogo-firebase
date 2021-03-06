import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  BasicInfoFieldsArea,
  CancelButton,
  FieldSet,
  Form,
  Input,
  SubmitButton,
  TextArea,
} from '../../components/molecurles/Form'
import Layout from '../../components/templates/Layout'
import { storiesCol } from '../../firebase/clientApp'
import { Page, Scope } from '../../types'
import { TwitterAuthUser } from '../../types/index'

export interface INewStoryFormValues {
  title: string
  description: string
  restriction: boolean
  scope: Scope
  page: string
}

const NewStory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<INewStoryFormValues>()
  const user = useAuthUser()
  const router = useRouter()

  const onSubmit: SubmitHandler<INewStoryFormValues> = async (data) => {
    console.log(user)

    if (!user.id || !user.firebaseUser) {
      throw new Error('user is required')
    }

    const { page, ...storyInfo } = {
      ...data,
    }

    const pageData: Page = {
      number: 1,
      content: page,
    }

    try {
      // 取り方がわからないので無理矢理キャスト・・・
      const firebaseUser: TwitterAuthUser = user.firebaseUser

      const docRef = await addDoc(storiesCol, {
        ...storyInfo,
        userId: user.id,
        author: {
          uid: user.id,
          displayName: user.displayName || '',
          photoURL: user.photoURL,
          // Twitterログインを前提とする
          twitterScreenName: firebaseUser?.reloadUserInfo?.screenName || '',
        },
        totalPages: 1,
        timestamp: serverTimestamp(),
      })

      const pageCollectinRef = collection(docRef, 'pages')
      addDoc(pageCollectinRef, {
        ...pageData,
        timestamp: serverTimestamp(),
      })

      console.log('Document written with ID: ', docRef.id)
      router.push(`/stories/${docRef.id}`)
      toast.success('作成しました!')
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  const notificationMethods = [
    { value: 'public', title: '公開（閲覧制限なし）' },
    { value: 'login', title: 'ログイン' },
    { value: 'list', title: 'Twitterリスト' },
    { value: 'password', title: 'パスワード' },
  ]

  return (
    <Layout title="新しい小説を書く">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <BasicInfoFieldsArea>
          <div className="sm:col-span-6">
            <Input
              label="タイトル"
              type="text"
              autoComplete="title"
              {...register('title', {
                required: 'タイトルは必須です。',
                maxLength: {
                  value: 200,
                  message: 'タイトルは200文字以内で入力してください。',
                },
              })}
              errors={errors}
            />
          </div>
          <div className="sm:col-span-6">
            <TextArea
              label="概要"
              defaultValue=""
              rows={3}
              {...register('description', {
                maxLength: {
                  value: 1000,
                  message: '概要は1000文字以内で入力してください。',
                },
              })}
              errors={errors}
            />
            <p className="mt-2 text-sm text-gray-500">
              簡単な小説の内容やあらすじ。
            </p>
          </div>
          {
            // TODO: 表紙イメージ
            /* <div className="sm:col-span-6">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium text-gray-700"
              >
                表紙イメージ
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>ファイルを選択</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">するかドラッグ＆ドロップしてください</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div> */
          }
        </BasicInfoFieldsArea>
        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              注意事項
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              新しく作成した小説は公開するまで表示されません。
              <br />
              ※ここに注意事項を書く
            </p>
          </div>
          <div className="mt-6">
            <FieldSet title="公開範囲">
              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                {notificationMethods.map((notificationMethod) => (
                  <div
                    key={notificationMethod.value}
                    className="flex items-center"
                  >
                    <input
                      id={notificationMethod.value}
                      value={notificationMethod.value}
                      {...register('scope')}
                      type="radio"
                      defaultChecked={notificationMethod.value === 'public'}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={notificationMethod.value}
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {notificationMethod.title}
                    </label>
                  </div>
                ))}
              </div>
            </FieldSet>
            <p className="mt-2 ml-6 text-sm text-gray-500">
              公開範囲を選択してください。
            </p>
            <FieldSet title="閲覧制限">
              <div className="flex h-5 items-center">
                <input
                  id="restriction"
                  {...register('restriction')}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="comments" className="font-medium text-gray-700">
                  R-18
                </label>
                <p className="text-gray-500">
                  閲覧制限が必要な場合はチェックしてください。
                </p>
              </div>
            </FieldSet>
          </div>
        </div>
        <div className="pt-8">
          <h3 className="text-lg font-medium leading-6 text-gray-900">本文</h3>
          <div className="sm:col-span-6">
            <TextArea
              label="ページ1"
              defaultValue=""
              rows={20}
              {...register('page', {
                required: true,
                maxLength: {
                  value: 50000,
                  message: 'Ⅰページは5万文字以内で入力してください。',
                },
              })}
              errors={errors}
            />
            <p className="mt-2 text-sm text-gray-500">
              複数のページを作成することができます。連載などに便利です。
            </p>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-center">
            <CancelButton href="/stories">キャンセル</CancelButton>
            <SubmitButton>作成する</SubmitButton>
          </div>
        </div>
      </Form>
    </Layout>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(NewStory)
