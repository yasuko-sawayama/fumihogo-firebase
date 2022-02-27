/* This example requires Tailwind CSS v2.0+ */
import { MailIcon } from '@heroicons/react/outline'
import { BookOpenIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import Link from 'next/link'
import { User } from '../../types'
import HeadingsButton from '../atoms/Headings/HeadingsButton'

const profile = {
  name: 'Ricardo Cooper',
  email: 'ricardo.cooper@example.com',
  avatar:
    'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
  backgroundImage:
    'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  fields: [
    ['Phone', '(555) 123-4567'],
    ['Email', 'ricardocooper@example.com'],
    ['Title', 'Senior Front-End Developer'],
    ['Team', 'Product Development'],
    ['Location', 'San Francisco'],
    ['Sits', 'Oasis, 4th floor'],
    ['Salary', '$145,000'],
    ['Birthday', 'June 8, 1990'],
  ],
}

type Props = {
  author: User
}

export default function HeadAvator({ author }: Props) {
  return (
    <div>
      {/* TODO: 表紙イメージ */}
      <div className="relative -z-50 h-32  w-full lg:h-48">
        <Image
          className="object-cover"
          src="/images/yohan-marion-VgtSzzcOajg-unsplash.jpg"
          alt=""
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <div className="relative h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32 ">
              <Image
                className="rounded-full"
                src={author.photoURL || '/images/avator.svg'}
                alt=""
                layout="fill"
              />
            </div>
          </div>
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {author.reloadUserInfo?.screenName
                  ? author.reloadUserInfo?.screenName
                  : author.displayName}
              </h1>
            </div>
            <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <HeadingsButton
                text="作品一覧"
                icon={
                  <BookOpenIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                }
              />
              <Link href={`https://twitter.com/${author.displayName}`} passHref>
                <HeadingsButton
                  text="Twitter"
                  icon={
                    <MailIcon
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  }
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
          <h1 className="truncate text-2xl font-bold text-gray-900">
            {profile.name}
          </h1>
        </div>
      </div>
    </div>
  )
}
