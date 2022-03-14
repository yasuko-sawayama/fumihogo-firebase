/* This example requires Tailwind CSS v2.0+ */
import Head from 'next/head'
import 'react-toastify/dist/ReactToastify.css'
import Title from '../atoms/Headings/Title'
import Nav from '../molecurles/nav'

type Props = {
  title?: string
  headerButtons?: JSX.Element[] | null
  children: React.ReactNode
}

export default function Layout({ title, headerButtons, children }: Props) {
  return (
    <>
      <Head>
        <title>{title}:ふみほご</title>
      </Head>

      <div className="min-h-full">
        <Nav />
        <div className="py-10">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                  {title && (
                    <header className="md:flex md:items-center md:justify-between">
                      <Title title={title} />
                      {headerButtons && (
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                          {headerButtons.map((buttonElement) => buttonElement)}
                        </div>
                      )}
                    </header>
                  )}
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
