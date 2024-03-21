export const formatNumberWithDecimal = (value) => {
  return isNaN(+value)
    ? value
    : (+value)?.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
};
