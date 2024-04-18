import { useDispatch, useSelector } from "react-redux";
import {
  setPriceIsChanged,
  setUpdatedBetslipSelections,
} from "../../store/actions";
import { Odds } from "../Odds/Odds";
import classNames from "classnames";
import { memo } from "react";
import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";
import { TooltipWrapper } from "../Tooltip/TooltipWrapper";
import { useGenerateBetslip } from "@/hooks/useGenerateBetslip";
import { getSelectionOdds } from "@/utils/getSelectionOdds";
import { isMatchSuspended } from "@/utils/global";

const Selection = memo(function SelectionContent({
  selection,
  disable,
  children,
  onUpdate,
  currentStatus,
  ignoreSP,
}) {
  const t = useTranslations("common");
  const dispatch = useDispatch();
  const selectedPlayerBets = useSelector((state) => state.selectedBets);
  const providersSuspended = useSelector((state) => state.providersSuspended);

  const selectedBet = selectedPlayerBets?.singles?.find(
    (element) => element.bet_id === selection?.bet_id
  );
  const isProviderSuspended = providersSuspended.includes(
    selection?.bet_id.charAt(0)
  );

  const isSuspended =
    selection?.trading_status === "suspended" || isProviderSuspended;

  const isSP = selection?.odds_decimal === "SP";

  const isSelected = ignoreSP
    ? selectedBet?.bet_id === selection?.bet_id
    : selectedBet?.starting_price
    ? isSP && selectedBet?.bet_id === selection?.bet_id
    : !isSP && selectedBet?.bet_id === selection?.bet_id;

  const betIsOpen =
    selection?.trading_status?.toLowerCase() === "open" ||
    selection?.trading_status?.toLowerCase() === "unnamed_favorite";

  const generateBetslip = useGenerateBetslip();

  const handlerOnClick = () => {
    if (!betIsOpen) {
      return;
    }

    let tmp = { ...selectedPlayerBets };

    const new_bet = {
      stake: 0,
      ...selection,
    };

    if (selection?.event_id) {
      new_bet.event_id = selection?.event_id;
    }

    if (isSP) {
      new_bet.starting_price = isSP;
    }

    const filteredSingles = tmp?.singles.filter(
      (single) => single.bet_id !== new_bet.bet_id
    );

    if (filteredSingles.length >= tmp?.singles.length) {
      tmp?.singles?.push(new_bet);
    } else {
      tmp.singles = filteredSingles;
    }

    generateBetslip(tmp);
    dispatch(setPriceIsChanged(false));
    dispatch(setUpdatedBetslipSelections({}));
  };

  const selectionsOdds = getSelectionOdds(selection);
  const priceChangeType =
    +selection?.previousOdds?.odds_decimal < +selectionsOdds?.odds_decimal
      ? "drifting"
      : "shortening";

  return (
    <div
      className={classNames("matchOddsContainer matchOddsContainerFootball", {
        ["pe-none"]: disable,
      })}
    >
      <TooltipWrapper
        show={selection?.previousOdds?.odds_decimal && !isSuspended}
        message={
          <div className="matchOddsTipContent">
            <Odds selection={selection?.previousOdds} />
            <Image
              src={images.arrowRight}
              height={8}
              width={10}
              alt={t("arrow")}
            />
            <Odds selection={selectionsOdds} />
          </div>
        }
      >
        <div
          className={classNames(
            "matchOdds",
            isSuspended ? "animationBlock-susp" : "animationBlock-success",
            {
              selectionPriceBoost:
                selection?.price_boost && !isSuspended && !isSP,
              styleOfSelectedOdd: isSelected && !isSuspended,
              suspended:
                isSuspended || disable || isMatchSuspended(currentStatus),
              [priceChangeType]:
                selection?.previousOdds?.odds_decimal && !isSuspended,
            }
          )}
          onClick={handlerOnClick}
        >
          <div
            className="animationBlock"
            id={selection?.bet_id}
            data-current-odds={selectionsOdds.odds_decimal}
            onAnimationStart={() => {
              onUpdate?.();
            }}
          >
            {children}
            <Odds
              selection={{ ...selection, ...selectionsOdds }}
              currentStatus={currentStatus}
              providerSuspended={isProviderSuspended}
            />
            {!isSP && selection?.price_boost && !isSuspended && (
              <svg
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={classNames("priceBoostIcon", {
                  active: isSelected,
                })}
              >
                <path
                  d="M2.77003 14L3.61941 8.39639H0L5.22997 0L4.38059 5.60361H8L2.77003 14Z"
                  fill="neno"
                />
              </svg>
            )}
          </div>
        </div>
      </TooltipWrapper>
    </div>
  );
});

export const MatchOdds = (props) => {
  const selections = useSelector((state) => state.selections);

  const selection = selections[props.selection?.bet_id];

  return (
    <Selection
      {...props}
      selection={
        selection && !props?.disableUpdate
          ? { ...props.selection, ...selection }
          : props.selection
      }
    />
  );
};
