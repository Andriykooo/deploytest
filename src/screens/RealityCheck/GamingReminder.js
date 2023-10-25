import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { images } from "../../utils/imagesConstant";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useUsageTime } from "@/hooks/useUsageTime";

const GamingReminderAlert = ({ setGamingAlert }) => {
  const t = useTranslations("common");

  const router = useRouter();
  const isMobile = useSelector((state) => state.setMobile);
  const timdeDifference = useUsageTime();

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
              {t("friendly_reminder")}
            </p>
            <p className="text-light">{t("app_usage_duration_message")}</p>
            {timdeDifference && (
              <Button
                className={"gaming-alert-button"}
                text={timdeDifference}
              />
            )}
          </div>
          <div className="d-flex align-items-center flex-column w-100">
            <Button
              text={t("bet_history")}
              className={"gaming-reminder-history-button"}
              onClick={() => {
                setGamingAlert(false);
                router.push("/profile/open_predictions");
              }}
            />
            <Button
              text={t("ok_i_get_it")}
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
