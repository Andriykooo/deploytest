import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { SlipIcon } from "../../../utils/icons";
import { images } from "../../../utils/imagesConstant";

export const DesktopLoggedUser = ({ showBetSlip }) => {
  const selectedBets = useSelector((state) => state.selectedBets);
  let userBalance = localStorage.getItem("userBalance");
  let userCurrency = localStorage.getItem("userCurrency");
  const router = useRouter();

  return (
    <div className="sing-up-txt">
      <div className="d-grid user-profile-grid">
        <div className="d-flex user-profile-flex">
          <div className="d-flex align-items-center">
            <Image
              src={images.profile}
              alt="Profile"
              className="pe-3 profileImage"
              onClick={() => {
                router.push("/profile");
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
                {selectedBets && selectedBets.length > 0 && (
                  <span className="total-slip-bets">{selectedBets.length}</span>
                )}
              </div>
            )}
          </div>
          <div className="d-grid">
            <p className="signText balanceText">Balance</p>
            <div className="d-flex">
              <p className="signText balanceAmount">
                {userBalance
                  ? parseFloat(userBalance)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : "0.00"}
              </p>
              <p className="signText balanceAmount ms-2">
                {userCurrency ? userCurrency : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
