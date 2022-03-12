import Link from 'next/link';
import { ReactChild } from "react";

type Props = {
  href?: string,
  children: ReactChild
}

const CancelButton = ({href="/", children}: Props) => {
  return (
    <Link href={href} passHref>
      <button
        type="button"
        className="bg-white py-2 px-5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {children }
      </button>
    </Link>
  )
}

export default CancelButton