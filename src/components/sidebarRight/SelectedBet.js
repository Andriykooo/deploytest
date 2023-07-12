import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBet,
  removeBetAmount,
  removeReturnValue,
  setSelectBet,
} from "../../store/actions";
import { XIcon } from "../../utils/icons";

export const SelectedBet = ({ bet, row }) => {
  const [input, setnput] = useState("");
  const dispatch = useDispatch();
  const userSelectedBets = useSelector((state) => state.selectedBets);

  const handlerSetSingleStake = (e) => {
    const stake = e.target.value;
    const bet_id = e.target.dataset.id;
    let tmp = { ...userSelectedBets };
    tmp.bets.forEach((element) => {
      if (element.bet_id === bet_id) {
        element.stake = stake;
      }
    });
    tmp.action = "check";
    dispatch(setSelectBet(tmp));
  };

  const hanldeChangeInput = (e) => {
    setnput(e.target.value);
    handlerSetSingleStake(e);
  };

  const bet_id = row?.bet_provider + "-" + row?.bet_id;
  const returnTextColor = !row?.bet_allowed ? "red" : "white";
  return (
    <div className="selected-bet-container" key={bet?.selection_id}>
      <div className="selected-bet-title">
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            dispatch(removeBet(row));
            dispatch(removeBetAmount(row?.bet_id));
            dispatch(removeReturnValue(row?.bet_id));
          }}
        >
          <XIcon />
        </span>
        <span className="selected-market-selection"> {row?.name || ""}</span>
      </div>
      <div className="selected-bet-body">
        {/* Bet description */}
        <span className="selected-market"> {row?.description || ""}</span>
        {/* Bet Match Name */}
        <span className="selected-match"> {row?.match_name || ""}</span>
        <div className="bet-amount-container">
          <input
            placeholder="0.00"
            type="number"
            value={input}
            className="slip-input"
            data-id={bet_id}
            id={"input_stake_" + bet_id}
            onChange={hanldeChangeInput}
          />
          <div className="selected-bet-odds">{row.return || "1.00"}</div>
        </div>
        <div className="slip-amount">
          <span></span>
          <span
            className="styleOfReturnValues styleOfReturnedValuesInline"
            style={{ color: returnTextColor }}
          >
            Returns: {row.payout || "0.00"}
          </span>
        </div>
      </div>
    </div>
  );
};
