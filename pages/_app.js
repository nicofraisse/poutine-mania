import { Provider } from "next-auth/client";
import { Toaster } from "react-hot-toast";
import { RateRestaurantProvider } from "components/context/RateRestaurantProvider";
import Layout from "../components/layout/Layout";
import "../styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { LoginFormProvider } from "../components/context/LoginFormProvider";
import { RestaurantSearchProvider } from "../components/context/RestaurantSearchProvider";
import Head from "next/head";
import { CookiesProvider } from "react-cookie";
import { SidebarDataProvider } from "../components/context/SidebarDataProvider";
import { Analytics } from "@vercel/analytics/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

function App({ Component, pageProps }) {
  const { push, asPath } = useRouter();

  useEffect(() => {
    console.log({ asPath, push });
    if (asPath === "/poutine-jesus") push("/profil/poutine-jesus");
  }, [asPath, push]);

  // useEffect(() => axios.get("/api/init-db").then((res) => console.log(res)));

  return (
    <>
      <Head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Darumadrop+One&family=Open+Sans:wght@300;400;500;600;700&family=Poppins:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
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
                        toastOptions={{ duration: 7000 }}
                      />
                    </div>
                  </Layout>
                </RateRestaurantProvider>
              </RestaurantSearchProvider>
            </SidebarDataProvider>
          </LoginFormProvider>
        </Provider>
      </CookiesProvider>

      <Analytics />
    </>
  );
}

export default App;
