import Head from 'next/head'
import { Story, User } from '../../types'
import { PageData } from '../../types/index'
import { PageHeading, Spinner } from '../atoms'
import PageContent from '../atoms/PageContent'
import Nav from '../molecurles/nav'
import { HeadAvator } from '../organisms'

type Props = {
  author: User
  story: Story
  page?: PageData | null
}

const StoryLayout = ({ author, story, page }: Props) => {
  // TODO: レンダリング
  const content = page?.content
  return (
    <>
      <Head>
        <title>{story.title}:ふみほご</title>
      </Head>

      <div className="min-h-full">
        <Nav />

        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <HeadAvator author={author} />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                  <div className="px-4 py-0 sm:px-0">
                    <header>
                      <PageHeading {...story} />
                    </header>
                    <main>
                      {content ? (
                        <PageContent content={content} />
                      ) : (
                        <Spinner />
                      )}
                    </main>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StoryLayout
