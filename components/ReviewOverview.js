import RatingPill from "./RatingPill";
import { DataRing } from "./display/DataRing";

import cheese1 from "assets/icons/cheese1.svg";
import fries from "assets/icons/fries.svg";
import sauce from "assets/icons/sauce.svg";
import { useEffect, useState } from "react";
import { round } from "lodash";
import classNames from "classnames";
import Button from "./Button";
import { Edit3 } from "react-feather";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";

const IngredientRatingRings = ({
  friesRating,
  cheeseRating,
  sauceRating,
  noFries,
  noCheese,
  noSauce,
}) => {
  return (
    <div className={"flex justify-between"}>
      <div
        className={classNames("md:mx-1", {
          "opacity-60": noFries,
        })}
      >
        <DataRing
          caption="Frites"
          icon={fries}
          iconStyle={{ width: 28 }}
          percent={friesRating * 10}
          noRatings={noFries}
        />
        <div className="text-sm text-center font-bold text-gray-400">
          Frites
        </div>
      </div>
      <div
        className={classNames("md:mx-1", {
          "opacity-60": noCheese,
        })}
      >
        <DataRing
          caption="Fromage"
          icon={cheese1}
          iconStyle={{ width: 25 }}
          percent={cheeseRating * 10}
          noRatings={noCheese}
        />
        <div className="text-sm text-center font-bold text-gray-400">
          Fromage
        </div>
      </div>
      <div
        className={classNames("md:mx-1", {
          "opacity-60": noSauce,
        })}
      >
        <DataRing
          caption="Sauce"
          icon={sauce}
          iconStyle={{ width: 30 }}
          percent={sauceRating * 10}
          noRatings={noSauce}
        />
        <div className="text-sm text-center font-bold text-gray-400">Sauce</div>
      </div>
    </div>
  );
};

export const ReviewOverview = ({ restaurant }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const isSkeleton = !restaurant;

  const noReviews = restaurant?.reviews.length === 0;
  const noFries = !restaurant?.avgFriesRating;
  const noCheese = !restaurant?.avgCheeseRating;
  const noSauce = !restaurant?.avgSauceRating;
  return (
    <div className="select-none">
      <div className={classNames("py-1", { "opacity-60": noReviews })}>
        <div className="mb-2">
          {isSkeleton ? (
            <Skeleton height={40} width={80} className="mt-2" />
          ) : (
            <>
              <span className="font-bold text-4xl">
                {noReviews ? "?" : round(restaurant.avgRating, 1)}
              </span>
              <span className="text-sm">/10</span>
            </>
          )}
        </div>
        <div className="flex justify-center mb-2">
          {isSkeleton ? (
            <Skeleton height={18} width={180} />
          ) : (
            <RatingPill
              isNew
              avgRating={restaurant.avgRating}
              reviewCount={restaurant.reviewCount}
              hideNewRatingInfo
            />
          )}
        </div>
        {isSkeleton ? (
          <Skeleton height={18} width={60} />
        ) : (
          <div className="text-sm">
            {restaurant.reviews.length === 0
              ? "Aucun"
              : restaurant.reviews.length}{" "}
            avis
          </div>
        )}
      </div>
      <div className="max-w-[300px] mx-auto mt-4">
        {isSkeleton ? (
          <div className="flex justify-between mb-6 mt-2">
            <Skeleton circle height={60} width={60} />
            <Skeleton circle height={60} width={60} />
            <Skeleton circle height={60} width={60} />
          </div>
        ) : (
          <IngredientRatingRings
            friesRating={isLoaded ? restaurant.avgFriesRating : 0}
            cheeseRating={isLoaded ? restaurant.avgCheeseRating : 0}
            sauceRating={isLoaded ? restaurant.avgSauceRating : 0}
            noCheese={noCheese}
            noFries={noFries}
            noSauce={noSauce}
          />
        )}
      </div>
      {isSkeleton ? (
        <Skeleton width={120} height={40} className="mb-2" />
      ) : (
        <Button
          height="sm"
          className="mx-auto mt-6 mb-2"
          onClick={() => push(`/restaurants/${restaurant.slug}/noter`)}
        >
          <Edit3 size={20} className="mr-2" />
          Noter leur poutine
        </Button>
      )}
    </div>
  );
};
