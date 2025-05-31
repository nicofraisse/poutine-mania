import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { RateRestaurantProvider } from "components/context/RateRestaurantProvider";
import { Layout } from "../components/layout/Layout";
import "../styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { appWithTranslation } from "next-i18next";
import { LoginFormProvider } from "../components/context/LoginFormProvider";
import { RestaurantSearchProvider } from "../components/context/RestaurantSearchProvider";
import { CookiesProvider } from "react-cookie";
import { SidebarDataProvider } from "../components/context/SidebarDataProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

function App({ Component, pageProps }) {
  return (
    <>
      <CookiesProvider>
        <SessionProvider session={pageProps.session}>
          <LoginFormProvider>
            <SidebarDataProvider>
              <RestaurantSearchProvider>
                <RateRestaurantProvider>
                  <Layout {...pageProps}>
                    <>
                      <Component {...pageProps} />
                      <Toaster
                        position="bottom-right"
                        toastOptions={{ duration: 7000 }}
                      />
                    </>
                  </Layout>
                </RateRestaurantProvider>
              </RestaurantSearchProvider>
            </SidebarDataProvider>
          </LoginFormProvider>
        </SessionProvider>
      </CookiesProvider>

      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default appWithTranslation(App);
