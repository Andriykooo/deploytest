import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { SlipIcon } from "../../../utils/icons";

export const DesktopUnloggedUser = ({ showBetSlip }) => {
  const selectedBets = useSelector((state) => state.selectedBets);
  const router = useRouter();

  return (
    <div
      className={showBetSlip ? "sing-up-txt between-container" : "sing-up-txt"}
      onClick={() => {
        if (!showBetSlip) {
          router.push("/login");
        }
      }}
    >
      {showBetSlip && (
        <div
          className="slip-icon"
          onClick={() => {
            if (document.querySelector(".bet-slip-container")) {
              let actualDisplay = document.querySelector(".bet-slip-container")
                .style.display;
              if (actualDisplay === "block") {
                document.querySelector(".bet-slip-container").style.display =
                  "none";
              } else {
                document.querySelector(".bet-slip-container").style.display =
                  "block";
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
        className="d-flex"
        onClick={() => {
          router.push("/login");
        }}
      >
        <p className="signText">REGISTER</p>
        <p className="signText">&nbsp;OR&nbsp;LOGIN</p>
      </div>
    </div>
  );
};
