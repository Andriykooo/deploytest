import { stakeLimit, phaseStatus } from "./constants";
import n2words from "n2words";

export const formatOdd = (
  selection,
  format,
  sp,
  currentStatus,
  providerSuspend
) => {
  if (isMatchSuspended(currentStatus) || providerSuspend) {
    return "SUSP";
  }

  if (selection?.trading_status === "suspended") {
    return "SUSP";
  }

  if (sp) {
    return sp;
  }

  if (format === "decimal") {
    return selection?.return || formatDecimal(selection?.odds_decimal) || "-";
  }

  if (format === "fractional") {
    return (
      selection?.odds_fractional ||
      selection?.return ||
      formatDecimal(selection?.odds_decimal) ||
      "-"
    );
  }

  if (format === "american") {
    return selection?.odds_american || "-";
  }

  return (
    selection?.return ||
    formatDecimal(selection?.odds_decimal) ||
    selection?.odds_fractional ||
    selection?.odds_american ||
    "-"
  );
};

export const calcStakeLimit = (value, limit = stakeLimit) => {
  if (value <= limit) return true;
  else return false;
};

export const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const isMatchSuspended = (currentStatus) => {
  switch (currentStatus) {
    case "suspended":
    case phaseStatus.FINISHED:
    case phaseStatus.ABANDONED:
      return true;
    default:
      return false;
  }
};

export const formatDecimal = (decimal) => {
  return decimal !== "SP" ? Number(decimal).toFixed(2).toString() : decimal;
};

export const translateNumberToText = (number, lang) => {
  return n2words(number, { lang: lang });
};
