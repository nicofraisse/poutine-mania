import { RecentActivity } from "../components/layout/RecentActivity";
import TopPoutines from "../components/layout/TopPoutines";
import convertObjectIdsToStrings from "../lib/convertObjectIdsToStrings";
import { fetchTopRestaurants } from "./api/restaurants";

const HomePage = ({ restaurants }) => {
  return (
    <div className="xl:flex justify-evenly text-slate-700 ">
      <div className="px-8">
        <TopPoutines restaurants={restaurants} />
      </div>
      <div className="xl:w-5/12 2xl:w-1/3 3xl:w-auto text h-screen sticky top-0 overflow-hidden">
        <h2 className="text-2xl font-bold my-5 text-center">
          Activité récente
        </h2>
        <RecentActivity heightClass="h-[calc(100vh-136px)] " />
      </div>
    </div>
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
