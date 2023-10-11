import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ProfileIcon, SlipIcon } from "../../../utils/icons";
import { useClientTranslation } from "@/app/i18n/client";

export const DesktopLoggedUser = ({ showBetSlip }) => {
  const router = useRouter();
  const betslipResponse = useSelector((state) => state.betslipResponse);
  const user = useSelector((state) => state.loggedUser);
  const userBalance = user.user_data.balance;
  const userCurrency = user.user_data.currency?.abbreviation || "";
  const { t } = useClientTranslation("header");

  return (
    <div className="sing-up-txt">
      <div className="d-grid user-profile-grid">
        <div className="d-flex user-profile-flex">
          <div className="d-flex align-items-center">
            <ProfileIcon
              onClick={() => {
                router.push("/profile/bonuses_promotions");
              }}
            />
            {showBetSlip && (
              <div
                className="slip-icon"
                onClick={() => {
                  if (document.documentElement.clientWidth < 1400) {
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
                  }
                }}
              >
                <SlipIcon />
                {betslipResponse && betslipResponse?.singles?.length > 0 && (
                  <span className="total-slip-bets">
                    {betslipResponse?.singles?.length}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="d-flex flex-column justify-content-between">
            <p className="signText balanceText">{t("balance")}</p>
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
