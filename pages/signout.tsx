import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import firebase from '../firebase/clientApp';
import useUser from '../hooks/useUser';

const auth = getAuth(firebase)

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

  const [_curentuser] = useUser({ redirectTo: "/auth"})
  
  return (
    <div className="mt-40 text-center">
      <svg
        className="mx-auto h-20 w-20 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          d="M8.5 11.25C8.91421 11.25 9.25 10.9142 9.25 10.5C9.25 10.0858 8.91421 9.75 8.5 9.75C8.08579 9.75 7.75 10.0858 7.75 10.5C7.75 10.9142 8.08579 11.25 8.5 11.25Z"
          fill="#212121"
        />
        <path
          d="M11 3.5C11 3.3542 10.9364 3.21567 10.8257 3.12068C10.7151 3.02569 10.5686 2.98371 10.4244 3.00574L3.42445 4.07574C3.18032 4.11306 3 4.32303 3 4.57V15.43C3 15.6769 3.18028 15.8869 3.42438 15.9243L10.4244 16.9953C10.5685 17.0173 10.7151 16.9754 10.8257 16.8804C10.9363 16.7854 11 16.6468 11 16.501V10L16.1722 10L15.1753 10.8737C14.9679 11.0556 14.9468 11.3714 15.1284 11.5793C15.3099 11.7871 15.6253 11.8081 15.8328 11.6263L17.8295 9.8763C17.9379 9.78135 18 9.64419 18 9.50001C18 9.35583 17.9379 9.21867 17.8295 9.12372L15.8328 7.37372C15.6253 7.19188 15.3099 7.21294 15.1284 7.42076C14.9468 7.62858 14.9679 7.94446 15.1753 8.1263L16.1723 9.00002L11 9.00002V3.5ZM10 4.08224V15.9187L4 15.0007V4.99938L10 4.08224Z"
          fill="#212121"
        />
        <path
          d="M12.5 16H12V11H13V15.5C13 15.7761 12.7761 16 12.5 16Z"
          fill="#212121"
        />
        <path
          d="M12 8V4H12.5C12.7761 4 13 4.22386 13 4.5V8H12Z"
          fill="#212121"
        />
      </svg>
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

export default SignOut
