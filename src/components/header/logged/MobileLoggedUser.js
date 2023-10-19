import Image from "next/image";
import { useSelector } from "react-redux";
import { SlipIcon } from "../../../utils/icons";
import { images } from "../../../utils/imagesConstant";
import Link from "next/link";
import { Chat } from "@/components/chat/Chat";

export const MobileLoggedUser = ({ showBetSlip }) => {
  const selectedBets = useSelector((state) => state.selectedBets);
  const user = useSelector((state) => state.loggedUser);
  const userBalance = user.user_data.balance;
  const userCurrency = user.user_data.currency.abbreviation;
  const settings = useSelector((state) => state.settings);
  const chatIsActive =
    settings?.isTraderChatEnabled &&
    user &&
    user?.user_data?.trader_chat_enabled;

  return (
    <div className="sing-up-txt mobileAccInfo">
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex">
          <Link href="/profile">
            <Image
              src={images.profile}
              alt="Profile"
              className="profileImage"
              height={32}
              width={32}
              priority
            />
          </Link>
          {!!selectedBets?.bets?.length && showBetSlip && (
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
          {chatIsActive && <Chat isMobile={true} />}
        </div>
        <div className="d-flex flex-column justify-content-between balanceAmountContainer">
          <p className="signText balanceText">Balance</p>
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
