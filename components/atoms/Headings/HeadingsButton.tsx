import Link from 'next/link'

type Props = {
  text: string
  icon: JSX.Element
  href?: string
}

export default function HeadingsButton({ text, icon, href }: Props) {
  if (href) {
    return (
      <Link href={href}>
        <a className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
          {icon}
          <span>{text}</span>
        </a>
      </Link>
    )
  }
  return (
    <a className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
      {icon}
      <span>{text}</span>
    </a>
  )
}
