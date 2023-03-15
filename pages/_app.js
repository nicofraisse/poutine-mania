import { Provider } from "next-auth/client";
import { Toaster } from "react-hot-toast";
import { RateRestaurantProvider } from "components/context/RateRestaurantProvider";
import Layout from "../components/layout/Layout";
import "../styles/globals.css";
import { LoginFormProvider } from "../components/context/LoginFormProvider";
import { RestaurantSearchProvider } from "../components/context/RestaurantSearchProvider";
import Head from "next/head";
import { CookiesProvider } from "react-cookie";
import { SidebarDataProvider } from "../components/context/SidebarDataProvider";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Poutine Mania - La communauté des fans de la poutine!</title>
        <meta
          name="description"
          content="Découvrez les meilleures poutines du Québec grâce à notre communauté de passionnés! Partagez vos notes et critiques sur les frites, le fromage et la sauce de chaque restaurant pour trouver les poutines parfaites pour votre palais. Rejoignez-nous dans notre quête de la poutine ultime!"
        ></meta>
        <meta name="referrer" content="no-referrer" />
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </Head>

      <CookiesProvider>
        <Provider session={pageProps.session}>
          <LoginFormProvider>
            <SidebarDataProvider>
              <RestaurantSearchProvider>
                <RateRestaurantProvider>
                  <Layout {...pageProps}>
                    <div>
                      <Component {...pageProps} />
                      <Toaster
                        position="bottom-right"
                        toastOptions={{
                          // Define default options
                          duration: 7000,
                        }}
                      />
                    </div>
                  </Layout>
                </RateRestaurantProvider>
              </RestaurantSearchProvider>
            </SidebarDataProvider>
          </LoginFormProvider>
        </Provider>
      </CookiesProvider>
    </>
  );
}

export default App;
