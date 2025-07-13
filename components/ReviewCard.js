import React, { useState } from "react";
import { formatRating } from "../lib/formatRating";
import { formatDateAgo } from "lib/formatDateAgo";
import { useCurrentUser } from "lib/useCurrentUser";
import { ratingColors } from "../data/ratingColors";
import { Edit, Trash, User } from "react-feather";
import { Image } from "./Image";
import Link from "next/link";
import Color from "color";
import classNames from "classnames";
import { ImageModal } from "./ImageModal";
import { useTranslation } from "next-i18next";
import Button, { VariantColor } from "./Button";

export const RatingSection = ({ review, showDate = true }) => {
  const { t } = useTranslation();

  const miniRatings = (
    <div className="text-xs sm:text-sm inline-flex gap-[4px] items-center text-slate-500 bg-slate-50 rounded pr-2 mb-2 sm:p-0 sm:m-0 sm:bg-transparent">
      {review.finalRating && (
        <div
          className="mr-1 font-bold text-white px-2 py-[2px] rounded text-sm sm:text-base sm:hidden"
          style={{
            backgroundColor: Color(ratingColors[Math.floor(review.finalRating)])
              .darken(0.4)
              .desaturate(0.3),
          }}
        >
          {review.finalRating}
          <span className="text-white font-normal text-xs text-opacity-80 ml-[2px] -mb-[2px]">
            /10
          </span>
        </div>
      )}

      {review.friesRating && (
        <div>
          {t("ratingSection.fries")}{" "}
          <span className="text-orange-500">{review.friesRating}</span>
        </div>
      )}
      {review.cheeseRating && (
        <div>
          {review.friesRating && "·"} {t("ratingSection.cheese")}{" "}
          <span className="text-orange-500">{review.cheeseRating}</span>
        </div>
      )}
      {review.sauceRating && (
        <div>
          {(review.friesRating || review.cheeseRating) && "·"}{" "}
          {t("ratingSection.sauce")}{" "}
          <span className="text-orange-500">{review.sauceRating}</span>
        </div>
      )}
      {review.portionRating && (
        <div>
          {(review.friesRating || review.cheeseRating || review.sauceRating) &&
            "·"}{" "}
          {t("ratingSection.portion")}{" "}
          <span className="text-orange-500">{review.portionRating}</span>
        </div>
      )}
      {review.serviceRating && (
        <div>
          {(review.friesRating ||
            review.cheeseRating ||
            review.sauceRating ||
            review.portionRating) &&
            "·"}{" "}
          {t("ratingSection.service")}{" "}
          <span className="text-orange-500">{review.serviceRating}</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div
        className={classNames(
          "hidden sm:flex flex-wrap justify-between text-base items-center",
          { "mb-3": !!review.comment }
        )}
      >
        <div className="sm:flex flex-wrap">
          <span
            className="py-[1px] px-[6px] bg-green-200 rounded mr-2 text-lg text-white items-center hidden sm:flex"
            style={{
              backgroundColor: Color(
                ratingColors[Math.floor(review.finalRating)]
              )
                .darken(0.4)
                .desaturate(0.3),
            }}
          >
            {formatRating(review.finalRating)}
            <span className="text-white font-normal text-xs text-opacity-80 ml-[2px] -mb-[2px]">
              /10
            </span>
          </span>

          <div className="mr-2 flex items-center">{miniRatings}</div>
        </div>

        {showDate && (
          <span className="text-slate-400 text-[14px] font-normal mr-4">
            {formatDateAgo(review.createdAt, "d MMMM yyyy", true)}
          </span>
        )}
      </div>
      {(review.friesRating ||
        review.cheeseRating ||
        review.sauceRating ||
        review.portionRating) && (
        <div className="visible sm:hidden mb-0 sm:mb-3">{miniRatings}</div>
      )}
    </>
  );
};

export const ReviewCard = ({
  review,
  handleEdit,
  handleDelete,
  isFirst,
  restaurantName,
}) => {
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const { currentUser } = useCurrentUser();
  const { t } = useTranslation();

  return (
    <>
      <div
        className={classNames("sm:w-auto py-3 lg:py-6 sm:flex", {
          "border-t": !isFirst,
        })}
      >
        <div className="sm:basis-1/6 flex sm:flex-col items-center justify-centere text-slate-500 justify-between">
          <Link legacyBehavior href={`/profil/${review.user.slug}`} passHref>
            <div className="sm:pr-3 min-w-20">
              <div className="py-2 px-2 sm:px-3 flex sm:flex-col items-center border-slate-100 rounded-lg hover:bg-slate-100 transition duration-150 cursor-pointer">
                <div className="bg-slate-50 relative border h-10 w-10 sm:h-12 sm:w-12 rounded-full text-slate-300 flex items-center justify-center">
                  {review.user.image ? (
                    <Image
                      alt={t("reviewCard.userImageAlt")}
                      src={review.user.image}
                      fill={true}
                      className="rounded-full h-full w-full object-cover object-center"
                      quality={20}
                    />
                  ) : (
                    <User />
                  )}
                </div>
                <div>
                  <div className="flex items-baseline sm:block">
                    <div className="sm:text-center ml-3 mr-2 sm:mx-0 text-sm sm:text-sm sm:mt-2 break-words max-w-28">
                      {review.user.name}
                    </div>
                    <div className="text-center font-light text-xs text-slate-400">
                      {t("reviewCard.reviewCount", {
                        count: review.user.reviews.length,
                      })}
                    </div>
                  </div>
                  <div className="text-slate-500 visible sm:hidden font-light text-xs ml-3">
                    {formatDateAgo(review.createdAt, "d MMMM yyyy")}
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <span
            className="sm:hidden sm:py-[1px] px-[6px] bg-green-200 rounded mr-2 text-lg text-white flex items-center"
            style={{
              backgroundColor: Color(
                ratingColors[Math.floor(review.finalRating)]
              )
                .darken(0.4)
                .desaturate(0.3),
            }}
          >
            {formatRating(review.finalRating)}
            <span className="text-white font-normal text-xs text-opacity-80 ml-[2px] -mb-[2px]">
              /10
            </span>
          </span>
        </div>
        <div className="sm:basis-5/6 sm:w-5/6 pt-1 sm:pt-2 px-3 sm:px-0">
          <RatingSection review={review} />
          <p
            className="text-slate-500 font-light break-words text-sm sm:text-md whitespace-pre-wrap"
            style={{ width: 0, minWidth: "100%" }}
          >
            {review.comment || (
              <div className="text-slate-300 mt-2">
                {t("reviewCard.noComment")}
              </div>
            )}
          </p>
          <div className="flex flex-wrap mt-3 max-w-[600px]">
            {Array.isArray(review.photos) &&
              review.photos?.map((photo, index) => {
                const imageContainerClass = classNames(
                  "border-2 mb-1 mr-1 border-white",
                  "rounded-md",
                  "cursor-pointer",
                  "overflow-hidden",
                  "relative",
                  "w-[32%] pb-[32%] sm:w-[30%] sm:pb-[30%]"
                );

                return (
                  <div
                    key={photo}
                    className={imageContainerClass}
                    onClick={() => setImgModalOpen(index)}
                  >
                    <Image
                      src={photo}
                      alt={t("reviewCard.poutinePhotoAlt")}
                      className="object-cover object-center absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                );
              })}
          </div>

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
                {t("reviewCard.edit")}
              </Button>
              <Button
                variant={VariantColor.light2}
                width="xs"
                height="sm"
                className="text-sm"
                onClick={() => handleDelete(review._id)}
              >
                <Trash size={16} className="mr-2" />
                {t("reviewCard.delete")}
              </Button>
            </div>
          )}
        </div>
      </div>
      {review.photos && (
        <ImageModal
          isOpen={imgModalOpen !== false}
          onClose={() => setImgModalOpen(false)}
          images={review.photos}
          user={review.user.name}
          restaurant={restaurantName}
          initialIndex={imgModalOpen}
        />
      )}
    </>
  );
};

export default ReviewCard;
