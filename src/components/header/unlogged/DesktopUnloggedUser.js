import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useClientPathname } from "@/hooks/useClientPathname";
import { SlipIcon } from "../../../utils/icons";
import { useClientTranslation } from "@/app/i18n/client";
import { setSidebarRight } from "@/store/actions";

export const DesktopUnloggedUser = ({ showBetSlip }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { pathname } = useClientPathname();
  const { t } = useClientTranslation("header");
  const sidebarRight = useSelector((state) => state.sidebarRight);
  const betslipResponse = useSelector((state) => state.betslipResponse);

  const navigateToLogin = () => {
    router.push(`/login?redirect=${pathname.replace("/", "")}`);
  };

  return (
    <div
      className={
        !!betslipResponse?.singles?.length && showBetSlip
          ? "sing-up-txt between-container"
          : "sing-up-txt"
      }
      onClick={() => {
        if (!showBetSlip) {
          navigateToLogin();
        }
      }}
    >
      {!!betslipResponse?.singles?.length && showBetSlip && (
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
          {betslipResponse && betslipResponse?.singles?.length > 0 && (
            <span className="total-slip-bets">
              {betslipResponse?.singles?.length}
            </span>
          )}
        </div>
      )}
      <div className="d-flex" onClick={navigateToLogin}>
        <p className="signText">{t("register_or_login")}</p>
      </div>
    </div>
  );
};
