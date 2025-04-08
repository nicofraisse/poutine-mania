import classNames from "classnames";
import { formatRating } from "../lib/formatRating";
import { ratingColors } from "data/ratingColors";
import Color from "color";
import { getRatingColor } from "../data/ratingColors";

const RatingPill = ({
  avgRating,
  reviewCount,
  single,
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

  return (
    <div
      className={classNames(
        "text-xs lg:text-sm text-slate-700 rounded flex items-center justify-center",
        {
          "h-6 min-w-20": reviewCount === 0 && !single,
          "h-8 min-w-24": reviewCount !== 0 && !single,
          "h-7 min-w-14 justify-center": single,
        }
      )}
      style={{
        backgroundColor: avgRating ? getRatingColor(avgRating) : "#eee",
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
  isDarkBackground,
  hideNewRatingInfo,
}) => {
  const color = Color(ratingColors[Math.round(avgRating)]);

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[...Array(10)].map((_, i) => {
          const isPartialFill =
            Math.floor(avgRating) === i && avgRating % 1 !== 0;
          const partialFillPercentage = (avgRating % 1) * 100;

          return (
            <div key={i} className="h-[13px] pr-[2px] ">
              <div
                className="h-full w-[13px] rounded-full bg-gray-300 "
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
              {isPartialFill && (
                <div
                  className="h-full w-[13px] rounded-full -mt-[13px]"
                  style={{
                    background: `linear-gradient(90deg, ${color.darken(
                      0.2
                    )} ${partialFillPercentage}%, white ${partialFillPercentage}%)`,
                    border: `1px solid ${
                      reviewCount === 0
                        ? "#ddd"
                        : i < avgRating
                        ? color.darken(0.2)
                        : color.darken(0.2)
                    }`,
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
      {!hideNewRatingInfo &&
        (avgRating ? (
          <div
            className={classNames(
              "text-sm font-bold mx-2 flex items-center text-center",
              {
                "text-white": isDarkBackground,
                "text-gray-600": !isDarkBackground,
              }
            )}
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
                className={classNames("font-normal text-xs ml-2", {
                  "text-white": isDarkBackground,
                  "text-slate-400": !isDarkBackground,
                })}
              >
                {`${reviewCount} avis`}
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
            {"Aucun avis"}
          </div>
        ))}
    </div>
  );
};

export default RatingPill;
