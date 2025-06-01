import Color from "color";
import React from "react";
import { getRatingColor } from "../data/ratingColors";
import { meanBy, round, uniqBy, orderBy } from "lodash";
import { formatCity } from "../lib/formatAddress";
import Tooltip from "rc-tooltip";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { EmptyState } from "components/EmptyState";
import { useTranslation } from "next-i18next";

const UserRanking = ({ reviews, loading }) => {
  const { t } = useTranslation();
  const reviewedRestaurants = reviews?.map((review) => {
    return { ...review.restaurants[0], review };
  });

  const aggr = reviewedRestaurants?.map((r1) => {
    const sameRestaurants = reviewedRestaurants.filter(
      (r2) => r2._id === r1._id
    );
    const nbReviews = sameRestaurants.length;
    return {
      ...r1,
      nbReviews,
      avgRating: meanBy(sameRestaurants, (r3) => r3.review.finalRating),
    };
  });

  const uniqueAggr = uniqBy(aggr, (r) => r._id).filter(
    (r) => !isNaN(r.avgRating)
  );
  const sortedAggr = orderBy(uniqueAggr, "avgRating", "desc");
  if (reviews && reviews.length === 0)
    return <EmptyState hideButton title="Aucune poutine mangée" />;

  return (
    <div>
      <table className="border-collapse table-auto w-full text-sm">
        <thead>
          <tr>
            <th className="text-sm sm:text-base bg-slate-50 border-b font-bold text-slate-400 text-left rounded-tl-lg w-0"></th>
            <th className="text-sm sm:text-base bg-slate-50 border-b font-bold pr-8 p-4 pl-0 pb-3 text-slate-400 text-left">
              {t("userRanking.poutinerie")}
            </th>
            <th className="text-sm sm:text-base bg-slate-50 border-b font-bold pr-3 p-4 pl-0 pb-3 text-slate-400 text-left">
              {t("userRanking.description")}
            </th>
            {/* <th className="text-sm sm:text-base bg-slate-50 border-b font-bold p-4 pl-0 pb-3 text-slate-400 text-left">
              Ville
            </th> */}
            {/* <th className="text-sm sm:text-base bg-slate-50 border-b font-bold p-4 pl-0 pb-3 text-slate-400 text-left">
              Prix
            </th> */}
            <th className="text-sm sm:text-base bg-slate-50 border-b font-bold pr-0 p-4 pl-2 pb-3 text-slate-400 text-left w-20 xs:w-28 sm:w-32 rounded-tr-lg">
              {t("userRanking.saNote")}
            </th>
          </tr>
        </thead>
        <tbody>
          {(loading ? [{}, {}, {}, {}] : sortedAggr).map((r, i) => {
            const isSkeleton = loading;
            return (
              <tr key={i}>
                <td className="border-b border-slate-100 pr-2 sm:p-3 pl-3 sm:pl-6 text-enter text-lg sm:text-3xl text-stone-300 font-bold">
                  {isSkeleton ? (
                    <Skeleton width={40} className="mr-2" />
                  ) : (
                    `#${i + 1}`
                  )}
                </td>
                <td className="border-b border-slate-100 sm:pr-3 p-1 pl-0 text-teal-600 hover:text-teal-500 text-sm sm:text-base font-bold">
                  {isSkeleton ? (
                    <Skeleton className="flex-grow" />
                  ) : (
                    <Link legacyBehavior href={`/restaurants/${r.slug}`}>
                      {r.name}
                    </Link>
                  )}
                </td>
                <td className="border-b border-slate-100 sm:pr-3 p-1 pl-0 text-xs sm:text-base text-slate-500">
                  {isSkeleton ? (
                    <Skeleton />
                  ) : (
                    <>
                      {r?.categories?.[0]}
                      <span className="hidden sm:inline">
                        {r?.succursales?.length > 1 ? ", " : " à "}
                        {r?.succursales && formatCity(r, t)}
                      </span>
                    </>
                  )}
                </td>
                {/* <td className="border-b border-slate-100 sm:sm:p-3 p-1 pl-0 text-slate-500">
                  {r.city}
                </td> */}
                {/* <td className="border-b border-slate-100 sm:sm:p-3 p-1 pl-0 text-slate-500">
                  <div className="bg-slate-400 px-2 rounded border inline-block text-white">
                    {repeat("$", r.priceRange)}
                  </div>
                </td> */}
                <td className="border-b border-slate-100 text-center flex sm:p-3 p-1">
                  {isSkeleton ? (
                    <Skeleton
                      className="w-[4.5rem] h-9 my-2 sm:my-3 flex items-center justify-center"
                      width={80}
                    />
                  ) : (
                    <div
                      className="w-[4.5rem] h-9 my-2 sm:my-3 flex items-center justify-center rounded shadow"
                      style={{
                        backgroundColor: Color(
                          getRatingColor(r.avgRating)
                        ).lighten(0),
                      }}
                    >
                      <span className="font-black text-xl text-slate-600">
                        {round(r.avgRating, 1)}
                      </span>
                      <span className="text-slate-500 ml-[2px] block -mb-[2px]">
                        /10
                      </span>
                    </div>
                  )}
                  {!isSkeleton && (
                    <>
                      {r.nbReviews > 1 && (
                        <div className="hidden sm:flex select-none xs:ml-3 border-slate-100 xs:p-3 pl-0 text-slate-300 hover:text-slate-400 items-center justify-center">
                          {/* <MessageCircle size={16} className="mr-[1px]" /> */}
                          <Tooltip
                            placement="top"
                            trigger={["hover"]}
                            overlay={<div>Basé sur {r.nbReviews} notes</div>}
                            className=""
                          >
                            <div>({r.nbReviews})</div>
                          </Tooltip>
                        </div>
                      )}
                      <div className="hidden xs:flex sm:hidden text-slate-300 text-xs items-center justify-center ml-3">
                        ({r.nbReviews})
                      </div>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserRanking;
