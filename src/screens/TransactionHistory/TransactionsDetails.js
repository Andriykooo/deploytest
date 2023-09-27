import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { images } from "../../utils/imagesConstant";
import Image from "next/image";
import { useClientTranslation } from "@/app/i18n/client";

export const TransactionDetails = ({ data, close }) => {
  const { t } = useClientTranslation("common");
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
          <div className="d-flex align-items-center flex-column transactionDetailsContent">
            <Image
              src={images.tickIcon}
              alt="Reminder"
              className={"gaming-reminder-logo"}
            />
            <p className="depositModalLimitReminder">{data?.title}</p>
            {data?.row2 && <p className="text-light">{data?.row2}</p>}
            {data?.row3 && <p className="text-light">{data?.row3}</p>}
            {data?.row4 && <p className="text-light">{data?.row4}</p>}
            {data?.row5 && <p className="text-light">{data?.row5}</p>}
          </div>
          <div className="d-flex align-items-center flex-column w-100">
            <Button
              text={t("close")}
              onClick={close}
              className={"gaming-reminder-accept-button"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
