import { Story } from '../../types'
import { PageData } from '../../types/index'
import { PageHeading, Spinner } from '../atoms'
import Title from '../atoms/Headings/Title'
import PageContent from '../atoms/PageContent'

type Props = {
  story: Story
  page?: PageData
}

const StoryTemplate = ({ story, page }: Props) => {
  // TODO: レンダリング
  const content = page?.content
  return (
    <>
      <header>
        <Title title={story.title} />
        <PageHeading {...story} />
      </header>
      <main>{content ? <PageContent content={content} /> : <Spinner />}</main>
    </>
  )
}

export default StoryTemplate
