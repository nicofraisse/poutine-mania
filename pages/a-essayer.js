import React from "react";
import { useGet } from "../lib/useAxios";
import { useCurrentUser } from "../lib/useCurrentUser";
import Spinner from "components/Spinner";

import RestaurantBookmark from "../components/RestaurantBookmark";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "../components/Button";

const EmptyState = () => {
  const { push } = useRouter();
  return (
    <div className="flex flex-col p-10 my-8 text-slate-600 items-center mx-auto">
      <div className="bg-gray-200 w-36 h-36 rounded-full flex items-center justify-center">
        <Image
          src="/poutinebw.png"
          width={100}
          height={100}
          alt="empty-poutine"
          className="opacity-40"
        />
      </div>
      <div className="font-bold my-5">Aucune poutine trouvée</div>
      <Button
        width="sm"
        height="sm"
        className="py-1 px-3 bg-teal-500 text-white inlint-block"
        onClick={() => push("/restaurants")}
      >
        Découvrir des poutines
      </Button>
    </div>
  );
};
const MesPoutines = () => {
  const { currentUser } = useCurrentUser();

  const { data: restaurants, loading: loading } = useGet(
    `/api/users/${currentUser?._id}/get-watchlist`,
    { skip: !currentUser }
  );

  return (
    <div className="p-5 ">
      <h1 className="text-2xl font-black mb-5 mt-3 text-center sm:text-start">
        À essayer
      </h1>
      <div className="flex flex-wrap items-start justify-center sm:justify-start">
        {loading ? (
          <Spinner />
        ) : restaurants?.length === 0 ? (
          <EmptyState />
        ) : (
          restaurants?.map((r, i) => (
            <RestaurantBookmark key={i} restaurant={r} />
          ))
        )}
      </div>
    </div>
  );
};

export default MesPoutines;
