export const formatOdd = (selection, format) => {
  if (selection?.trading_status === "suspended") {
    return "SUSP";
  }

  if (format === "decimal") {
    return selection.odds_decimal || "-";
  }

  if (format === "fractional") {
    return selection.odds_fractional || "-";
  }

  if (format === "american") {
    return selection.odds_american || "-";
  }

  return (
    selection?.odds_decimal ||
    selection?.odds_fractional ||
    selection?.odds_american ||
    "-"
  );
};
