import { VFC } from 'react'

type Props = {
  children: React.ReactChild
}

const FormErrorText: VFC<Props> = ({ children }) => {
  return <p className="mt-1 block text-sm text-red-700">{children}</p>
}

export default FormErrorText
