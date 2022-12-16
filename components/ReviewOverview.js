import RatingPill from "./RatingPill";
import { DataRing } from "./display/DataRing";
import Color from "color";
import { ratingColors } from "data/ratingColors";
import cheese1 from "assets/icons/cheese1.svg";
import fries from "assets/icons/fries.svg";
import sauce from "assets/icons/sauce.svg";
import { useEffect, useState } from "react";
import { round } from "lodash";
import classNames from "classnames";

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
        className={classNames("mx-1", {
          "opacity-40": noFries,
        })}
      >
        <DataRing
          caption="Frites"
          icon={fries}
          iconStyle={{ width: 28 }}
          percent={friesRating * 10}
          unknown={noFries}
        />
        <div className="text-sm text-center font-bold text-gray-400">
          Frites
        </div>
      </div>
      <div
        className={classNames("mx-1", {
          "opacity-40": noCheese,
        })}
      >
        <DataRing
          caption="Fromage"
          icon={cheese1}
          iconStyle={{ width: 25 }}
          percent={cheeseRating * 10}
          unknown={noCheese}
        />
        <div className="text-sm text-center font-bold text-gray-400">
          Fromage
        </div>
      </div>
      <div
        className={classNames("mx-1", {
          "opacity-40": noSauce,
        })}
      >
        <DataRing
          caption="Sauce"
          icon={sauce}
          iconStyle={{ width: 30 }}
          percent={sauceRating * 10}
          unknown={noSauce}
        />
        <div className="text-sm text-center font-bold text-gray-400">Sauce</div>
      </div>
    </div>
  );
};

export const ReviewOverview = ({ restaurant }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const noReviews = restaurant.reviews.length === 0;
  const noFries = !restaurant.avgFriesRating;
  const noCheese = !restaurant.avgCheeseRating;
  const noSauce = !restaurant.avgSauceRating;
  return (
    <div className="select-none">
      <div className="py-1">
        <div className="mb-2">
          <span className="font-bold text-4xl">
            {noReviews ? "?" : round(restaurant.avgRating, 1)}
          </span>
          <span className="text-sm">/10</span>
        </div>
        <div className="flex justify-center mb-2">
          <RatingPill
            isNew
            avgRating={round(restaurant.avgRating, 0)}
            reviewCount={restaurant.reviewCount}
            hideNewRatingInfo
          />
        </div>
        <div className="text-sm">
          {restaurant.reviews.length === 0
            ? "Aucun"
            : restaurant.reviews.length}{" "}
          avis
        </div>
      </div>

      <div className="max-w-[300px] mx-auto mt-4">
        <IngredientRatingRings
          friesRating={isLoaded ? restaurant.avgFriesRating : 0}
          cheeseRating={isLoaded ? restaurant.avgCheeseRating : 0}
          sauceRating={isLoaded ? restaurant.avgSauceRating : 0}
          noCheese={noCheese}
          noFries={noFries}
          noSauce={noSauce}
        />
      </div>
    </div>
  );
};
