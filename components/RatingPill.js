import classNames from "classnames";
import { formatRating } from "../lib/formatRating";
import { ratingColors } from "data/ratingColors";
import Color from "color";
import { getRatingColor } from "../data/ratingColors";
import { useTranslation } from "next-i18next";

const RatingPill = ({
  avgRating,
  reviewCount,
  single,
  isNew,
  isDarkBackground,
  hideNewRatingInfo,
}) => {
  const { t } = useTranslation();

  if (isNew)
    return (
      <NewRatingPill
        avgRating={avgRating}
        reviewCount={reviewCount}
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
          {!single && (
            <span className="text-xs text-gray-600 ml-1">
              {" • "}
              {t(
                reviewCount > 1
                  ? "ratingPill.reviewCount_plural"
                  : "ratingPill.reviewCount",
                { count: reviewCount }
              )}
            </span>
          )}
        </>
      ) : (
        <span className="text-xs text-gray-600">
          {t("ratingPill.noReviews")}
        </span>
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
  const { t } = useTranslation();
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
                    reviewCount === 0 ? "#ddd" : color.darken(0.2)
                  }`,
                }}
              ></div>
              {isPartialFill && (
                <div
                  className="h-full w-[13px] rounded-full -mt-[13px]"
                  style={{
                    background: `linear-gradient(90deg, ${color
                      .darken(0.2)
                      .toString()} ${partialFillPercentage}%, white ${partialFillPercentage}%)`,
                    border: `1px solid ${
                      reviewCount === 0 ? "#ddd" : color.darken(0.2)
                    }`,
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
      {!hideNewRatingInfo &&
        (reviewCount > 0 ? (
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
              className={classNames("font-normal ml-[1px]", {
                "text-white": isDarkBackground,
                "text-gray-400": !isDarkBackground,
              })}
            >
              /10
            </div>
            <div
              className={classNames("font-normal text-xs ml-2", {
                "text-white": isDarkBackground,
                "text-slate-400": !isDarkBackground,
              })}
            >
              {t(
                reviewCount > 1
                  ? "ratingPill.reviewCount_plural"
                  : "ratingPill.reviewCount",
                { count: reviewCount }
              )}
            </div>
          </div>
        ) : (
          <div
            className={classNames("font-normal text-xs ml-2", {
              "text-white": isDarkBackground,
              "text-gray-400": !isDarkBackground,
            })}
          >
            {t("ratingPill.noReviews")}
          </div>
        ))}
    </div>
  );
};

export default RatingPill;
