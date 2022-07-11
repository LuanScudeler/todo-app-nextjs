import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { phrases } from 'lib/phrases'
import { AppContext } from 'lib/appContext'

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  import('../mocks')
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContext.Provider value={{ phrases: phrases }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}

export default MyApp
