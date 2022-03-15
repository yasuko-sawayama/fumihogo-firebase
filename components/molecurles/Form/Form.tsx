import { ReactNode, VFC } from 'react'
type Props = {
  onSubmit: VoidFunction
  children: ReactNode
}
const Form: VFC<Props> = ({ onSubmit, children }) => {
  return (
    <form className="space-y-8 divide-y divide-gray-200 " onSubmit={onSubmit}>
      <div className="space-y-8 divide-y divide-gray-200">{children}</div>
    </form>
  )
}

export default Form
