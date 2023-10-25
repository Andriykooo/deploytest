import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../button/Button";
import { images } from "@/utils/imagesConstant";
import { setAlertModal } from "@/store/actions";
import { useTranslations } from "next-intl";
import "./AlertModal.css";
import { useEffect, useState } from "react";

export const AlertModal = () => {
  const t = useTranslations("common");
  const dispatch = useDispatch();

  const titles = {
    1104: t("account_suspended"),
    1062: t("account_excluded"),
    1063: t("account_suspended"),
    2280: t("account_closed"),
  };

  const alertModal = useSelector((state) => state.alertModal);
  const isMobile = useSelector((state) => state.setMobile);

  const [title, setTitle] = useState("");

  useEffect(() => {
    if (alertModal?.code) {
      setTitle(titles[alertModal?.code]);
    }
  }, [alertModal]);

  return alertModal ? (
    <div
      className={isMobile ? "modal show modalFullScreen" : "modal"}
      id="alertGamingReminderModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <div className="modal-content modalCenterContent alert-modal">
        <div className="d-flex align-items-center flex-column">
          <Image
            src={images.gamingReminderLogo}
            alt="Reminder"
            className={"gaming-reminder-logo"}
            height={56}
            width={56}
          />
          <p className="depositModalLimitReminder">{title}</p>
          <p className="text-light alert-modal-description">
            {alertModal?.message}
          </p>
        </div>
        <div className="d-flex align-items-center flex-column mt-5 w-100">
          <Button
            text={t("ok_i_get_it")}
            className={"gaming-reminder-accept-button"}
            onClick={() => {
              dispatch(setAlertModal(null));
            }}
          />
        </div>
      </div>
    </div>
  ) : null;
};
