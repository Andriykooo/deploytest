import { useDispatch, useSelector } from "react-redux";
import {
  addToUpdatedBetslipSelections,
  setBetSlipResponse,
  setBetTicker,
  setSelectBet,
} from "../../store/actions";
import { Odds } from "../Odds/Odds";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { useClientTranslation } from "@/app/i18n/client";
import { TooltipWrapper } from "../Tooltip/TooltipWrapper";

export const MatchOdds = ({ selection, disable, children }) => {
  const { t } = useClientTranslation("common");
  const dispatch = useDispatch();
  const selectedPlayerBets = useSelector((state) => state.selectedBets);
  const updatedSelections = useSelector((state) => state.updatedSelections);
  const betTicker = useSelector((state) => state.betTicker);

  const [selectionRow, setSelectionRow] = useState(selection);
  const [previousSelection, prevoiusSelection] = useState(selection);
  const [priceChangeType, setPriceChangeType] = useState("");

  const isSuspended = selectionRow?.trading_status === "suspended";

  const betIsOpen =
    selectionRow?.trading_status?.toLowerCase() === "open" ||
    selectionRow?.trading_status?.toLowerCase() === "unnamed_favorite";
  const odd = updatedSelections?.[selectionRow?.bet_id];
  const isSelected = selectedPlayerBets.bets.some((element) => {
    return element.starting_price
      ? selection.odds_decimal === "SP" && element.bet_id === selection?.bet_id
      : selection.odds_decimal !== "SP" && element.bet_id === selection?.bet_id;
  });

  const handlerOnClick = (e) => {
    if (!betIsOpen) {
      return;
    }

    const bet_id = e.target.dataset.id;
    let tmp = { ...selectedPlayerBets };

    if (betTicker?.status) {
      dispatch(
        setBetTicker({
          status: "",
          bet_referral_id: "",
        })
      );
    }

    if (betTicker?.data?.mode === "pending") {
      tmp = { bets: [], stakes: [], action: "check" };
    }

    const new_bet = {
      bet_id: selection?.bet_id,
      stake: 0,
      trading_status: selection.trading_status,
    };

    if (selection?.event_id) {
      new_bet.event_id = selection?.event_id;
    }

    if (selection?.odds_decimal === "SP") {
      new_bet.starting_price = true;
    }

    let exist = false;

    tmp.bets = tmp.bets.reduce((accum, item) => {
      if (item.bet_id == bet_id) {
        exist = true;

        if (!!item.starting_price !== (selection.odds_decimal === "SP")) {
          return [...accum, new_bet];
        }

        return accum;
      }

      return [...accum, item];
    }, []);

    if (!exist) {
      tmp.bets.push(new_bet);
    }

    if (tmp.bets.length === 0) {
      dispatch(
        setBetTicker({
          status: "",
          bet_referral_id: "",
        })
      );
      dispatch(
        setBetSlipResponse({
          singles: [],
          combinations: [],
          total_stakes: 0,
          total_payout: 0,
        })
      );
    }

    dispatch(setSelectBet(tmp));
  };

  useEffect(() => {
    if (selectionRow?.odds_decimal !== "SP" && odd) {
      const isBetslipOdd = selectedPlayerBets.bets.some(
        (selectedPlayerBet) => selectedPlayerBet.bet_id === odd.data.bet_id
      );

      const type =
        +odd?.data?.odds_decimal > +selectionRow.odds_decimal
          ? "drifting"
          : "shortening";

      setPriceChangeType(type);
      prevoiusSelection(selectionRow);
      setSelectionRow((prev) => {
        return {
          ...prev,
          ...odd?.data,
        };
      });

      if (isBetslipOdd) {
        dispatch(
          addToUpdatedBetslipSelections({ ...odd?.data, priceChangeType: type })
        );
      }
    }
  }, [odd]);

  const priceBoost = {
    ...selectionRow,
    odds_american: selection?.price_boost_odds?.american,
    odds_decimal: selection?.price_boost_odds?.decimal,
    odds_fractional: selection?.price_boost_odds?.fractional,
  };

  return (
    <div
      className={classNames("matchOddsContainer matchOddsContainerFootball", {
        ["pe-none"]: disable,
      })}
      key={selectionRow?.bet_id}
    >
      <TooltipWrapper
        show={priceChangeType && !isSuspended}
        message={
          <div className="matchOddsTipContent">
            <Odds selection={previousSelection} />
            <Image
              src={images.arrowRight}
              height={8}
              width={10}
              alt={t("arrow")}
            />
            <Odds selection={selectionRow} />
          </div>
        }
      >
        <div
          className={classNames("matchOdds", {
            selectionPriceBoost: selection?.price_boost && !isSuspended,
            styleOfSelectedOdd: isSelected && !isSuspended,
            suspended: isSuspended,
            drifting: priceChangeType === "drifting" && !isSuspended,
            shortening: priceChangeType === "shortening" && !isSuspended,
            driftingAnimation:
              odd?.data?.odds_decimal === selectionRow.odds_decimal &&
              priceChangeType === "drifting" &&
              !isSuspended,
            shorteningAnimation:
              odd?.data?.odds_decimal === selectionRow.odds_decimal &&
              priceChangeType === "shortening" &&
              !isSuspended,
          })}
          data-value={selectionRow?.odd ? selectionRow?.odd : 1}
          id={"bet_odds_" + selectionRow?.bet_id}
          data-id={selectionRow?.bet_id}
          onClick={handlerOnClick}
        >
          {children}
          <Odds
            selection={selection?.price_boost ? priceBoost : selectionRow}
          />
          {selection?.price_boost &&
            selectionRow?.trading_status !== "suspended" && (
              <svg
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={classNames("priceBoostIcon", { active: isSelected })}
              >
                <path
                  d="M2.77003 14L3.61941 8.39639H0L5.22997 0L4.38059 5.60361H8L2.77003 14Z"
                  fill="neno"
                />
              </svg>
            )}
        </div>
      </TooltipWrapper>
    </div>
  );
};
