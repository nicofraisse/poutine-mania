import React, { useState } from "react";
import Link from "next/link";
import { Image } from "../components/Image";
import { MessageCircle } from "react-feather";
import Color from "color";
import { ratingColors } from "../data/ratingColors";
import { formatRating } from "../lib/formatRating";
import Button from "../components/Button";
import { formatDateAgo } from "../lib/formatDateAgo";
import { flatten } from "lodash";
import { ImageModal } from "./ImageModal";
import Skeleton from "react-loading-skeleton";
import { useCurrentUser } from "../lib/useCurrentUser";
import { useTranslation } from "next-i18next";

export const EatenRestaurantCard = ({ restaurant }) => {
  const { currentUser } = useCurrentUser();
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const { t } = useTranslation();
  const isSkeleton = restaurant ? Object.keys(restaurant).length === 0 : {};
  const photos = isSkeleton
    ? []
    : flatten(restaurant?.reviews?.map((r) => r.photos))
        .filter(Boolean)
        .filter((i) => i !== "null");

  return (
    <>
      <div
        key={restaurant?._id}
        className="pt-5 rounded mb-2 items-start relative"
      >
        <div className="flex justify-between px-3 sm:px-0">
          {isSkeleton ? (
            <Skeleton width={180} height={20} />
          ) : (
            <Link
              legacyBehavior
              href={`/restaurants/${restaurant?.slug}`}
              passHref
            >
              <a rel="noopener noreferrer">
                <div className="font-bold text-base lg:text-lg text-teal-600 hover:underline">
                  {restaurant.name}
                </div>
              </a>
            </Link>
          )}
          <div className="h-[1px] bg-slate-200 mt-[14px] ml-4 mr-2 flex-grow"></div>
          <div className="mb-2 ml-4">
            {isSkeleton ? (
              <Skeleton width={72} height={28} className="relative -top-1" />
            ) : restaurant.reviews.length > 0 ? (
              <span
                className="py-[0px] px-[12px] rounded text-xl text-white flex items-center"
                style={{
                  backgroundColor: Color(ratingColors[Math.floor(7)])
                    .darken(0.4)
                    .desaturate(0.3),
                }}
              >
                {formatRating(restaurant.reviews[0].finalRating)}
                <span className="text-white font-normal text-xs text-opacity-80 ml-[2px] -mb-[2px]">
                  /10
                </span>
              </span>
            ) : (
              <Link
                legacyBehavior
                href={`/restaurants/${restaurant?.slug}/noter`}
                passHref
              >
                <Button height="xs" className="text-normal" variant="light">
                  {t("eatenRestaurantCard.rate")}
                </Button>
              </Link>
            )}
          </div>
        </div>

        <p className="px-3 sm:px-0" style={{ lineHeight: 1.4 }}>
          {isSkeleton ? (
            <>
              <Skeleton width={"100%"} />
              <Skeleton width={"100%"} />
            </>
          ) : (
            <>
              <MessageCircle className="inline text-stone-500 mr-1" size={18} />
              <span className="text-sm text-stone-500 inline">
                {restaurant.reviews.length > 0 &&
                restaurant.reviews.find((rev) => rev.comment) ? (
                  <>
                    {restaurant.reviews.find((rev) => rev.comment).comment}
                    <span className="text-stone-400 text-xs">
                      {" "}
                      {t("eatenRestaurantCard.onDate", {
                        date: formatDateAgo(
                          restaurant.reviews.find((rev) => rev.comment)
                            .createdAt,
                          "dd/MM/yyyy"
                        ),
                      })}
                    </span>
                  </>
                ) : (
                  t("eatenRestaurantCard.noComment")
                )}
              </span>
            </>
          )}
        </p>

        <div className="flex overflow-x-auto px-3 sm:px-0 w-screen sm:w-[600px] scrollbar-hide">
          {isSkeleton ? (
            <div className="flex mt-2">
              <Skeleton inline width={160} height={120} className="mr-3" />
              <Skeleton inline width={160} height={120} />
            </div>
          ) : (
            <>
              {photos.map((photo, index) => (
                <Image
                  key={photo}
                  src={photo}
                  alt={t("eatenRestaurantCard.photoAlt")}
                  className="cursor-pointer rounded mr-3 mt-3 max-h-[140px] max-w-[240px] object-cover"
                  onClick={() => setImgModalOpen(index)}
                  quality={20}
                />
              ))}
              <div className="min-w-[50px]"></div>
              {photos.length > 0 && (
                <div className="absolute h-[140px] bottom-0 right-[-1px] w-[50px] bg-gradient-to-r from-transparent to-neutral-50"></div>
              )}
            </>
          )}
        </div>
      </div>
      <ImageModal
        isOpen={imgModalOpen !== false}
        onClose={() => setImgModalOpen(false)}
        images={photos}
        user={currentUser?.user?.name}
        restaurant={restaurant?.name}
        initialIndex={imgModalOpen}
      />
    </>
  );
};
