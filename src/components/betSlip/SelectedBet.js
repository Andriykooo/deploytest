import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBet,
  removeBetAmount,
  removeReturnValue,
  setBetAmount,
  setReturnValue,
} from "../../store/actions";
import { XIcon } from "../../utils/icons";

export const SelectedBet = ({ bet }) => {
  const betAmounts = useSelector((state) => state.betAmounts);
  const [selectedValue, setSelectedValue] = useState("");
  const [returnOfBet, setReturnOfBet] = useState("");
  const dispatch = useDispatch();

  const handleBetAmount = (value) => {
    let returnValue = Number(value) * bet?.selection?.odds_decimal;
    setSelectedValue(Number(value));
    setReturnOfBet(returnValue.toFixed(2));
    let payload = {
      bet_id: bet?.bet_id,
      amount: Number(value),
    };
    dispatch(setBetAmount(payload));
    if (value) {
      let payload = {
        bet_id: bet?.bet_id,
        amount: Number(returnValue),
      };
      dispatch(setReturnValue(payload));
    }
  };

  useEffect(() => {
    if (betAmounts && betAmounts.length > 0) {
      let selectedBet = betAmounts.filter((row) => row.bet_id === bet?.bet_id);
      if (selectedBet && selectedBet.length > 0) {
        setSelectedValue(selectedBet[0]?.amount);
        let betReturn = selectedBet[0]?.amount * bet?.selection?.odds_decimal;
        betReturn = betReturn.toFixed(2);
        setReturnOfBet(betReturn);
      }
    }
  }, [betAmounts]);

  return (
    <div className="selected-bet-container" key={bet?.selection_id}>
      <div className="selected-bet-title">
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            dispatch(removeBet(bet));
            dispatch(removeBetAmount(bet?.bet_id));
            dispatch(removeReturnValue(bet?.bet_id));
          }}
        >
          <XIcon />
        </span>
        <span className="selected-market-selection">
          {bet?.match_name.split(" v ")[0]}
        </span>
      </div>
      <div className="selected-bet-body">
        <span className="selected-market">{bet?.selection?.market_name}</span>
        <span className="selected-match">{bet?.match_name}</span>
        <div className="bet-amount-container">
          <input
            type={"number"}
            value={selectedValue ? selectedValue : ""}
            className="slip-input"
            onKeyUp={(e) => {
              handleBetAmount(e.target.value, "input");
            }}
            onChange={(e) => setSelectedValue(e.target.value)}
          />
          <div className="selected-bet-odds">
            {bet?.selection?.odds_decimal
              ? bet?.selection?.odds_decimal.toFixed(2)
              : ""}
          </div>
        </div>
        <div className="slip-amount">
          <span></span>
          <span className="styleOfReturnValues styleOfReturnedValuesInline">
            Returns: {returnOfBet > 0 ? returnOfBet : "0.00"}
          </span>
        </div>
      </div>
    </div>
  );
};
