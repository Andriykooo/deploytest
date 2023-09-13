export const formatNumberWithDecimal = (value) => {
  return Number(value)?.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};