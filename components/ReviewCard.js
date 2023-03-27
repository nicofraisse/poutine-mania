import React, { useState } from "react";
import { formatRating } from "../lib/formatRating";
import { formatDate } from "lib/formatDate";
import { useCurrentUser } from "lib/useCurrentUser";
import { ratingColors } from "../data/ratingColors";
import { Edit, Trash, User, X } from "react-feather";
import { Image } from "./Image";
import Modal from "react-responsive-modal";
import Link from "next/link";
import Color from "color";
import classNames from "classnames";
import { ImageModal } from "./ImageModal";

export const RatingSection = ({ review, showDate = true }) => {
  const miniRatings = (
    <div className="text-sm inline-flex text-slate-500 bg-slate-50 rounded px-1 mb-2 py-1 sm:p-0 sm:m-0 sm:bg-transparent">
      {review.friesRating && (
        <div className="mr-[4px]">
          Frites <span className="text-orange-500">{review.friesRating}</span>
        </div>
      )}
      {review.cheeseRating && (
        <div className="mr-[4px]">
          {review.friesRating && "·"} Fromage{" "}
          <span className="text-orange-500">{review.cheeseRating}</span>
        </div>
      )}
      {review.sauceRating && (
        <div className="mr-[4px]">
          {(review.friesRating || review.cheeseRating) && "·"} Sauce{" "}
          <span className="text-orange-500">{review.sauceRating}</span>
        </div>
      )}
      {review.portionRating && (
        <div className="mr-[4px]">
          {(review.friesRating || review.cheeseRating || review.sauceRating) &&
            "·"}{" "}
          Portion{" "}
          <span className="text-orange-500">{review.portionRating}</span>
        </div>
      )}
      {review.serviceRating && (
        <div className="mr-[4px]">
          {(review.friesRating ||
            review.cheeseRating ||
            review.sauceRating ||
            review.portionRating) &&
            "·"}{" "}
          Service{" "}
          <span className="text-orange-500">{review.serviceRating}</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden sm:flex flex-wrap justify-between text-base items-center mb-3">
        <div className="sm:flex flex-wrap">
          <span
            className="py-[1px] px-[6px] bg-green-200 rounded mr-2 text-lg text-white flex items-center"
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
              {" "}
              /10
            </span>
          </span>
          {(review.friesRating ||
            review.cheeseRating ||
            review.sauceRating ||
            review.portionRating) && (
            <div className="mr-2 flex items-center">{miniRatings}</div>
          )}
        </div>

        {showDate && (
          <span className="text-slate-400 text-[14px] font-normal mr-4">
            {formatDate(review.createdAt, "d MMMM yyyy", true)}
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

  console.log(review);

  return (
    <>
      <div
        className={classNames("sm:w-auto py-2 lg:py-6 sm:flex", {
          "border-t": !isFirst,
        })}
      >
        <div className="sm:basis-1/6 flex sm:flex-col items-center justify-centere text-slate-500 justify-between">
          <Link href={`/users/${review.user._id}`} passHref>
            <div className="sm:pr-3 min-w-20">
              <div className="py-2 px-2 sm:px-3 flex sm:flex-col items-center border-slate-100 rounded-lg hover:bg-slate-100 transition duration-150 cursor-pointer">
                <div className="bg-slate-50 border h-10 w-10 sm:h-12 sm:w-12 rounded-full text-slate-300 flex items-center justify-center">
                  {review.user.image ? (
                    <Image
                      alt="user-image"
                      src={review.user.image}
                      width="100%"
                      height="100%"
                      className="rounded-full h-full w-full object-cover object-center"
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
                      {review.user.reviews.length} avis
                    </div>
                  </div>
                  <div className="text-slate-500 visible sm:hidden font-light text-xs ml-3">
                    {formatDate(review.createdAt, "d MMMM yyyy")}
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
              {" "}
              /10
            </span>
          </span>
        </div>
        <div className="sm:basis-5/6 sm:w-5/6 pt-1 sm:pt-2 px-3 sm:px-0">
          <RatingSection review={review} />
          <p
            className="text-slate-500 font-light break-words text-sm sm:text-md"
            style={{ width: 0, minWidth: "100%" }}
          >
            {review.comment || (
              <span className="text-slate-300">Aucun commentaire</span>
            )}
          </p>
          <div className="flex flex-wrap mt-3">
            {review.photos?.map((photo, index) => {
              const imageContainerClass = classNames(
                "border-2 border-white",
                "rounded-md",
                "cursor-pointer",
                "overflow-hidden",
                "relative",
                {
                  "w-full pb-[66.666%]": false,
                  "w-1/3 max-h-[100px] h-20 pb-[33%]": true,
                }
              );

              return (
                <div
                  key={photo}
                  className={imageContainerClass}
                  onClick={() => setImgModalOpen(index)}
                >
                  <Image
                    src={photo}
                    alt="poutine-user-photo"
                    className="object-cover object-center absolute top-0 left-0 w-full h-full"
                  />
                </div>
              );
            })}
          </div>

          {(review.userId === currentUser?._id || currentUser?.isAdmin) && (
            <div className="mt-3 text-left text-sm text-slate-400">
              <button
                className="hover:text-blue-500"
                onClick={() => handleEdit(review)}
              >
                <Edit size={16} />
              </button>
              <span className="font-normal mx-1"></span>
              <button
                className="hover:text-red-600"
                onClick={() => handleDelete(review._id)}
              >
                <Trash size={16} />
              </button>
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
