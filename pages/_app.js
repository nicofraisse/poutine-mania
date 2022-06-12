import { Provider } from 'next-auth/client'
import toast, { Toaster } from 'react-hot-toast'
import { RateRestaurantProvider } from 'components/context/RateRestaurantProvider'
import Layout from '../components/layout/Layout'
import '../styles/globals.css'
import { LoginFormProvider } from '../components/context/LoginFormProvider'
import { RestaurantSearchProvider } from '../components/context/RestaurantSearchProvider'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>My page title</title>

        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
        />
      </Head>

      <Provider session={pageProps.session}>
        <LoginFormProvider>
          <RestaurantSearchProvider>
            <RateRestaurantProvider>
              <Layout {...pageProps}>
                <>
                  <Component {...pageProps} />
                  <Toaster position='bottom-right' />
                </>
              </Layout>
            </RateRestaurantProvider>
          </RestaurantSearchProvider>
        </LoginFormProvider>
      </Provider>
    </>
  )
}

export default MyApp
