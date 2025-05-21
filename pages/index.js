import { useEffect, useRef, useState } from "react";
import { RecentActivity } from "../components/layout/RecentActivity";
import { TopPoutines } from "../components/layout/TopPoutines";
import { convertObjectIdsToStrings } from "../lib/convertObjectIdsToStrings";
import { fetchTopRestaurants } from "./api/restaurants";
import { throttle } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useLoginForm } from "../components/context/LoginFormProvider";
import { FeaturesIntro } from "../components/FeaturesIntro";
import DefaultSEO from "../components/DefaultSeo";
import { useTranslation } from "next-i18next";
import { withI18n } from "../lib/withI18n";

const HomePage = ({ restaurants }) => {
  const [, setIsScrollableActivity] = useState(false);
  const activityHeaderRef = useRef(null);
  const { openLogin } = useLoginForm();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!activityHeaderRef.current) return;
      const { top } = activityHeaderRef.current.getBoundingClientRect();
      setIsScrollableActivity(window.innerWidth > 1080 || top <= 20);
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { query, locale } = useRouter();

  useEffect(() => {
    const { connexion, ...rest } = query;
    if (connexion) {
      openLogin();
      let newPath = window.location.pathname;

      if (Object.keys(rest).length > 0) {
        newPath += `?${new URLSearchParams(rest).toString()}`;
      }
      window.history.replaceState(null, "", newPath);
    }
  }, [query]);

  return (
    <>
      <Head>
        <title>Poutine Mania – La communauté de la poutine</title>
        <title>{t("seo.home.title")}</title>
        <meta name="description" content={t("seo.home.description")} />
        <DefaultSEO locale={locale} />
      </Head>

      <FeaturesIntro />

      <div className="justify-evenly text-slate-700 pb-10">
        <div className="flex relative justify-center bg-[#FAF7F2] overflow-hidden">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400 opacity-20 rounded-full"></div>
          <div className="absolute top-1/2 -right-16 w-48 h-48 bg-amber-500 opacity-10 rounded-full"></div>
          <div className="absolute -bottom-10 left-1/4 w-28 h-28 bg-amber-300 opacity-20 rounded-full"></div>
          <div className="relative">
            <TopPoutines restaurants={restaurants} />
          </div>
        </div>

        <h2
          ref={activityHeaderRef}
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold my-4 text-center pt-6 pb-4"
        >
          {t("home.recentActivity.title")}
        </h2>
        <RecentActivity isScrollable={false} />
      </div>
    </>
  );
};
export const getStaticProps = withI18n(async () => {
  const restaurants = await fetchTopRestaurants();
  const serializedRestaurants = convertObjectIdsToStrings(restaurants);

  return {
    props: {
      restaurants: serializedRestaurants,
    },
    revalidate: 60,
  };
});

export default HomePage;
