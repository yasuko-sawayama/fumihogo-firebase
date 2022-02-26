type Props = {
  title: string
}

const Title = function ({ title }: Props) {
  return (
    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
      {title}
    </h2>
  )
}

export default Title
