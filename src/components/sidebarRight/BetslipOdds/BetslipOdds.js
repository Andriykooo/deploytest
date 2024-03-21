import { Odds } from "@/components/Odds/Odds";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./BetslipOdds.css";
import { getSelectionOdds } from "@/utils/getSelectionOdds";

export const BetslipOdds = ({ selection, className, children, onClick }) => {
  const priceChanged = useSelector((state) => state.priceIsChanged);
  const updatedBetslipSelections = useSelector(
    (state) => state.updatedBetslipSelections
  );
  const betTicker = useSelector((state) => state.betTicker);
  const odd = updatedBetslipSelections?.[selection?.bet_id];
  const providersSuspended = useSelector((state) => state.providersSuspended);

  const isProviderSuspended = providersSuspended.includes(
    selection?.bet_id.charAt(0)
  );

  const isSuspended =
    odd?.trading_status === "suspended" ||
    selection?.trading_status === "suspended" ||
    isProviderSuspended;

  const [selectionData, setSelectionData] = useState(selection);
  const [priceChangeType, setPriceChangeType] = useState(null);

  useEffect(() => {
    if (odd && betTicker?.status !== "new_offer") {
      setPriceChangeType(odd.priceChangeType);

      if (!selection?.starting_price) setSelectionData(odd);
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

  const selectionsOdds = getSelectionOdds(selectionData);

  return (
    <div
      className={classNames("betslip-odds", className, {
        suspended: isSuspended,
        drifting:
          priceChangeType === "drifting" && !isSuspended && priceChanged,
        shortening:
          priceChangeType === "shortening" && !isSuspended && priceChanged,
      })}
      onClick={() => onClick?.()}
    >
      <Odds
        selection={selectionsOdds}
        sp={selectionData?.starting_price}
        providerSuspended={isProviderSuspended}
      />
      <div
        className={classNames("betslip-odds-inner-content", {
          "price-changes": priceChanged,
        })}
      >
        {children}
      </div>
      {(selectionData?.price_boost || selection?.price_boosted_enabled) && (
        <svg
          width="8"
          height="14"
          viewBox="0 0 8 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="priceBoostIcon active"
        >
          <path
            d="M2.77003 14L3.61941 8.39639H0L5.22997 0L4.38059 5.60361H8L2.77003 14Z"
            fill="neno"
          />
        </svg>
      )}
    </div>
  );
};
