import { Story } from '../../types'
import { PageData } from '../../types/index'
import { PageHeading, Spinner } from '../atoms'
import PageContent from '../atoms/PageContent'
import { HeadAvator } from '../organisms'

type Props = {
  story: Story
  page?: PageData | null
}

const StoryTemplate = ({ story, page }: Props) => {
  // TODO: レンダリング
  const content = page?.content
  return (
    <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
      <div className="px-4 py-0 sm:px-0">
        <header>
          <HeadAvator />
          <PageHeading {...story} />
        </header>
        <main>{content ? <PageContent content={content} /> : <Spinner />}</main>
      </div>
    </div>
  )
}

export default StoryTemplate
