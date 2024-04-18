import { useDispatch, useSelector } from "react-redux";
import { ProfileIcon } from "@/icons/ProfileIcon";
import { SlipIcon } from "@/icons/SlipIcon";
import { Chat } from "@/components/chat/Chat";
import { getLocalStorageItem } from "@/utils/localStorage";
import { useTranslations } from "@/hooks/useTranslations";
import { setSidebarRight } from "@/store/actions";
import { CustomLink } from "@/components/Link/Link";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { useCustomRouter } from "@/hooks/useCustomRouter";

export const MobileLoggedUser = () => {
  const dispatch = useDispatch();
  const selectedBets = useSelector((state) => state.selectedBets);
  const user = useSelector((state) => state.loggedUser);
  const sidebarRight = useSelector((state) => state.sidebarRight);
  const userBalance = user?.user_data?.balance;
  const userCurrency = user?.user_data?.currency?.abbreviation;
  const t = useTranslations("header");
  const settings = useSelector((state) => state.settings);
  const router = useCustomRouter();

  const chatIsActive =
    user && getLocalStorageItem("access_token")
      ? settings?.is_trader_chat_enabled && user?.user_data?.trader_chat_enabled
      : settings?.is_trader_chat_enabled;

  const redirectToDeposit = () => {
    router.push("/settings/deposit");
  };

  return (
    <div className="sing-up-txt mobileAccInfo">
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex">
          <CustomLink href="/settings">
            <ProfileIcon />
          </CustomLink>
          <div
            className="slip-icon"
            onClick={() => {
              dispatch(
                setSidebarRight({
                  isActive: !sidebarRight.isActive,
                })
              );
            }}
          >
            <SlipIcon />
            {selectedBets?.singles?.length > 0 && (
              <span className="total-slip-bets">
                {selectedBets?.singles?.length}
              </span>
            )}
          </div>
          {chatIsActive && <Chat isMobile={true} />}
        </div>
        <div className="d-flex flex-column justify-content-between balanceAmountContainer">
          <p className="signText balanceText">{t("balance")}</p>
          <div
            className="d-flex justify-content-end"
            onClick={() => redirectToDeposit()}
          >
            <p className="signText balanceAmount">
              {formatNumberWithDecimal(userBalance)}
            </p>
            <p className="signText balanceAmount ms-2">{userCurrency}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
