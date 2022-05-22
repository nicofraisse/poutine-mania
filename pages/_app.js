import { Provider } from 'next-auth/client'
import toast, { Toaster } from 'react-hot-toast'

import Layout from '../components/layout/Layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Layout {...pageProps}>
        <>
          <Component {...pageProps} />
          <Toaster position='bottom-right' />
        </>
      </Layout>
    </Provider>
  )
}

export default MyApp
