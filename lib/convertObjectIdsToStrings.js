const convertObjectIdsToStrings = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertObjectIdsToStrings);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (
        key === "_id" &&
        typeof value === "object" &&
        value !== null &&
        value.toHexString
      ) {
        acc[key] = value.toHexString();
      } else {
        acc[key] = convertObjectIdsToStrings(value);
      }
      return acc;
    }, {});
  } else {
    return obj;
  }
};

export default convertObjectIdsToStrings;
