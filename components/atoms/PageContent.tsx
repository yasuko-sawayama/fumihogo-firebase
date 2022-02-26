type Props = {
  content: string
}

const PageContent = ({ content }: Props) => {
  return (
    <div className="text-md mt-4 leading-loose tracking-wider text-gray-700">
      {content}
    </div>
  )
}

export default PageContent
