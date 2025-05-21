import React from "react";
import { round } from "lodash";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 py-2 justify-center xs:justify-start">
      <Pill name={t("ingredient.fries")} value={avgFriesRating} />
      <Pill name={t("ingredient.cheese")} value={avgCheeseRating} />
      <Pill name={t("ingredient.sauce")} value={avgSauceRating} />
    </div>
  );
};
