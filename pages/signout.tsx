import { LogoutIcon } from '@heroicons/react/outline'
import { signOut } from 'firebase/auth'
import { AuthAction, withAuthUser } from 'next-firebase-auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Spinner } from '../components/atoms'
import { auth } from '../firebase/clientApp'

const SignOut = () => {
  const router = useRouter()

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push('/')
      })
      .catch((error) => {
        // An error happened.
        console.log(error)
      })
  }

  return (
    <div className="mt-40 text-center">
      <LogoutIcon className="mx-auto h-20 w-20 pl-2 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900"> ログアウト </h3>
      <p className="mt-1 text-sm text-gray-500">
        ふみほごからログアウトしますか？
      </p>
      <div className="mt-6">
        <Link href="/" passHref>
          <a className="mr-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            キャンセル
          </a>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Spinner,
})(SignOut)
