import { useGet } from "lib/useAxios";
import { useRouter } from "next/router";
import Spinner from "components/Spinner";
import RestaurantReviews from "components/page-layouts/RestaurantReviews";
import RestaurantHeader from "components/RestaurantHeader";
import { ExternalLink, MapPin, Phone, PhoneCall } from "react-feather";
import Map from "components/Map";
import { useEffect, useState } from "react";
import { formatAddress } from "lib/formatAddress";

import { ReviewOverview } from "../../../components/ReviewOverview";
import { RestaurantInfo } from "../../../components/RestaurantInfo";

const Index = () => {
  const { query } = useRouter();
  const { data: restaurant, loading } = useGet(`/api/restaurants/${query.id}`, {
    skip: !query.id,
  });
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setShowMap(window?.innerWidth >= 640);

    window.addEventListener("resize", () => {
      if (window.innerWidth < 640) {
        setShowMap(false);
      } else {
        setShowMap(true);
      }
    });
  }, []);

  if (!restaurant || loading) return <Spinner />;
  return (
    <div className="bg-[#fafafa] min-h-screen">
      <RestaurantHeader restaurant={restaurant} />
      <div className="p-4 xl:p-6 flex flex-col-reverse lg:flex-row">
        <div className="lg:basis-2/3 lg:max-w-2/3">
          <RestaurantReviews restaurant={restaurant} />
        </div>
        <div className="lg:w-1/3 lg:sticky lg:top-4 lg:h-full lg:ml-4 xl:ml-6 block sm:flex flex-row-reverse items-center lg:block">
          <div className="bg-white shadow-md rounded-lg text-sm p-3 xl:p-5 mb-4 text-center text-gray-800 w-auto sm:w-1/2 lg:w-auto">
            <ReviewOverview restaurant={restaurant} />
          </div>

          <div className="bg-white shadow-md rounded-lg text-xs xl:text-sm p-4 text-gray-800 w-auto sm:w-1/2 lg:w-auto sm:mr-4 lg:mr-0 mb-4 lg:mb-0">
            <RestaurantInfo
              showMap={showMap}
              setShowMap={setShowMap}
              restaurant={restaurant}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
