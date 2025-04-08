export const formatRating = (rating) => {
  if (
    rating === null ||
    rating === undefined ||
    isNaN(rating) ||
    typeof rating !== "number"
  ) {
    return "?";
  }

  return rating.toFixed(1);
};
