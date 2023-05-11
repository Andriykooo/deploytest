import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { images } from "../../utils/imagesConstant";

const GamingReminderAlert = ({
  realityGamingReminder,
  setGamingAlert,
  setUsageTime,
}) => {
  const isMobile = useSelector((state) => state.setMobile);

  const router = useRouter();

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
        className={isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"}
      >
        <div className="modal-content modalCenterContent">
          <img
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
            text={`${realityGamingReminder} minutes`}
          />
          <Button
            text={" Prediction History"}
            className={"gaming-reminder-history-button"}
            onClick={() => {
              setGamingAlert(false);

              setUsageTime(new Date());
              sessionStorage.setItem("loggedUserInTime", new Date());

              router.push("open_predictions");
            }}
          />
          <Button
            text={"Ok, I get it"}
            className={"gaming-reminder-accept-button"}
            onClick={() => {
              setGamingAlert(false);

              setUsageTime(new Date());

              sessionStorage.setItem("loggedUserInTime", new Date());
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default GamingReminderAlert;
