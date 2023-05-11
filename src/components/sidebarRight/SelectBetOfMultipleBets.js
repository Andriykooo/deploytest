import React from "react";
import { InfoInformationIcon } from "../../utils/icons";

export const SelectOfMultipleBets = ({ bet }) => {
  return (
    <div
      className="selected-bet-container containerOfMultiBets"
      key={bet?.selection_id}
    >
      <div className="selected-bet-title selectMultipleBets">
        <div className="ContainerOfMultipleBets">
          <InfoInformationIcon />
          <span className="selected-market-selection">{bet?.nameOfBet}</span>
          &nbsp;
          <span>{bet?.odd}</span>
        </div>
        <div className="selected-bet-body ps-2 pe-1 ">
          <div className="bet-amount-container betAmountMultiBets">
            <input type={"number"} placeholder="0.00" className="slip-input" />
            <div className="selected-bet-odds">
              {bet?.oddsAmount ? bet?.oddsAmount : ""}
            </div>
          </div>
          <div className="slip-amount">
            <span></span>
            <span className="styleOfReturnValues">Returns: 0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
