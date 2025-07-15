import Link from "next/link";
import React, { useState } from "react";
import { Edit, Edit3, User, Trash } from "react-feather";
import { Image } from "./Image";
import Button, { VariantColor } from "./Button";
import { formatDateAgo } from "lib/formatDateAgo";

import { useCurrentUser } from "../lib/useCurrentUser";
import { useRouter } from "next/router";
import { useRateRestaurant } from "components/context/RateRestaurantProvider";
import axios from "axios";
import toast from "react-hot-toast";
import classNames from "classnames";
import { RatingSection } from "./ReviewCard";
import { ImageModal } from "./ImageModal";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "next-i18next";

export const ProfileReviewCard = ({ review, isIndex, userName, loading }) => {
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const { currentUser } = useCurrentUser();
  const { reload } = useRouter();
  const { rateRestaurant } = useRateRestaurant();
  const { t } = useTranslation();

  const handleEdit = (review) => {
    rateRestaurant(review.restaurants[0], review);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("profileReviewCard.confirmDelete"))) {
      await axios
        .delete(`/api/reviews/${id}/delete?userId=${review.user._id}`)
        .then(() => {
          toast.success(t("profileReviewCard.deleteSuccess"));
          reload(window.location.pathname);
        })
        .catch((e) => toast.error(e.message));
    }
  };

  if (loading) {
    return (
      <div className="my-5">
        <div>
          <Skeleton inline circle width={28} height={28} />
          <Skeleton inline height={24} width="50%" style={{ marginLeft: 10 }} />
          <div className="mt-2 border border-slate-100 shadow rounded-md p-3 sm:p-4 bg-white">
            <Skeleton width={50} height={32} inline />
            <Skeleton
              width={150}
              height={24}
              inline
              className="ml-2 relative top-1"
            />
            <Skeleton height={120} className="mt-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!review.restaurants || review.restaurants.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[540px]">
      <div className="text-slate-400 flex sm:justify-between xl:justify-start items-start text-sm">
        <div className="flex">
          {isIndex && (
            <div className="h-6 min-w-6 max-w-6 block relative top-[13px] translate-y-[-13px] translate-x-[-6px]">
              {review.user?.image ? (
                <Image
                  alt={t("profileReviewCard.userImageAlt")}
                  src={review.user.image}
                  className="h-6 min-w-6 max-w-6 rounded-full object-cover object-center"
                  quality={10}
                />
              ) : (
                <div className="h-6 min-w-6 rounded-full bg-slate-300 flex items-center justify-center translate-y-[-2px]">
                  <User className="text-white" size={16} />
                </div>
              )}
            </div>
          )}
          <span>
            <span className="text-sm sm:text-base">
              {isIndex ? (
                <>
                  <Link
                    legacyBehavior
                    href={`/profil/${review.user?.slug}`}
                    passHref
                  >
                    <span className="font-bold hover:text-slate-500 cursor-pointer w-3/4">
                      {review?.user?.name?.slice(0, 32)}
                    </span>
                  </Link>{" "}
                  {t("profileReviewCard.has")}{" "}
                </>
              ) : (
                <>
                  <Edit3 className="mr-1 sm:mr-2 inline -mt-1 w-4 h-4 sm:w-5 sm:h-5" />
                  {currentUser && currentUser._id === review.userId
                    ? t("profileReviewCard.youHave")
                    : `${userName} ${t("profileReviewCard.has")}`}
                  &nbsp;
                </>
              )}
              {t("profileReviewCard.rated")}{" "}
              <Link
                legacyBehavior
                href={`/restaurants/${review.restaurants[0].slug}`}
                passHref
              >
                <a className="text-teal-500 font-bold hover:text-teal-600">
                  {review.restaurants[0].name}
                </a>
              </Link>
            </span>
            <span className="inline sm:hidden xl:inline text-slate-300 right-0 text-xs ml-1 font-normal relative sm:top-[4px] xl:top-0">
              <span>- </span>
              {formatDateAgo(review.createdAt, "d MMMM yyyy", true)}
            </span>
          </span>
        </div>
        <span className="hidden sm:inline xl:hidden text-slate-300 text-xs ml-1 font-normal relative sm:top-[4px] flex-grow text-right min-w-28">
          {formatDateAgo(review.createdAt, "d MMMM yyyy", true)}
        </span>
      </div>
      <div className="text-slate-700 mt-2 mb-8 border border-slate-100 shadow rounded-md p-3 sm:p-4 bg-white">
        <RatingSection review={review} showDate={false} showFinalRating />
        {review.comment && (
          <p className="rounded-xl text-sm px-1 w-full text-slate-600 whitespace-pre-wrap">
            {review.comment}
          </p>
        )}
        {Array.isArray(review.photos) && review.photos?.length > 0 && (
          <div className="mt-3 flex flex-wrap">
            {review.photos?.map((photo, index) => {
              const isFirstImage = index === 0;
              const isEvenLength = review.photos.length % 2 === 0;

              const imageContainerClass = classNames(
                "border-2 border-white",
                "rounded-md",
                "cursor-pointer",
                "overflow-hidden",
                "relative",
                {
                  "w-full pb-[66.666%]": isFirstImage && !isEvenLength,
                  "w-1/2 pb-[66.666%]": !(isFirstImage && !isEvenLength),
                }
              );

              return (
                <div
                  key={index}
                  className={imageContainerClass}
                  onClick={() => setImgModalOpen(index)}
                >
                  <Image
                    src={photo}
                    alt={t("profileReviewCard.poutinePhotoAlt")}
                    className="object-cover object-center absolute top-0 left-0 w-full h-full"
                    quality={50}
                  />
                </div>
              );
            })}
          </div>
        )}
        {(review.userId === currentUser?._id || currentUser?.isAdmin) && (
          <div className="mt-3 flex space-x-3">
            <Button
              variant={VariantColor.light2}
              width="xs"
              height="sm"
              className="text-sm"
              onClick={() => handleEdit(review)}
            >
              <Edit size={16} className="mr-2" />
              {t("profileReviewCard.edit")}
            </Button>
            <Button
              variant={VariantColor.light2}
              width="xs"
              height="sm"
              className="text-sm"
              onClick={() => handleDelete(review._id)}
            >
              <Trash size={16} className="mr-2" />
              {t("profileReviewCard.delete")}
            </Button>
          </div>
        )}
      </div>
      <ImageModal
        isOpen={imgModalOpen !== false}
        onClose={() => setImgModalOpen(false)}
        images={review.photos}
        user={review?.user?.name || t("profileReviewCard.unknown")}
        restaurant={review.restaurants[0].name}
        initialIndex={imgModalOpen}
      />
    </div>
  );
};
