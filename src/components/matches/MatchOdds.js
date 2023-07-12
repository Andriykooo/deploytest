import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectBet } from "../../store/actions";

export const MatchOdds = ({ selection }) => {
  const dispatch = useDispatch();
  const selectedPlayerBets = useSelector((state) => state.selectedBets);

  const isSelected = selectedPlayerBets.bets.some((element) => {
    return element.bet_id === selection?.bet_id;
  });

  let selectionRow = selection;
  let betId = selectionRow?.bet_id;
  const betIsOpen = selectionRow?.trading_status?.toLowerCase() === "open";
  const betIsSuspended = selectionRow?.trading_status?.toLowerCase() === "suspended";

  const handlerOnClick = (e) => {
    if (!betIsOpen) {
      return;
    }
    const bet_id = e.target.dataset.id;
    let tmp = { ...selectedPlayerBets };
    const new_bet = {
      bet_id: bet_id,
      stake: 0,
    };

    let exist = false;
    tmp.bets.forEach((item) => {
      if (item.bet_id === bet_id) {
        tmp.bets = tmp.bets.filter((item) => item.bet_id !== bet_id);
        exist = true;
      }
    });
    if (!exist) tmp.bets.push(new_bet);

    dispatch(setSelectBet(tmp));
  };

  return (
    <div
      className="matchOddsContainer matchOddsContainerFootball"
      key={selectionRow?.bet_id}
    >
      <div
        className={
          isSelected
            ? `matchOdds firstSelection decimalValue valueOddsInBets styleOfSelectedOdd`
            : `matchOdds firstSelection decimalValue valueOddsInBets`
        }
        data-value={selectionRow?.odd ? selectionRow?.odd : 1}
        id={"bet_odds_" + betId}
        data-id={betId}
        onClick={(e) => handlerOnClick(e)}
      >
        {betIsOpen && selectionRow?.odd
          ? selectionRow?.odd
          : betIsSuspended
          ? "S"
          : "-"}
      </div>
      {false && <div className="odds-changed-triangle"></div>}
    </div>
  );
};
