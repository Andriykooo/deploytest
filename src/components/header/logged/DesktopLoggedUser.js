import { useDispatch, useSelector } from "react-redux";
import { ProfileIcon } from "@/icons/ProfileIcon";
import { SlipIcon } from "@/icons/SlipIcon";
import { useTranslations } from "@/hooks/useTranslations";
import { setSidebarRight } from "@/store/actions";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { CustomLink } from "@/components/Link/Link";

export const DesktopLoggedUser = () => {
  const t = useTranslations("header");
  const dispatch = useDispatch();
  const router = useCustomRouter();

  const selectedBets = useSelector((state) => state.selectedBets);
  const sidebarRight = useSelector((state) => state.sidebarRight);

  const user = useSelector((state) => state.loggedUser);
  const userBalance = user?.user_data?.balance;
  const userCurrency = user?.user_data?.currency?.abbreviation || "";

  const redirectToDeposit = () => {
    router.push("/settings/deposit");
  };

  return (
    <div className="sing-up-txt">
      <div className="d-grid user-profile-grid">
        <div className="d-flex user-profile-flex">
          <div className="d-flex align-items-center">
            <CustomLink href="/settings/profile">
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
          </div>
          <div className="d-flex flex-column justify-content-between">
            <p className="signText balanceText">{t("balance")}</p>
            <div className="d-flex" onClick={() => redirectToDeposit()}>
              <p className="signText balanceAmount">
                {formatNumberWithDecimal(userBalance)}
              </p>
              <p className="signText balanceAmount ms-2">{userCurrency}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
