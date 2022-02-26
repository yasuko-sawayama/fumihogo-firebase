type Props = {
  content: string
}

const PageContent = ({ content }: Props) => {
  return (
    <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0">
        <div className="text-md leading-loose tracking-wider text-gray-700">
          {content}
        </div>
      </div>
    </div>
  )
}

export default PageContent
