import { signInWithRedirect, TwitterAuthProvider } from 'firebase/auth'
import Image from 'next/image'
import { auth } from '../../firebase/clientApp'
import useUser from '../../hooks/useUser'
import Spinner from '../atoms/Spinner'

function SignInScreen() {
  const [user, loading] = useUser({ redirectTo: '/', redirectIfFound: true })

  if (loading) {
    return (
      <div className="grid h-screen place-items-center">
        <Spinner />
      </div>
    )
  }

  const provider = new TwitterAuthProvider()
  auth.languageCode = 'ja'

  const signIn = () => {
    signInWithRedirect(auth, provider)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      {!user && (
        <>
          <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900">
            Login
          </h1>
          <p className="mb-8">ログインしてください</p>
          <button
            onClick={signIn}
            className="rounded bg-[#1DA1F2] py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            <span className="mr-2 inline-block h-4 w-4 fill-current ">
              <Image
                src="/images/brand/twitter.svg"
                width={20}
                height={20}
                alt=""
              />
            </span>
            Twitterでログインする
          </button>
        </>
      )}
    </div>
  )
}

export default SignInScreen
