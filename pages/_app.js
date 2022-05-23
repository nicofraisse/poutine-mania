import { Provider } from 'next-auth/client'
import toast, { Toaster } from 'react-hot-toast'
import { RateRestaurantProvider } from 'components/context/RateRestaurantProvider'
import Layout from '../components/layout/Layout'
import '../styles/globals.css'
import { LoginFormProvider } from '../components/context/LoginFormProvider'
import { useCurrentUser } from 'lib/useCurrentUser'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <LoginFormProvider>
        <RateRestaurantProvider>
          <Layout {...pageProps}>
            <>
              <Component {...pageProps} />
              <Toaster position='bottom-right' />
            </>
          </Layout>
        </RateRestaurantProvider>
      </LoginFormProvider>
    </Provider>
  )
}

export default MyApp
