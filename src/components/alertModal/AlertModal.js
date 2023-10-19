import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../button/Button";
import { images } from "@/utils/imagesConstant";
import { setAlertModal } from "@/store/actions";

export const AlertModal = () => {
  const dispatch = useDispatch();

  const alertModal = useSelector((state) => state.alertModal);
  const isMobile = useSelector((state) => state.setMobile);

  return alertModal ? (
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
            <p className=" depositModalLimitReminder">{alertModal?.title}</p>
            <p className="text-light">{alertModal?.message}</p>
          </div>
          <div className="d-flex align-items-center flex-column mt-5 w-100">
            <Button
              text={"Ok, I get it"}
              className={"gaming-reminder-accept-button"}
              onClick={() => {
                dispatch(setAlertModal(null));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
