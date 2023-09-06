import { useDispatch, useSelector } from "react-redux";
import {
  addToUpdatedBetslipSelections,
  setSelectBet,
  setUpdatedSelections,
} from "../../store/actions";
import { Odds } from "../Odds/Odds";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { images } from "@/utils/imagesConstant";
import Image from "next/image";

export const MatchOdds = ({ selection, disable }) => {
  const dispatch = useDispatch();
  const selectedPlayerBets = useSelector((state) => state.selectedBets);
  const updatedSelections = useSelector((state) => state.updatedSelections);

  const [selectionRow, setSelectionRow] = useState(selection);
  const [previousSelection, prevoiusSelection] = useState(selection);
  const [priceChangeType, setPriceChangeType] = useState();

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

    const new_bet = {
      bet_id: selection?.bet_id,
      stake: 0,
      trading_status: selection.trading_status,
    };

    if (selection?.odds_decimal === "SP") {
      new_bet.starting_price = true;
    }

    let exist = false;

    tmp.bets = tmp.bets.reduce((accum, item) => {
      if (item.bet_id === bet_id) {
        exist = true;

        if (!!item.starting_price !== (selection.odds_decimal === "SP")) {
          return [...accum, new_bet];
        }

        return accum;
      }

      return [...accum, item];
    }, []);

    if (!exist) tmp.bets.push(new_bet);
    dispatch(setSelectBet(tmp));
  };

  useEffect(() => {
    if (
      selectionRow?.odds_decimal !== "SP" &&
      odd &&
      +odd?.data?.odds_decimal !== +selectionRow.odds_decimal
    ) {
      const type =
        +odd?.data?.odds_decimal > +selectionRow.odds_decimal
          ? "drifting"
          : "shortening";

      setPriceChangeType(type);
      prevoiusSelection(selectionRow);
      setSelectionRow((prev) => {
        const updatedSelection = {
          ...prev,
          odds_decimal: odd?.data?.odds_decimal,
          odds_fractional: odd?.data?.odds_fractional,
          odds_american: odd?.data?.odds_american,
        };

        if (odd?.data?.trading_status) {
          updatedSelection.trading_status = odd?.data?.trading_status;
        }

        return updatedSelection;
      });

      if (
        selectedPlayerBets.bets.find(
          (selectedPlayerBet) => selectedPlayerBet.bet_id === odd.data.bet_id
        )
      ) {
        dispatch(
          addToUpdatedBetslipSelections({ ...odd?.data, priceChangeType: type })
        );
      }
    }
  }, [odd]);

  return (
    <div
      className={classNames("matchOddsContainer matchOddsContainerFootball", {
        ["pe-none"]: disable,
      })}
      key={selectionRow?.bet_id}
    >
      <OverlayTrigger
        placement="bottom"
        show={!priceChangeType ? false : undefined}
        overlay={
          <Tooltip id="tooltip" className="matchOddsTip opacity-100 pe-none">
            <div className="matchOddsTipContent">
              <Odds selection={previousSelection} />
              <Image
                src={images.arrowRight}
                height={8}
                width={10}
                alt="arrow"
              />
              <Odds selection={selectionRow} />
            </div>
          </Tooltip>
        }
      >
        <div
          className={classNames("matchOdds", {
            styleOfSelectedOdd: isSelected,
            suspended: selectionRow?.trading_status === "suspended",
            drifting: priceChangeType === "drifting",
            shortening: priceChangeType === "shortening",
            driftingAnimation:
              odd?.data?.odds_decimal === selectionRow.odds_decimal &&
              priceChangeType === "drifting",
            shorteningAnimation:
              odd?.data?.odds_decimal === selectionRow.odds_decimal &&
              priceChangeType === "shortening",
          })}
          data-value={selectionRow?.odd ? selectionRow?.odd : 1}
          id={"bet_odds_" + selectionRow?.bet_id}
          data-id={selectionRow?.bet_id}
          onClick={handlerOnClick}
          onAnimationEnd={() => {
            dispatch(
              setUpdatedSelections(
                Object.values(updatedSelections).filter((currentSelection) => {
                  return currentSelection.data.bet_id !== selectionRow.bet_id;
                })
              )
            );
          }}
        >
          <Odds selection={selectionRow} />
        </div>
      </OverlayTrigger>
    </div>
  );
};
