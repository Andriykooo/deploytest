import { useSelector } from "react-redux";
import { SlipIcon } from "../../../utils/icons";
import { images } from "../../../utils/imagesConstant";
import Image from "next/image";

export const MobileLoggedUser = ({
  setSwiftyProfile,
  swiftyProfile,
  showBetSlip,
}) => {
  const selectedBets = useSelector((state) => state.selectedBets);
  const user = useSelector((state) => state.loggedUser);

  const userBalance = user.user_data.balance;
  const userCurrency = user.user_data.currency.abbreviation;

  return (
    <div className="col-3 sing-up-txt mobileAccInfo">
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex">
          <Image
            src={images.profile}
            alt="Profile"
            className="profileImage"
            onClick={() => {
              setSwiftyProfile(!swiftyProfile);
            }}
          />
          {showBetSlip && (
            <div
              className="slip-icon"
              onClick={() => {
                if (document.querySelector(".bet-slip-container")) {
                  let actualDisplay = document.querySelector(
                    ".bet-slip-container"
                  ).style.display;
                  if (actualDisplay === "block") {
                    document.querySelector(
                      ".bet-slip-container"
                    ).style.display = "none";
                  } else {
                    document.querySelector(
                      ".bet-slip-container"
                    ).style.display = "block";
                  }
                }
              }}
            >
              <SlipIcon />
              {selectedBets && selectedBets?.bets?.length > 0 && (
                <span className="total-slip-bets">
                  {selectedBets?.bets?.length}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="d-flex flex-column justify-content-between">
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
    </div>
  );
};
