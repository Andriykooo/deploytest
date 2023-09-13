import { setErrorCode } from "@/store/actions";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../button/Button";
import { images } from "@/utils/imagesConstant";
import { useRouter } from "next/navigation";

export const SuspendedAccount = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const errorCode = useSelector((state) => state.errorCode);
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
            <p className=" depositModalLimitReminder">Account suspended</p>
            <p className="text-light">{errorCode?.message}</p>
          </div>
          <div className="d-flex align-items-center flex-column mt-5 w-100">
            <Button
              text={"Ok, I get it"}
              className={"gaming-reminder-accept-button"}
              onClick={() => {
                dispatch(setErrorCode(null));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
