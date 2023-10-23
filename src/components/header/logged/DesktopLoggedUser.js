import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ProfileIcon, SlipIcon } from "../../../utils/icons";
import { useClientTranslation } from "@/app/i18n/client";
import { setSidebarRight } from "@/store/actions";

export const DesktopLoggedUser = () => {
  const { t } = useClientTranslation("header");
  const dispatch = useDispatch();
  const router = useRouter();

  const betslipResponse = useSelector((state) => state.betslipResponse);
  const sidebarRight = useSelector((state) => state.sidebarRight);
  const isMobile = useSelector((state) => state.setMobile);

  const user = useSelector((state) => state.loggedUser);
  const userBalance = user.user_data.balance;
  const userCurrency = user.user_data.currency?.abbreviation || "";

  return (
    <div className="sing-up-txt">
      <div className="d-grid user-profile-grid">
        <div className="d-flex user-profile-flex">
          <div className="d-flex align-items-center">
            <ProfileIcon
              onClick={() => {
                router.push("/profile/profile");
              }}
            />
            {(!isMobile || betslipResponse?.singles?.length > 0) && (
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
                {betslipResponse?.singles?.length > 0 && (
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
