export const formatAddress = (restaurant, t, options = {}) => {
  if (restaurant.succursales.length > 1) {
    return t("addressCountQuebec", { count: restaurant.succursales.length });
  }
  const placeName = restaurant.succursales[0].address.place_name;
  if (options.short) {
    return placeName.split(", Q")[0];
  }
  return placeName;
};

export const formatCity = (restaurant, t) => {
  return restaurant.succursales.length > 1
    ? t("addressCount", { count: restaurant.succursales.length })
    : restaurant.succursales[0].address.context.find((c) =>
        c.id.includes("place")
      )?.text;
};

export const formatCountry = (restaurant, t) => {
  return restaurant.succursales.length > 1
    ? t("addressCount", { count: restaurant.succursales.length })
    : restaurant.succursales[0].address.context.find((c) =>
        c.id.includes("country")
      )?.text;
};
