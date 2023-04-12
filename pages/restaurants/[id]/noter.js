import React from "react";
import { useGet } from "lib/useAxios";
import { useRouter } from "next/router";
import RestaurantCard from "components/RestaurantCard";
import { RateRestaurantNew } from "components/forms/RateRestaurantNew";
import Skeleton from "react-loading-skeleton";

const NoterRestaurant = () => {
  const { query, push } = useRouter();

  const { data: restaurant, loading } = useGet(`/api/restaurants/${query.id}`, {
    skip: !query.id,
  });

  return (
    <div className="p-4 sm:p-10 max-w-xs">
      <h1 className="text-lg xs:text-xl font-black mb-3">
        Qu&apos;avez-vous pensé(e) de leur poutine?
      </h1>

      <div className="-ml-4 -mr-4 xs:w-auto xs:mr-0 xs:ml-0 mt-0 rounded mb-5">
        <RestaurantCard restaurant={restaurant || {}} />
      </div>

      <RateRestaurantNew
        onSubmit={() => push(`/noter?fromRateSuccess=${query.id}`)}
        restaurantId={query.id}
        loading={loading || !restaurant}
      />
    </div>
  );
};

export default NoterRestaurant;
