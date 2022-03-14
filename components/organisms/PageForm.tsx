import { SubmitHandler, useForm } from 'react-hook-form'
import { Page } from '../../types'
import { Story } from '../../types/index'
import {
  BasicInfoFieldsArea,
  CancelButton,
  Form,
  Input,
  SubmitButton,
  TextArea,
} from '../molecurles/Form'

type Props = {
  onSubmit: SubmitHandler<Page>
  storyInfo: Story
  pageNumber: number
}

const PageForm = ({ onSubmit, storyInfo, pageNumber }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Page>()
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <BasicInfoFieldsArea>
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
            label={`ページ${pageNumber}`}
            defaultValue=""
            rows={20}
            {...register('content', {
              required: '本文を入力してください',
              maxLength: {
                value: 50000,
                message: '1ページは5万文字以内で入力してください。',
              },
            })}
            errors={errors}
          />
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-center">
          <CancelButton href={`/stories/${storyInfo.id}`}>
            小説に戻る
          </CancelButton>
          <SubmitButton>投稿</SubmitButton>
        </div>
      </div>
    </Form>
  )
}

export default PageForm
