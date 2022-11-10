export const removeDuplicatesFromArray = <T>(array: T[]): T[] => {
  const set = new Set(array);
  return [...set];
};
