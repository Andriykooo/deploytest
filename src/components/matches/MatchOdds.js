import React from "react";
import { useDispatch } from "react-redux";
import { selectBet } from "../../store/actions";

export const MatchOdds = ({ selection, match, activeClass, id }) => {
  const dispatch = useDispatch();
  let selectionRow = selection;
  let betId = selectionRow?.bet_id;
  let backgroundColor = false;

  const handleSelectBet = (element) => {
    if (element) {
      if (element.classList.contains("styleOfSelectedOdd")) {
        element.classList.remove("styleOfSelectedOdd");
      } else {
        element.classList.add("styleOfSelectedOdd");
      }
    }
  };

  return (
    <div
      className="matchOddsContainer matchOddsContainerFootball"
      key={selectionRow?.selection_id}
    >
      <div
        className={
          id !== 15 && backgroundColor
            ? `matchOdds firstSelection decimalValue valueOfBets valueOddsInBets ${activeClass} styleOfSelectedOdd`
            : id !== 15
            ? `matchOdds firstSelection decimalValue valueOfBets valueOddsInBets ${activeClass} `
            : id === 15 && backgroundColor
            ? `matchOdds firstSelection decimalValue valueOfBets  valueOddsInBets ${activeClass} styleOfSelectedOdd`
            : ""
        }
        data-value={
          selectionRow?.odds_decimal
            ? selectionRow?.odds_decimal.toFixed(2)
            : ""
        }
        id={"bet_odds_" + betId}
        onClick={(e) => {
          handleSelectBet(e.target);
          let payload = {
            selection: selection,
            match_name: match?.match_name,
            match_id: match?.match_id,
            selection_id: selection?.selection_id,
            bet_id: selection?.bet_id,
          };
          dispatch(selectBet(payload));
        }}
      >
        {selectionRow?.odds_decimal
          ? selectionRow?.odds_decimal.toFixed(2)
          : ""}
      </div>
      {false && <div className="odds-changed-triangle"></div>}
    </div>
  );
};
