export const removeDuplicatesFromArray = <T>(array: T[]): T[] => {
  const set = new Set(array);
  return [...set];
};

export const arrayHasDuplicates = <T>(array: T[]): boolean => {
  return new Set(array).size !== array.length;
};
