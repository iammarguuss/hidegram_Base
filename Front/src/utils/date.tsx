export const formatDateString = (date: string): string => {
  return new Date(date).toLocaleTimeString();
};
