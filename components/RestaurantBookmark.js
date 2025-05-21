import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { CheckCircle, Image as ImageIcon, XCircle } from "react-feather";
import Button from "./Button";
import { TagSection } from "./RestaurantCard";
import Link from "next/link";
import axios from "axios";
import { useCurrentUser } from "../lib/useCurrentUser";
import { toast } from "react-hot-toast";
import { Image } from "./Image";
import { useSidebarData } from "components/context/SidebarDataProvider";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "next-i18next";

const RestaurantBookmark = ({ restaurant }) => {
  const { t } = useTranslation();
  const [isEatenLoading, setIsEatenLoading] = useState(false);
  const [isWatchDeleting, setIsWatchDeleting] = useState(false);
  const [isEaten, setIsEaten] = useState(true);
  const [disapear, setDisapear] = useState(false);
  const [vanish, setVanish] = useState(false);
  const { currentUser } = useCurrentUser();
  const {
    sidebarWatchlistAmount,
    setSidebarWatchlistAmount,
    sidebarEatenlistAmount,
    setSidebarEatenlistAmount,
  } = useSidebarData();
  const isSkeleton = Object.keys(restaurant || {}).length === 0;

  useEffect(() => {
    if (currentUser && !isSkeleton)
      setIsEaten(currentUser.eatenlist?.includes(restaurant._id));
  }, [currentUser, restaurant, isSkeleton]);

  const handleToggleFromEatenlist = (restaurant) => {
    setIsEatenLoading(true);

    axios
      .post(`/api/users/${currentUser._id}/update-eatenlist`, {
        type: isEaten ? "remove" : "add",
        restaurantId: restaurant._id,
      })
      .then(() => {
        setIsEatenLoading(false);
        setIsEaten(!isEaten);

        if (isEaten) {
          toast.success(t("restaurantBookmark.removedFromEaten"));
        } else {
          const prefix = t("restaurantBookmark.addedToEatenPrefix");
          const linkText = t("restaurantBookmark.eatenLink");
          const suffix = t("restaurantBookmark.addedToEatenSuffix");
          toast.success(
            <>
              {prefix}
              <Link legacyBehavior href="/mes-poutines">
                <a className="underline text-blue-500 ml-1 cursor-pointer">
                  {linkText}
                </a>
              </Link>
              {suffix}
            </>
          );
        }

        setSidebarWatchlistAmount(
          isEaten ? sidebarWatchlistAmount + 1 : sidebarWatchlistAmount - 1
        );
        setSidebarEatenlistAmount(
          isEaten ? sidebarEatenlistAmount - 1 : sidebarEatenlistAmount + 1
        );

        if (!isEaten) {
          setTimeout(() => setDisapear(true), 2000);
          setTimeout(() => setVanish(true), 3000);
        }
      })
      .catch((e) => {
        toast.error(`${t("restaurantBookmark.error")}: ${e.message}`);
        setIsEatenLoading(false);
      });
  };

  const handleDeleteFromWatchlist = () => {
    setIsWatchDeleting(true);

    if (window.confirm(t("restaurantBookmark.confirmRemoveWatchlist"))) {
      axios
        .post(`/api/users/${currentUser._id}/update-watchlist`, {
          type: "remove",
          restaurantId: restaurant._id,
        })
        .then(() => {
          setIsWatchDeleting(false);
          toast.success(t("restaurantBookmark.removedFromWatchlist"));
          setDisapear(true);
          setTimeout(() => {
            setVanish(true);
            setSidebarWatchlistAmount(sidebarWatchlistAmount - 1);
          }, 1000);
        })
        .catch((e) => {
          toast.error(`${t("restaurantBookmark.error")}: ${e.message}`);
          setIsWatchDeleting(false);
        });
    }
  };

  return (
    <div
      className={classNames(
        "border p-4 sm:mr-4 mb-4 w-[300px] text-center rounded-md transition-all bg-white",
        {
          "shadow-md": !isEaten,
          "shadow-none": isEaten,
          "duration-500": !disapear,
          "duration-1000 opacity-0": disapear,
          hidden: vanish,
        }
      )}
    >
      <div
        className={classNames(
          "bg-gray-100 rounded h-[180px] w-full mb-2 flex items-center justify-center transition-all duration-500",
          { "opacity-50": isEaten }
        )}
      >
        {isSkeleton ? (
          <Skeleton />
        ) : restaurant.mainPhotos?.length > 0 ? (
          <Image
            src={restaurant.mainPhotos[0]}
            alt={`${restaurant.name}-photo`}
            className="h-[180px] w-full object-cover object-center rounded"
            quality={20}
          />
        ) : (
          <ImageIcon
            className="text-gray-300"
            size={48}
            alt={t("restaurantBookmark.placeholderAlt")}
          />
        )}
      </div>

      <div className="flex flex-col justify-between">
        {isSkeleton ? (
          <Skeleton className="mt-3 mb-2" width="70%" height={28} />
        ) : (
          <Link
            legacyBehavior
            href={`/restaurants/${restaurant.slug}`}
            passHref
          >
            <a
              className={classNames(
                "text-xl font-bold text-teal-500 block my-2",
                {
                  "opacity-50": isEaten,
                }
              )}
            >
              {restaurant.name}
            </a>
          </Link>
        )}

        <div
          className={classNames({ "mb-4": !isSkeleton, "opacity-50": isEaten })}
        >
          {isSkeleton ? (
            <>
              <Skeleton height={12} />
              <Skeleton height={12} className="relative -top-1" />
            </>
          ) : (
            <TagSection
              categories={restaurant.categories}
              priceRange={restaurant.priceRange}
              succursales={restaurant.succursales}
              city={
                restaurant.succursales[0].address?.context?.find((el) =>
                  el.id?.includes("neighborhood")
                )?.text
              }
              smallText
            />
          )}
        </div>

        <div className="flex items-center justify-around">
          {isSkeleton ? null : (
            <Button
              height="sm"
              onClick={
                !isEaten ? () => handleToggleFromEatenlist(restaurant) : null
              }
              className={classNames(
                "inline-flex hover:bg-white hover:text-green-600 hover:border-green-600 transition-all items-center text-green-500 bg-white border-green-500 px-4 shrink-0 text-sm sm:text-md h-[35px] sm:h-[40px]",
                {
                  "text-green-400 bg-green-50 hover:bg-green-50 border-none pointer-events-none":
                    isEaten,
                }
              )}
              variant="light"
              loading={isEatenLoading}
            >
              {!isEaten && (
                <CheckCircle className="mr-2 sm:text-lg w-4 sm:w-5" />
              )}
              <span>
                {isEaten
                  ? t("restaurantBookmark.eaten")
                  : t("restaurantBookmark.iAte")}
              </span>
            </Button>
          )}
        </div>

        {isSkeleton ? (
          <Skeleton width="45%" height={40} className="mt-2 mb-7" />
        ) : (
          <button
            className={classNames(
              "mx-auto flex text-xs items-center transition-opacity duration-200 text-gray-400 mt-2",
              { "animate-pulse": isWatchDeleting }
            )}
            onClick={() =>
              isEaten
                ? handleToggleFromEatenlist(restaurant)
                : handleDeleteFromWatchlist()
            }
          >
            {!isEaten && <XCircle className="mr-1 sm:text-lg w-3 sm:w-4" />}
            <span>
              {isEaten
                ? t("restaurantBookmark.cancel")
                : t("restaurantBookmark.notInterested")}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RestaurantBookmark;
