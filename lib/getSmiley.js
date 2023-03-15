export const getSmiley = (value) => {
  if (value < 1) {
    return "🤮";
  } else if (value <= 1) {
    return "🤢";
  } else if (value <= 3) {
    return "😠";
  } else if (value <= 4) {
    return "😑";
  } else if (value <= 6) {
    return "😐";
  } else if (value <= 8) {
    return "🙂";
  } else if (value <= 9) {
    return "😊";
  } else {
    return "😍";
  }
};
