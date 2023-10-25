import { useSelector } from "react-redux";
import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { multipleBetTypesInfo } from "@/utils/constants";
import { useTranslations } from "next-intl";
const CombinationInfo = ({ name, type, setShowModal }) => {
  const t = useTranslations("common");
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
        <div className="modal-content modalCenterContent">
          <Image
            style={{ margin: "1rem", top: "0" }}
            src={images.closeIcon}
            className="closeIconSus closeFullScreenModal"
            alt="Close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowModal((prev) => !prev)}
          />
          <Image
            src={images.gamingReminderLogo}
            alt="Reminder"
            className={"gaming-reminder-logo"}
          />
          <p className=" depositModalLimitReminder">{name}</p>
          <p className="text-light m-3 text-center">
            {t(multipleBetTypesInfo[type])}
          </p>
        </div>
      </div>
    </div>
  );
};
export default CombinationInfo;
