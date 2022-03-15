import { signInWithRedirect, TwitterAuthProvider } from 'firebase/auth'
import { withAuthUser } from 'next-firebase-auth'
import Image from 'next/image'
import { FC } from 'react'
import { auth } from '../../firebase/clientApp'
import useUser from '../../hooks/useUser'

const SignInScreen: FC = () => {
  const user = useUser({ redirectTo: '/stories', redirectIfFound: true })

  const provider = new TwitterAuthProvider()
  auth.languageCode = 'ja'

  const signIn = (): void => {
    signInWithRedirect(auth, provider)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      {!user.id && (
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

export default withAuthUser()(SignInScreen)
