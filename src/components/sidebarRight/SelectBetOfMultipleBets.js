import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectBet } from "../../store/actions";
import { InfoInformationIcon } from "../../utils/icons";

export const SelectOfMultipleBets = ({ row }) => {
  const dispatch = useDispatch();
  const userSelectedBets = useSelector((state) => state.selectedBets);
  const [input, setInput] = useState("");

  const handleChnageInput = (e, rowType) => {
    setInput(e.target.value);
    handlerSetMultipleStake(e.target.value, rowType);
  };

  const handlerSetMultipleStake = (stake, type) => {
    let tmp = { ...userSelectedBets };

    const types = Object.keys(tmp.stakes);
    let ifExist = false;
    types.forEach((element) => {
      if (element === type) {
        ifExist = true;
        tmp.stakes[element] = stake;
      }
    });
    if (!ifExist) {
      tmp.stakes[type] = stake;
    }
    dispatch(setSelectBet(tmp));
  };

  const payoutAmountFormatted = row?.payout ? row?.payout.toFixed(2) : "0.00";
  const returnAmountFormatted = row?.return ? row?.return.toFixed(2) : "1.00";
  const returnTextColor = !row?.bet_allowed ? "red" : "white";
  return (
    <div
      className="selected-bet-container containerOfMultiBets"
      key={row?.type}
    >
      <div className="selected-bet-title selectMultipleBets">
        <div className="ContainerOfMultipleBets">
          <InfoInformationIcon />
          <span className="selected-market-selection"></span>
          &nbsp;
          <span>{row?.name || ""}</span>
        </div>

        <div className="selected-bet-body ps-2 pe-1 ">
          <div className="bet-amount-container betAmountMultiBets">
            <input
              placeholder="0.00"
              type="number"
              className="slip-input inputOfMultiBets"
              value={input}
              onChange={(e) => {
                handleChnageInput(e, row.type);
              }}
            />
            <div className="selected-bet-odds">{returnAmountFormatted}</div>
          </div>
          <div className="slip-amount">
            <span
              className="styleOfReturnValues"
              style={{ color: returnTextColor }}
            >
              Returns : {payoutAmountFormatted}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
