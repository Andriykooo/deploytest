import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useClientPathname } from "@/hooks/useClientPathname";
import { SlipIcon } from "../../../utils/icons";
import { useClientTranslation } from "@/app/i18n/client";

export const MobileUnloggedUser = ({ showBetSlip }) => {
  const betslipResponse = useSelector((state) => state.betslipResponse);
  const router = useRouter();
  const { pathname } = useClientPathname();
  const { t } = useClientTranslation("header")

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
        <div className="signInContainer" onClick={navigateToLogin}>
          <p className="signText">{t("register_or_login")}</p>
        </div>
      </div>
    </div>
  );
};
