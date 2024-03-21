import { useSelector } from "react-redux";
import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { multipleBetTypesInfo } from "@/utils/constants";
import { useTranslations } from "next-intl";
import { translateNumberToText } from "@/utils/global";
import { useParams } from "next/navigation";

const CombinationInfo = ({ name, type, setShowModal }) => {
  const t = useTranslations("common");
  const params = useParams();

  const isMobile = useSelector((state) => state.setMobile);

  const getText = () => {
    if (type.includes("fold")) {
      const number = type.match(/\d+/)[0];
      const language = params.lng;
      const translatedNumber = translateNumberToText(number, language);

      return t("folds", { foldNumber: translatedNumber });
    } else {
      return t(multipleBetTypesInfo[type]);
    }
  };
  return (
    <div
      className={isMobile ? "modal show modalFullScreen" : "modal center"}
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
          <Image
            height={24}
            width={24}
            style={{ margin: "1rem", top: "10px", right: "10px" }}
            src={images.closeIcon}
            className="closeIconSus closeFullScreenModal"
            alt="Close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={setShowModal}
          />
          <Image
            height={64}
            width={64}
            src={images.gamingReminderLogo}
            alt="Reminder"
            className={"gaming-reminder-logo"}
          />
          <p className=" depositModalLimitReminder">{name}</p>
          <p className="text-light mt-3 m-4 mb-5 text-center">{getText()}</p>
        </div>
      </div>
    </div>
  );
};
export default CombinationInfo;
