import { Disclosure } from '@headlessui/react'
import { useAuthUser, withAuthUser } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { classNames } from '../../utils/common'
import { navigation } from '../../utils/menuItems/navigation'
import MobileProfile from './MobileProfile'

const MobileMenu: FC = () => {
  const user = useAuthUser()
  const router = useRouter()

  return (
    <Disclosure.Panel className="sm:hidden">
      <div className="space-y-1 pt-2 pb-3">
        {navigation.map((item) => {
          const current = item.href === router.asPath

          return (
            ((item.login && user.id) || !item.login) && (
              <Disclosure.Button
                key={item.name}
                as="a"
                href={item.href}
                className={classNames(
                  current
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                  'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                )}
                aria-current={current ? 'page' : undefined}
              >
                {item.name}
              </Disclosure.Button>
            )
          )
        })}
      </div>
      <MobileProfile />
    </Disclosure.Panel>
  )
}

export default withAuthUser()(MobileMenu)
