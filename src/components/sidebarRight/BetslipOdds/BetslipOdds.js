import { Odds } from "@/components/Odds/Odds";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const BetslipOdds = ({ selection, className, children }) => {
  const priseChanged = useSelector((state) => state.priceIsChanged);
  const updatedBetslipSelections = useSelector(
    (state) => state.updatedBetslipSelections
  );

  const odd =
    updatedBetslipSelections?.[
      `${selection?.bet_provider}-${selection?.bet_id}`
    ];

  const isSuspended =
    odd?.trading_status === "suspended" ||
    selection.trading_status === "suspended";

  const [previousSelection, setPreviousSelection] = useState(selection);
  const [priceChangeType, setPriceChangeType] = useState(null);

  useEffect(() => {
    if (odd) {
      setPriceChangeType(odd.priceChangeType);
      setPreviousSelection(odd);
    }
  }, [odd]);

  useEffect(() => {
    if (selection) {
      setPreviousSelection(selection);
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
      <Odds selection={odd || previousSelection} />
      {!odd && children}
    </div>
  );
};
