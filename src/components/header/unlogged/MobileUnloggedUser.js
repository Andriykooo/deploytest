import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { SlipIcon } from "../../../utils/icons";
import { images } from "../../../utils/imagesConstant";
import Image from "next/image";

export const MobileUnloggedUser = ({ showBetSlip }) => {
  const selectedBets = useSelector((state) => state.selectedBets);
  const router = useRouter();

  return (
    <div className="col-3 sing-up-txt mobileAccInfo unlogged">
      <div className="d-flex align-items-center">
        <Image
          src={images.profile}
          alt="Profile"
          className="profileImage"
          onClick={() => {
            router.push("/login");
          }}
        />
        {showBetSlip && (
          <div
            className="slip-icon-loggedOut"
            onClick={() => {
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
          onClick={() => {
            router.push("/login");
          }}
        >
          <p className="signText">REGISTER</p>
          <p className="signText">&nbsp;OR&nbsp;LOGIN</p>
        </div>
      </div>
    </div>
  );
};
