import React from "react";
import { useGet } from "../lib/useAxios";
import { useCurrentUser } from "../lib/useCurrentUser";

import RestaurantBookmark from "../components/RestaurantBookmark";

import { EmptyState } from "../components/EmptyState";
import { useTranslation } from "next-i18next";
import { withI18n } from "../lib/withI18n";

const MesPoutines = () => {
  const { currentUser } = useCurrentUser();
  const { t } = useTranslation();

  const { data: restaurants } = useGet(
    `/api/users/${currentUser?._id}/get-watchlist`,
    { skip: !currentUser }
  );

  return (
    <div className="p-5 mx-auto max-w-lg">
      <h1 className="text-2xl font-black mb-5 mt-3 text-center sm:text-start">
        {t("watchlist.title")}
      </h1>
      <div className="flex flex-wrap items-start justify-center sm:justify-start">
        {restaurants?.length === 0 ? (
          <EmptyState />
        ) : (
          (restaurants || [{}, {}, {}]).map((r, i) => (
            <RestaurantBookmark key={i} restaurant={r} />
          ))
        )}
      </div>
    </div>
  );
};

export const getStaticProps = withI18n();

export default MesPoutines;
