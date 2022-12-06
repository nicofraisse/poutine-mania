import React, { useState } from "react";
import { formatRating } from "../lib/formatRating";
import { formatName } from "../lib/formatName";
import { formatDate } from "lib/formatDate";
import { useCurrentUser } from "lib/useCurrentUser";
import { ratingColors } from "../data/ratingColors";
import { round } from "lodash";
import { User, X } from "react-feather";
import { Image } from "./Image";
import Modal from "react-responsive-modal";
import Link from "next/link";
import NextImage from "next/image";
import Color from "color";

const ReviewCard = ({ review, handleEdit, handleDelete }) => {
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const { currentUser } = useCurrentUser();

  const miniRatings = (
    <div className="text-sm flex text-gray-600">
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
      <div className="sm:w-auto py-2 lg:py-4 border-t sm:flex">
        <div className="sm:basis-1/6 flex sm:flex-col items-center justify-centere text-gray-500 justify-between">
          <Link href={`/users/${review.user._id}`} passHref>
            <div className="sm:pr-3 sm:min-w-36">
              <div className="py-2 px-2 sm:px-3 flex sm:flex-col items-center border-gray-100 rounded-lg hover:bg-gray-100 transition duration-150 cursor-pointer">
                <div className="bg-gray-50 border h-10 w-10 sm:h-12 sm:w-12 rounded-full text-gray-300 flex items-center justify-center">
                  {review.user.image ? (
                    <NextImage
                      alt="user-image"
                      src={review.user.image}
                      width="100%"
                      height="100%"
                      className="rounded-full object-cover object-center"
                    />
                  ) : (
                    <User />
                  )}
                </div>
                <div className="flex items-baseline sm:block">
                  <div className="sm:text-center ml-3 mr-2 sm:mx-0 text-sm sm:text-sm sm:mt-2 break-words max-w-28">
                    {review.user.name}
                  </div>
                  <div className="text-center font-light text-xs text-gray-400">
                    {review.user.reviews.length} avis
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <span
            className="sm:hidden sm:py-[1px] px-[6px] bg-green-200 rounded mr-2 text-lg text-white flex items-center"
            style={{
              backgroundColor: Color(ratingColors[round(review.rating)])
                .darken(0.4)
                .desaturate(0.3),
            }}
          >
            {formatRating(review.rating)}
            <span className="text-white font-normal text-xs text-opacity-80 ml-[2px] -mb-[2px]">
              {" "}
              /10
            </span>
          </span>
        </div>
        <div className="sm:basis-5/6 sm:w-5/6 pt-1 sm:pt-2 px-3 sm:px-0">
          <div className="hidden sm:flex text-base font-bold items-center mb-3">
            <span
              className="py-[1px] px-[6px] bg-green-200 rounded mr-2 text-lg text-white flex items-center"
              style={{
                backgroundColor: Color(ratingColors[round(review.rating)])
                  .darken(0.4)
                  .desaturate(0.3),
              }}
            >
              {formatRating(review.rating)}
              <span className="text-white font-normal text-xs text-opacity-80 ml-[2px] -mb-[2px]">
                {" "}
                /10
              </span>
            </span>

            {(review.friesRating ||
              review.cheeseRating ||
              review.sauceRating ||
              review.portionRating ||
              review.serviceRating) && (
              <div className="mr-2">{miniRatings}</div>
            )}

            <span className="text-gray-400 text-[14px] font-normal">
              {formatDate(review.createdAt, "d MMMM yyyy")}
            </span>
          </div>

          {(review.friesRating ||
            review.cheeseRating ||
            review.sauceRating ||
            review.portionRating ||
            review.serviceRating) && (
            <div className="visible sm:hidden mb-3">{miniRatings}</div>
          )}

          <p className="text-gray-500 font-light break-words text-sm sm:text-md">
            {review.comment}
          </p>

          {review.photos?.[0] && (
            <Image
              publicId={review.photos?.[0]}
              alt="poutine-user-photo"
              // width={280
              responsive
              className="border rounded-md object-cover sm:max-h-72 max-h-60 my-3"
              onClick={() => setImgModalOpen(true)}
            />
          )}
          {(review.userId === currentUser?._id || currentUser?.isAdmin) && (
            <div className="mt-3 text-left text-sm text-gray-400">
              <button
                className="hover:underline"
                onClick={() => handleEdit(review)}
              >
                Modifier
              </button>
              <span className="font-normal mx-1">/</span>
              <button
                className="hover:underline"
                onClick={() => handleDelete(review._id)}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
        open={imgModalOpen}
        onClose={() => setImgModalOpen(false)}
        closeIcon={<X />}
        center
      >
        <div className="border w-full ">
          <Image
            publicId={review.photos?.[0]}
            alt="poutine-user-photo"
            width={"100%"}
            className="border rounded-md"
            onClick={() => setImgModalOpen(true)}
          />
        </div>
      </Modal>
    </>
  );
};

export default ReviewCard;
