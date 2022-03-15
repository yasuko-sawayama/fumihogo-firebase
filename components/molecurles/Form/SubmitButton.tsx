import { VFC } from 'react'

type Props = {
  children: string
}

const SubmitButton: VFC<Props> = ({ children }) => {
  return (
    <button
      type="submit"
      className="ml-5 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {children}
    </button>
  )
}

export default SubmitButton
