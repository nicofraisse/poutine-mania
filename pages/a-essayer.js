import React, { useState } from "react";
import { useGet } from "../lib/useAxios";
import { useCurrentUser } from "../lib/useCurrentUser";
import Spinner from "components/Spinner";

import RestaurantBookmark from "../components/RestaurantBookmark";

const MesPoutines = () => {
  const { currentUser } = useCurrentUser();

  const { data: restaurants, loading: loading } = useGet(
    `/api/users/${currentUser?._id}/get-watchlist`,
    { skip: !currentUser }
  );

  if (loading) return <Spinner />;

  return (
    <div className="p-5 ">
      <h1 className="text-2xl font-black mb-5 mt-3">À essayer</h1>
      <div className="flex flex-wrap items-start">
        {restaurants?.map((r, i) => (
          <RestaurantBookmark key={i} restaurant={r} />
        ))}
      </div>
    </div>
  );
};

export default MesPoutines;
