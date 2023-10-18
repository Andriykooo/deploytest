import { Odds } from "@/components/Odds/Odds";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const BetslipOdds = ({ selection, className, children }) => {
  const priseChanged = useSelector((state) => state.priceIsChanged);
  const updatedBetslipSelections = useSelector(
    (state) => state.updatedBetslipSelections
  );
  const betTicker = useSelector((state) => state.betTicker);

  const odd =
    updatedBetslipSelections?.[
      `${selection?.bet_provider}-${selection?.bet_id}`
    ];

  const isSuspended =
    odd?.trading_status === "suspended" ||
    selection.trading_status === "suspended";

  const [selectionData, setSelectionData] = useState(selection);
  const [priceChangeType, setPriceChangeType] = useState(null);

  useEffect(() => {
    if (odd && betTicker?.status !== "new_offer") {
      setPriceChangeType(odd.priceChangeType);
      setSelectionData(odd);
    }
  }, [odd]);

  useEffect(() => {
    if (selection) {
      setSelectionData(selection);
    }
  }, [selection]);

  useEffect(() => {
    if (
      Object.values(updatedBetslipSelections).length === 0 &&
      priceChangeType
    ) {
      setPriceChangeType(null);
    }
  }, [updatedBetslipSelections]);

  const priceBoost = {
    ...selectionData,
    odds_fractional: selectionData?.price_boost_odds?.fractional,
    odds_decimal: selectionData?.price_boost_odds?.decimal,
  };

  return (
    <div
      className={classNames("betslip-odds", className, {
        suspended: isSuspended,
        drifting:
          priceChangeType === "drifting" && !isSuspended && priseChanged,
        shortening:
          priceChangeType === "shortening" && !isSuspended && priseChanged,
      })}
    >
      <Odds
        selection={
          selectionData?.price_boost ? priceBoost : selectionData
        }
      />
      <div
        className={classNames("betslip-odds-inner-content", {
          "price-changes": priseChanged,
        })}
      >
        {children}
      </div>
    </div>
  );
};
