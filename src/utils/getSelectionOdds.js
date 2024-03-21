export const getSelectionOdds = (selection) => {
  const odds = {
    odds_decimal: selection?.odds_decimal,
    odds_fractional: selection?.odds_fractional,
  };

  if (selection?.price_boost) {
    odds.odds_decimal = selection.price_boost_odds?.decimal;
    odds.odds_fractional = selection.price_boost_odds?.fractional;
  }

  return odds;
};
