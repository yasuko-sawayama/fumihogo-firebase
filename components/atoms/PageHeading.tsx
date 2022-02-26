/* This example requires Tailwind CSS v2.0+ */
import { CalendarIcon } from '@heroicons/react/solid'
import { Story } from '../../types'
import { R18, Scope } from './Headings'

export default function PageHeading({
  scope,
  description,
  restriction,
  timestamp,
}: Story) {
  console.log(scope)
  return (
    <>
      <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
        {restriction && <R18 />}
        <Scope scope={scope} />
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <CalendarIcon
            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
          公開日時：
          {timestamp}
        </div>
      </div>

      {description && (
        <div className="border-b border-gray-200 pb-5">
          <h3 className="mt-3 text-sm font-medium leading-6 text-gray-700">
            概要
          </h3>
          <p className="mt-1 max-w-4xl text-sm text-gray-500">{description}</p>
        </div>
      )}
    </>
  )
}
