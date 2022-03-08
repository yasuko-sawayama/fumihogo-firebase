import { ReactNode } from 'react'
type Props = {
  onSubmit: any //FIXME
  children: ReactNode
}
const Form = ({ onSubmit, children }: Props) => {
  return (
    <form className="space-y-8 divide-y divide-gray-200 " onSubmit={onSubmit}>
      <div className="space-y-8 divide-y divide-gray-200">{children}</div>
    </form>
  )
}

export default Form
