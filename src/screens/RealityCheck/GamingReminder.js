import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { images } from "../../utils/imagesConstant";
import { useTranslations } from "next-intl";
import { useUsageTime } from "@/hooks/useUsageTime";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import classNames from "classnames";
import "./GamingReminder.css";
import { useEffect, useState } from "react";
import { addUsageTime } from "@/store/actions";

const GamingReminderAlert = () => {
  const t = useTranslations("common");
  const loggedUser = useSelector((state) => state.loggedUser);
  const dispatch = useDispatch();
  const router = useCustomRouter();
  const isMobile = useSelector((state) => state.setMobile);
  const timdeDifference = useUsageTime();

  const [gamingAlert, setGamingAlert] = useState(false);

  useEffect(() => {
    let interval = null;
    const userRealityCheck =
      loggedUser?.user_data?.settings?.safer_gambling?.reality_check
        ?.reality_check_after?.value || 15;

    if (loggedUser?.user_data?.email && userRealityCheck > 0) {
      interval = setInterval(() => {
        setGamingAlert(true);
        dispatch(addUsageTime(userRealityCheck));
      }, userRealityCheck * 60 * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loggedUser]);

  return (
    gamingAlert && (
      <div
        className={classNames("modal show", { modalFullScreen: isMobile })}
        id="alertGamingReminderModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: "block", zIndex: "3000" }}
      >
        <div
          className={
            isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog top-50"
          }
        >
          <div className="modal-content modalCenterContent justify-content-between">
            <div className="d-flex align-items-center flex-column">
              <Image
                height={64}
                width={64}
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
                  router.push("/settings/bet_history");
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
    )
  );
};
export default GamingReminderAlert;
