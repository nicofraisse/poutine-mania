export const getUrlQueryString = (keyValuesPairs) => {
  let result = "";
  for (const key in keyValuesPairs) {
    if (keyValuesPairs[key] || keyValuesPairs[key] === 0) {
      result += `&${key.replaceAll(" ", "_")}=${keyValuesPairs[key]}`;
    }
  }

  if (result) result = result.replace("&", "?");

  return result;
};
