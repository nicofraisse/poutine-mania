import { useEffect, useRef, useState } from "react";
import { RecentActivity } from "../components/layout/RecentActivity";
import TopPoutines from "../components/layout/TopPoutines";
import convertObjectIdsToStrings from "../lib/convertObjectIdsToStrings";
import { fetchTopRestaurants } from "./api/restaurants";
import { throttle } from "lodash";
import Head from "next/head";

const HomePage = ({ restaurants }) => {
  const [isScrollableActivity, setIsScrollableActivity] = useState(false);
  const actvityHeaderRef = useRef(null);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const { top } = actvityHeaderRef.current.getBoundingClientRect();
      setIsScrollableActivity(window.innerWidth > 1080 || top <= 20);
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>PoutineMania: La communauté de la poutine</title>
        <meta
          name="description"
          content="Notez vos poutines préférées en critiquant les frites, le fromage et la sauce. Lisez les avis et explorez la carte interactive pour dénicher la poutine ultime du Québec!"
        ></meta>
      </Head>

      <div className="xl:flex justify-evenly text-slate-700 ">
        <div className="px-0 sm:px-6 md:px-8">
          <TopPoutines restaurants={restaurants} />
        </div>
        <div className="xl:w-5/12 2xl:w-1/3 3xl:w-auto text h-screen sticky top-0 overflow-hidden">
          <h2
            ref={actvityHeaderRef}
            className="text-2xl font-bold my-5 text-center"
          >
            Activité récente
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
