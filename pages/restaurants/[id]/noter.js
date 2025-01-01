import React from "react";
import { useGet } from "lib/useAxios";
import { useRouter } from "next/router";
import RestaurantCard from "components/RestaurantCard";
import { RateRestaurantNew } from "components/forms/RateRestaurantNew";

const NoterRestaurant = () => {
  const { query, push } = useRouter();

  const { data: restaurant, loading } = useGet(`/api/restaurants/${query.id}`, {
    skip: !query.id,
  });

  return (
    <div className="p-4 sm:p-10 sm:pb-4 max-w-xs mx-auto bg-white mb-10">
      <h1 className="text-lg xs:text-xl font-black mb-3">
        Qu&apos;avez-vous pensé(e) de leur poutine?
      </h1>

      <div className="-ml-4 -mr-4 xs:w-auto xs:mr-0 xs:ml-0 mt-0 rounded mb-5">
        <RestaurantCard restaurant={restaurant || {}} openInNewTab={true} />
      </div>

      <RateRestaurantNew
        onSubmit={() => push(`/noter?fromRateSuccess=${restaurant?.slug}`)}
        restaurantId={restaurant?._id}
        loading={loading || !restaurant}
      />
    </div>
  );
};

export default NoterRestaurant;
