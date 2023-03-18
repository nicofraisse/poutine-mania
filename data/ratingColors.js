export const ratingColors = [
  "#F2AFAB", //0 - 1
  "#F2AFAB", //1 - 2
  "#F2AFAB", //2 - 3
  "#F2B6AD", //3 - 4
  "#F3BEAE", //4 - 5
  "#F4E3B7", //5 - 6
  "#F5F2BA", //6 - 7
  "#d9f3b6", //7 - 8
  "#cbf3b4", //8 - 9
  "#bcf3b1", //9 - 10
  "#bcf3b1", //+10
];

export const getRatingColor = (decimalValue) => {
  const value = Math.floor(decimalValue);
  return ratingColors[value];
};
