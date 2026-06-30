export const DateTHFormat = (date) => {
  return new Date(date).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
export const TimeTHFormat = (date) => {
  return new Date(date).toLocaleTimeString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
