import { Disclosure } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/outline'
import { useAuthUser } from 'next-firebase-auth'
import Image from 'next/image'
import { FC } from 'react'
import { TwitterAuthUser } from '../../types/index'
import { userNavigation } from '../../utils/menuItems/userNaviigation'

const MobileProfile: FC = () => {
  const user = useAuthUser()

  if (user.id && user.firebaseUser) {
    const firebaseUser: TwitterAuthUser = user.firebaseUser

    return (
      <div className="border-t border-gray-200 pt-4 pb-3">
        <div className="flex items-center px-4">
          <div className="flex-shrink-0">
            <Image
              className="h-10 w-10 rounded-full"
              src={user.photoURL || '/avator.svg'}
              alt=""
              width="24"
              height="24"
            />
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-gray-800">
              {user.displayName}
            </div>
            <div className="text-sm font-medium text-gray-500">
              {firebaseUser?.reloadUserInfo?.screenName}
            </div>
          </div>
          <button
            type="button"
            className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 space-y-1">
          {userNavigation.map((item) => (
            <Disclosure.Button
              key={item.name}
              as="a"
              href={item.href}
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              {item.name}
            </Disclosure.Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-200 pt-4 pb-3">
      <Disclosure.Button
        key="signin"
        as="a"
        href="/auth"
        className="block px-4 py-2 text-base font-bold text-amber-900 hover:bg-gray-100 hover:text-gray-800"
      >
        ????????????
      </Disclosure.Button>
    </div>
  )
}

export default MobileProfile
