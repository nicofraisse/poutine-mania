import classNames from "classnames";
import { formatRating } from "../lib/formatRating";
import { round } from "lodash";
import { ratingColors } from "data/ratingColors";
import { Star } from "react-feather";
import Color from "color";
import { useState } from "react";
import { useRateRestaurant } from "components/context/RateRestaurantProvider";

const RatingPill = ({
  avgRating,
  reviewCount,
  single,
  isStar,
  isNew,
  onRate,
  isDarkBackground,
  hideNewRatingInfo,
}) => {
  if (isNew)
    return (
      <NewRatingPill
        avgRating={avgRating}
        reviewCount={reviewCount}
        onRate={onRate}
        isDarkBackground={isDarkBackground}
        hideNewRatingInfo={hideNewRatingInfo}
      />
    );
  if (isStar)
    return (
      <StarRating avgRating={avgRating} reviewCount={reviewCount} showOutOf />
    );
  return (
    <div
      className={classNames(
        "text-xs lg:text-sm text-gray-800 rounded flex items-center justify-center",
        {
          "h-6 min-w-20": reviewCount === 0 && !single,
          "h-8 min-w-24": reviewCount !== 0 && !single,
          "h-7 min-w-14 justify-center": single,
        }
      )}
      style={{
        backgroundColor: avgRating ? ratingColors[round(avgRating)] : "#eee",
      }}
    >
      {reviewCount > 0 ? (
        <>
          <span className="font-bold flex items-center">
            {formatRating(avgRating)}/10
          </span>
          {reviewCount && !single && (
            <span className="text-xs text-gray-600 ml-1">
              {" "}
              • {reviewCount} avis
            </span>
          )}
        </>
      ) : (
        <span className="text-xs text-gray-600">Aucun avis</span>
      )}
    </div>
  );
};

const NewRatingPill = ({
  avgRating,
  reviewCount,
  onRate,
  isDarkBackground,
  hideNewRatingInfo,
}) => {
  const color = Color(ratingColors[round(avgRating)]);

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[...Array(10)].map((_, i) => {
          return (
            <div key={i} className="h-[13px] pr-[2px]">
              <div
                className="h-full w-[13px] rounded-full bg-gray-300"
                style={{
                  backgroundColor: i < avgRating ? color.darken(0.2) : "white",
                  border: `1px solid ${
                    reviewCount === 0
                      ? "#ddd"
                      : i < avgRating
                      ? color.darken(0.2)
                      : color.darken(0.2)
                  }`,
                }}
              ></div>
            </div>
          );
        })}
        {/* <div
          className='h-full rounded-l-full'
          style={{
            backgroundColor: avgRating ? color.darken(0.15) : '#eee',
            width: avgRating ? `${avgRating * 10}%` : 0,
          }}
        ></div> */}
      </div>
      {!hideNewRatingInfo &&
        (avgRating ? (
          <div
            className={classNames("text-sm font-bold mx-2 flex items-center", {
              "text-white": isDarkBackground,
              "text-gray-600": !isDarkBackground,
            })}
          >
            <div>{formatRating(avgRating)}</div>
            <div
              className={classNames("font-normal  ml-[1px]", {
                "text-white": isDarkBackground,
                "text-gray-400": !isDarkBackground,
              })}
            >
              /10
            </div>
            {reviewCount && (
              <div
                className={classNames("font-normal text-xs ml-1", {
                  "text-white": isDarkBackground,
                  "text-gray-400": !isDarkBackground,
                })}
              >
                {1 === 0 ? "Votre note" : `(${reviewCount} avis)`}
              </div>
            )}
          </div>
        ) : (
          <div
            className={classNames("font-normal text-xs ml-2", {
              "text-white": isDarkBackground,
              "text-gray-400": !isDarkBackground,
            })}
          >
            {1 === 0 ? "Votre note" : "Aucun avis"}
          </div>
        ))}
    </div>
  );
};

const StarRating = ({ avgRating, reviewCount }) => {
  return (
    <div className="flex items-center my-1">
      <Star
        fill={reviewCount > 0 ? "#ffcb6b" : "white"}
        color={reviewCount > 0 ? "#ffcb6b" : "#aaa"}
        size={22}
      />
      {reviewCount > 0 && (
        <span className="font-bold text-lg text-gray-700 ml-1">
          {formatRating(avgRating)}
        </span>
      )}
      <span className="mx-2 text-gray-500">({reviewCount} avis)</span>
    </div>
  );
};

export default RatingPill;
