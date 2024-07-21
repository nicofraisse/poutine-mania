import { useEffect, useRef, useState } from "react";
import { RecentActivity } from "../components/layout/RecentActivity";
import TopPoutines from "../components/layout/TopPoutines";
import convertObjectIdsToStrings from "../lib/convertObjectIdsToStrings";
import { fetchTopRestaurants } from "./api/restaurants";
import { throttle } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useLoginForm } from "../components/context/LoginFormProvider";

const HomePage = ({ restaurants }) => {
  const [isScrollableActivity, setIsScrollableActivity] = useState(false);
  const actvityHeaderRef = useRef(null);
  const { openLogin } = useLoginForm();

  useEffect(() => {
    const handleScroll = throttle(() => {
      const { top } = actvityHeaderRef.current.getBoundingClientRect();
      setIsScrollableActivity(window.innerWidth > 1080 || top <= 20);
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { query } = useRouter();

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
        <title>Poutine Mania: La communauté de la poutine!</title>
        <meta
          name="description"
          content="Note tes poutines préférées en critiquant les frites, le fromage et la sauce. Explore la carte pour dénicher la poutine ultime du Québec!"
        ></meta>
      </Head>

      <div className="xl:flex justify-evenly text-slate-700">
        <div className="px-0 sm:px-6 md:px-8">
          <TopPoutines restaurants={restaurants} />
        </div>
        <div className="xl:w-5/12 2xl:w-1/3 3xl:w-auto text h-screen sticky top-0 overflow-hidden">
          <h2
            ref={actvityHeaderRef}
            className="text-xl sm:text-2xl font-bold my-5 text-center"
          >
            À l&apos;affiche
          </h2>
          <RecentActivity
            heightClass="h-[calc(100vh-72px)]"
            isScrollable={isScrollableActivity}
          />
        </div>
      </div>
    </>
  );
};
export async function getStaticProps() {
  const restaurants = await fetchTopRestaurants();
  const serializedRestaurants = convertObjectIdsToStrings(restaurants);

  return {
    props: {
      restaurants: serializedRestaurants,
    },
    revalidate: 60,
  };
}

export default HomePage;
