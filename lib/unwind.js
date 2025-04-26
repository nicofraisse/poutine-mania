export const unwind = (path) => ({
  $unwind: { path, preserveNullAndEmptyArrays: false },
});
