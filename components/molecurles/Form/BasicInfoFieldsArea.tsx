import { ReactNode } from 'react'
type Props = {
  children: ReactNode
}

const BasicInfoFieldsArea = ({ children }: Props) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
      {children}
    </div>
  )
}

export default BasicInfoFieldsArea
