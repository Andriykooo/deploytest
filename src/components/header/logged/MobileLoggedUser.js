import { useSelector } from "react-redux";
import { ProfileIcon, SlipIcon } from "../../../utils/icons";
import Link from "next/link";
import { Chat } from "@/components/chat/Chat";
import { getLocalStorageItem } from "@/utils/localStorage";
import { useClientTranslation } from "@/app/i18n/client";

export const MobileLoggedUser = ({ showBetSlip }) => {
  const betslipResponse = useSelector((state) => state.betslipResponse);
  const user = useSelector((state) => state.loggedUser);
  const userBalance = user.user_data.balance;
  const userCurrency = user.user_data.currency.abbreviation;
  const { t } = useClientTranslation("header");
  const settings = useSelector((state) => state.settings);
  const chatIsActive =
    getLocalStorageItem("access_token") &&
    settings?.isTraderChatEnabled &&
    user &&
    user?.user_data?.trader_chat_enabled;

  return (
    <div className="sing-up-txt mobileAccInfo">
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex">
          <Link href="/profile">
            <ProfileIcon />
          </Link>
          {!!betslipResponse?.singles?.length && showBetSlip && (
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
              {betslipResponse && betslipResponse?.singles?.length > 0 && (
                <span className="total-slip-bets">
                  {betslipResponse?.singles?.length}
                </span>
              )}
            </div>
          )}
          {chatIsActive && <Chat isMobile={true} />}
        </div>
        <div className="d-flex flex-column justify-content-between balanceAmountContainer">
          <p className="signText balanceText">{t("balance")}</p>
          <div className="d-flex justify-content-end">
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
  );
};
