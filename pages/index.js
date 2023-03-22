import { RecentActivity } from "../components/layout/RecentActivity";
import TopPoutines from "../components/layout/TopPoutines";

function HomePage() {
  return (
    <div className="xl:flex justify-evenly text-slate-700 ">
      <div className="px-8">
        <TopPoutines />
      </div>
      <div className="xl:w-5/12 2xl:w-1/3 3xl:w-auto text h-screen sticky top-0 overflow-hidden">
        <h2 className="text-2xl font-bold my-5 text-center">
          Dernière activité
        </h2>
        <RecentActivity heightClass="h-[calc(100vh-136px)] " />
      </div>
    </div>
  );
}

export default HomePage;
