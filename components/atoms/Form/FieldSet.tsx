type Props = {
  title: string
  children: React.ReactNode
}

const FieldSet = ({ title, children }: Props) => {
  return (
    <fieldset className="mt-4">
      <legend className="text-base font-medium text-gray-900">{title}</legend>
      <div className="mt-4 space-y-4">
        <div className="relative flex items-start">{children}</div>
      </div>
    </fieldset>
  )
}

export default FieldSet
