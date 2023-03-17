export const filterBlankRatings = (ratings) => {
  return [
    ratings.friesRating,
    ratings.cheeseRating,
    ratings.sauceRating,
    ratings.portionRating,
  ].filter(Boolean);
};
