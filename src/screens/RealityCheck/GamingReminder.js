import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { images } from "../../utils/imagesConstant";
import Image from "next/image";

const GamingReminderAlert = ({ time, setGamingAlert }) => {
  const router = useRouter();
  const isMobile = useSelector((state) => state.setMobile);

  return (
    <div
      className={isMobile ? "modal show modalFullScreen" : "modal"}
      id="alertGamingReminderModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <div
        className={
          isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog  top-50"
        }
      >
        <div className="modal-content modalCenterContent justify-content-between">
          <div className="d-flex align-items-center flex-column">
            <Image
              src={images.gamingReminderLogo}
              alt="Reminder"
              className={"gaming-reminder-logo"}
            />
            <p className=" depositModalLimitReminder">
              Hey! Here’s a friendly reminder
            </p>
            <p className="text-light">You’ve been using the app for</p>
            <Button
              className={"gaming-alert-button"}
              text={`${time} minutes`}
            />
          </div>
          <div className="d-flex align-items-center flex-column">
            <Button
              text={"Bet History"}
              className={"gaming-reminder-history-button"}
              onClick={() => {
                setGamingAlert(false);
                router.push("/profile/open_predictions");
              }}
            />
            <Button
              text={"Ok, I get it"}
              className={"gaming-reminder-accept-button"}
              onClick={() => {
                setGamingAlert(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default GamingReminderAlert;
