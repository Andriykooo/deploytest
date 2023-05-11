import React from "react";
import { useSelector } from "react-redux";
import { SlipIcon } from "../../../utils/icons";
import { images } from "../../../utils/imagesConstant";

export const MobileLoggedUser = ({
  setSwiftyProfile,
  swiftyProfile,
  showBetSlip,
}) => {
  const selectedBets = useSelector((state) => state.selectedBets);
  let userBalance = localStorage.getItem("userBalance");
  let userCurrency = localStorage.getItem("userCurrency");

  return (
    <div className="d-flex align-items-center">
      <img
        src={images.profile}
        alt="Profile"
        className="pe-3 profileImage"
        onClick={() => {
          setSwiftyProfile(!swiftyProfile);
        }}
      />
      {showBetSlip && (
        <div
          className="slip-icon"
          onClick={() => {
            if (document.querySelector(".bet-slip-container")) {
              let actualDisplay = document.querySelector(".bet-slip-container")
                .style.display;
              if (actualDisplay === "block") {
                document.querySelector(".bet-slip-container").style.display =
                  "none";
              } else {
                document.querySelector(".bet-slip-container").style.display =
                  "block";
              }
            }
          }}
        >
          <SlipIcon />
          {selectedBets && selectedBets.length > 0 && (
            <span className="total-slip-bets">{selectedBets.length}</span>
          )}
        </div>
      )}
      <div className="d-grid">
        <p className="signText balanceText">Balance</p>
        <div className="d-flex">
          <p className="signText balanceAmount ">
            {userCurrency ? userCurrency : ""}&nbsp;&nbsp;
          </p>
          <p className="signText balanceAmount">
            {userBalance
              ? parseFloat(userBalance)
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
};
