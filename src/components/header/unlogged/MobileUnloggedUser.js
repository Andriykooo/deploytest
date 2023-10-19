import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { SlipIcon } from "../../../utils/icons";

export const MobileUnloggedUser = ({ showBetSlip }) => {
  const selectedBets = useSelector((state) => state.selectedBets);
  const router = useRouter();
  const pathname = usePathname();

  const navigateToLogin = () => {
    router.push(`/login?redirect=${pathname.replace('/', '')}`);
  }

  return (
    <div className="sing-up-txt mobileAccInfo unlogged">
      <div className="d-flex align-items-center">
        {!!selectedBets?.bets?.length && showBetSlip && (
          <div
            className="slip-icon-loggedOut"
            onClick={() => {
              if (document.documentElement.clientWidth < 1400) {
                if (document.querySelector(".bet-slip-container")) {
                  let actualDisplay = document.querySelector(
                    ".bet-slip-container"
                  ).style.display;
                  if (actualDisplay === "block") {
                    document.querySelector(".bet-slip-container").style.display =
                      "none";
                  } else {
                    document.querySelector(".bet-slip-container").style.display =
                      "block";
                  }
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
        <div
          className="signInContainer"
          onClick={navigateToLogin}
        >
          <p className="signText">REGISTER</p>
          <p className="signText">&nbsp;OR&nbsp;LOGIN</p>
        </div>
      </div>
    </div>
  );
};
