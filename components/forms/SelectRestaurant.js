import Link from "next/link";
import React from "react";
import { ChevronRight } from "react-feather";
import { ratingColors } from "../../data/ratingColors";
import { round } from "lodash";
import { formatRating } from "../../lib/formatRating";
import classNames from "classnames";
import { formatAddress } from "../../lib/formatAddress";
import { Image } from "components/Image";
import { useTranslation } from "next-i18next";

const SelectRestaurant = ({ restaurants, userRatedRestaurants }) => {
  const { t } = useTranslation();

  return (
    <>
      {restaurants?.map((restaurant) => {
        const alreadyRated = userRatedRestaurants?.find(
          (review) => review.restaurantId === restaurant._id
        );
        const image = restaurant.reviews?.find((r) => r.photos?.[0])?.photos[0];
        const ratingValue =
          alreadyRated && formatRating(alreadyRated.finalRating);

        return (
          <Link
            legacyBehavior
            key={restaurant._id}
            href={
              alreadyRated
                ? ""
                : `/restaurants/${restaurant.slug}/noter?fromList=true`
            }
            passHref
            shallow={!!alreadyRated}
          >
            <div
              className={classNames(
                "border-t rounded p-3 cursor-pointer flex items-center justify-between",
                {
                  "hover:bg-gray-50": !alreadyRated,
                  "border-gray-50 cursor-default opacity-60": !!alreadyRated,
                }
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center w-full">
                  <Image
                    src={image}
                    alt={`${restaurant.name}-photo`}
                    className="h-12 min-w-12 max-w-12 object-cover object-center rounded-sm"
                  />
                  <div className="pl-3">
                    <div className="font-bold text-sm">{restaurant.name}</div>
                    <div className="text-xs text-gray-400">
                      {formatAddress(restaurant, t)}
                    </div>
                  </div>
                </div>
                {alreadyRated ? (
                  <div className="flex items-center text-xs">
                    <em>{t("rateRestaurant.alreadyRated")}</em>
                    <div
                      className="px-1 bg-green-200 rounded mr-2 text-gray-700 text-sm font-bold flex items-center justify-center mx-2"
                      style={{
                        backgroundColor:
                          ratingColors[round(alreadyRated.finalRating)],
                      }}
                    >
                      {t("rateRestaurant.rating", { rating: ratingValue })}
                    </div>
                  </div>
                ) : (
                  <ChevronRight
                    className="text-gray-300 ml-auto"
                    size={18}
                    style={{ minWidth: 18 }}
                  />
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default SelectRestaurant;
