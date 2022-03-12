type Props = {
  children: React.ReactChild
}

const FormErrorText = ({children}:Props) => {
  return (
    <p className="block text-sm mt-1 text-red-700">{ children}</p>
  )
}

export default FormErrorText