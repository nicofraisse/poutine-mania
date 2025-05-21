import React, { useState } from "react";
import { useGet } from "../lib/useAxios";
import { useCurrentUser } from "../lib/useCurrentUser";
import { useTranslation } from "next-i18next";

import { EatenRestaurantCard } from "../components/EatenRestaurantCard";
import Skeleton from "react-loading-skeleton";
import { EmptyState } from "../components/EmptyState";
import { withI18n } from "../lib/withI18n";

const MesPoutines = () => {
  const { currentUser } = useCurrentUser();
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState({ rated: true, notRated: true });

  const { data: restaurants, loading } = useGet(
    `/api/users/${currentUser?._id}/get-eatenlist`,
    {
      skip: !currentUser,
    }
  );

  const filteredRestaurants = () => {
    return restaurants?.filter((r) => {
      if (currentTab.rated && currentTab.notRated) {
        return true;
      } else if (currentTab.rated) {
        return r.reviews.length > 0;
      } else if (currentTab.notRated) {
        return r.reviews.length === 0;
      }
      return false;
    });
  };

  const isSkeleton = loading || !currentUser;

  const ratedCount = restaurants?.filter((r) => r.reviews.length > 0).length;
  const notRatedCount = restaurants?.filter(
    (r) => r.reviews.length === 0
  ).length;

  return (
    <div className="sm:p-5 max-w-md mx-auto overflow-x-hidden">
      <h1 className="text-2xl font-black mb-5 mt-3 px-3 sm:px-0">
        {t("eatenlist.title")}
      </h1>

      {restaurants?.length === 0 && !loading ? (
        <div className="flex flex-wrap items-start justify-center sm:justify-start">
          <EmptyState rateCTA />
        </div>
      ) : (
        <div className="mx-3 sm:mx-0 border p-3 rounded bg-white text-sm text-slate-600">
          {isSkeleton ? (
            <>
              <Skeleton width={160} className="mb-2" />
              <Skeleton width={260} />
            </>
          ) : (
            <>
              <div className="font-bold mb-1">{t("eatenlist.filterLabel")}</div>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rated"
                    checked={currentTab.rated}
                    onChange={() =>
                      setCurrentTab({
                        ...currentTab,
                        rated: !currentTab.rated,
                      })
                    }
                  />
                  <label htmlFor="rated" className="ml-2">
                    {t("eatenlist.filter.rated", { count: ratedCount })}
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notRated"
                    checked={currentTab.notRated}
                    onChange={() =>
                      setCurrentTab({
                        ...currentTab,
                        notRated: !currentTab.notRated,
                      })
                    }
                  />
                  <label htmlFor="notRated" className="ml-2">
                    {t("eatenlist.filter.notRated", {
                      count: notRatedCount,
                    })}
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-1">
        {(filteredRestaurants() || [{}, {}, {}, {}]).map((r) => {
          return <EatenRestaurantCard key={r?._id} restaurant={r} />;
        })}
      </div>
    </div>
  );
};

export const getStaticProps = withI18n();

export default MesPoutines;
