import Link from 'next/link'
import { ReactChild, VFC } from 'react'

type Props = {
  href?: string
  children: ReactChild
}

const CancelButton: VFC<Props> = ({ href = '/', children }) => {
  return (
    <Link href={href} passHref>
      <button
        type="button"
        className="rounded-md border border-gray-300 bg-white py-2 px-5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {children}
      </button>
    </Link>
  )
}

export default CancelButton
