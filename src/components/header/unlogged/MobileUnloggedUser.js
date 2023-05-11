import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { SlipIcon } from "../../../utils/icons";
import { images } from "../../../utils/imagesConstant";

export const MobileUnloggedUser = ({ showBetSlip }) => {
  const selectedBets = useSelector((state) => state.selectedBets);
  const router = useRouter();
  return (
    <>
      <img
        src={images.profile}
        alt="Profile"
        className="profileImage pe-2 ps-2"
        onClick={() => {
          router.push("/login");
        }}
      />
      {showBetSlip && (
        <div
          className="slip-icon-loggedOut"
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
          {selectedBets && selectedBets.length > 0 && (
            <span className="total-slip-bets">{selectedBets.length}</span>
          )}
        </div>
      )}
      <div
        className="signInContainer"
        onClick={() => {
          router.push("/login");
        }}
      >
        <p className="signText">REGISTER</p>
        <p className="signText">&nbsp;OR&nbsp;LOGIN</p>
      </div>
    </>
  );
};
