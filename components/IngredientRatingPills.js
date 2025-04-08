import React from "react";
import { round } from "lodash";

const Pill = ({ name, value }) => {
  return (
    <div className="py-1 px-2 bg-orange-50 text-amber-800 rounded text-xs">
      <span>{name}</span>: <span className="font-bold">{round(value, 1)}</span>
    </div>
  );
};

export const IngredientRatingPills = ({
  avgFriesRating,
  avgCheeseRating,
  avgSauceRating,
}) => {
  return (
    <div className="flex flex-wrap gap-2 py-2 justify-center xs:justify-start">
      <Pill name="Frites" value={avgFriesRating} />
      <Pill name="Fromage" value={avgCheeseRating} />
      <Pill name="Sauce" value={avgSauceRating} />
    </div>
  );
};
