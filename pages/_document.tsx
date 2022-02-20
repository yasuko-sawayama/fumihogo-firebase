import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja" className="h-full">
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
