import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import { RESTAURANT_PRICE_VALUES } from "./constants";

export function useRestaurantPriceOptions() {
  const { t } = useTranslation();
  return useMemo(() => {
    return RESTAURANT_PRICE_VALUES.map((value) => ({
      value,
      label: t(`restaurantPrices.${value}`),
    }));
  }, [t]);
}
