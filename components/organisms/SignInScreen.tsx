import { TwitterAuthProvider } from 'firebase/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { auth } from '../../firebase/clientApp'
import useUser from '../../hooks/useUser'

// Configure FirebaseUI.
const uiConfig = {
  // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // GitHub as the only included Auth Provider.
  // You could add and configure more here!
  signInOptions: [
    {
      provider: TwitterAuthProvider.PROVIDER_ID,
      fullLabel: 'Twitterでログインする',
    },
  ],
}

function SignInScreen() {
  const [user, loading] = useUser({ redirectTo: '/', redirectIfFound: true })
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      {!user && (
        <>
          <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900">
            Login
          </h1>
          <p className="mb-8">ログインしてください</p>
        </>
      )}

      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  )
}

export default SignInScreen
