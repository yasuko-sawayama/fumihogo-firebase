/* This example requires Tailwind CSS v2.0+ */
import { CalendarIcon, PencilAltIcon, PencilIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { Story } from '../../types'
import { R18, Scope, Title } from '../atoms/Headings'

type Props = {
  authorId: string
} & Story

export default function PageHeading({
  authorId,
  id,
  scope,
  title,
  description,
  restriction,
  timestamp,
}: Props) {
  return (
    <>
      <div className="mt-10 lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <Title title={title!} />
          <div className="mt-2 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            {restriction && <R18 />}
            <Scope scope={scope} />
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <CalendarIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              公開日時：
              {timestamp}
            </div>
          </div>
        </div>

        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="hidden sm:block">
            <Link href={`/stories/${id}/new`} passHref>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PencilIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
                次のページを書く
              </button>
            </Link>
            <button
              type="button"
              className="ml-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PencilAltIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
              修正
            </button>
          </span>
        </div>
      </div>
      {description && (
        <div className="border-b border-gray-200 pb-5">
          <h3 className="mt-4 text-sm font-medium leading-6 text-gray-700">
            概要
          </h3>
          <p className="mt-1 max-w-4xl text-sm text-gray-500">{description}</p>
        </div>
      )}
    </>
  )
}
