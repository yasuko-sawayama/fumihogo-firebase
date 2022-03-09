import type { AppProps } from 'next/app'
import initAuth from '../initAuth'
import '../styles/globals.css'

initAuth()

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
