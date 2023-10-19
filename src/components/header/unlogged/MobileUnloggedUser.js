import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useClientPathname } from "@/hooks/useClientPathname";
import { SlipIcon } from "../../../utils/icons";
import { useClientTranslation } from "@/app/i18n/client";
import { setSidebarRight } from "@/store/actions";

export const MobileUnloggedUser = ({ showBetSlip }) => {
  const betslipResponse = useSelector((state) => state.betslipResponse);
  const router = useRouter();
  const dispatch = useDispatch();
  const { pathname } = useClientPathname();
  const { t } = useClientTranslation("header");
  const sidebarRight = useSelector((state) => state.sidebarRight);

  const navigateToLogin = () => {
    router.push(`/login?redirect=${pathname.replace("/", "")}`);
  };

  return (
    <div className="sing-up-txt mobileAccInfo unlogged">
      <div className="d-flex align-items-center">
        {!!betslipResponse?.singles?.length && showBetSlip && (
          <div
            className="slip-icon-loggedOut"
            onClick={() => {
              dispatch(
                setSidebarRight({
                  isActive: !sidebarRight.isActive,
                })
              );
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
        <div className="signInContainer" onClick={navigateToLogin}>
          <p className="signText">{t("register_or_login")}</p>
        </div>
      </div>
    </div>
  );
};
