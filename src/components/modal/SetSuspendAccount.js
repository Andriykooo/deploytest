import Image from "next/image";
import classNames from "classnames";
import { useState } from "react";
import { useSelector } from "react-redux";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import { useTranslations } from "@/hooks/useTranslations";
import { ValidIcon } from "@/icons/ValidIcon";

export const SetSuspendAccount = ({
  suspendData,
  setSuspendData,
  selectedLimit,
  setSelectedLimit,
  setSuspendPeriod,
}) => {
  const t = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useSelector((state) => state.setMobile);

  const handleSetSelectedLimit = () => {
    setSuspendData({ ...suspendData, show: false });
    setSuspendPeriod(selectedLimit);
    setIsLoading(false);
  };

  return (
    <div
      className={isMobile ? "modal show modalFullScreen" : "modal fade"}
      id="limitModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <div
        className={isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"}
      >
        <div className="modal-content">
          <p className="d-flex justify-content-center depositModalLimit">
            {t("suspend_account")}
          </p>
          <Image
            height={24}
            width={24}
            src={images.closeIcon}
            className="closeIconSus"
            alt="Close"
            onClick={() => {
              setSuspendData({
                ...suspendData,
                show: false,
                data: [],
              });
            }}
          />
          {suspendData.data.map((value, index) => {
            return (
              <div
                key={index}
                data-id={index}
                className={
                  selectedLimit === value.value
                    ? "selectDecimal selectedOdd d-flex mb-3"
                    : "selectDecimal d-flex mb-3"
                }
                onClick={() => {
                  if (selectedLimit === value.value) {
                    setSelectedLimit(-1);
                  } else {
                    setSelectedLimit(value.value);
                  }
                }}
              >
                <div className="selectDecimal">
                  <p className="m-3 decimalText">{value.name}</p>
                </div>
                {selectedLimit === value.value && (
                  <ValidIcon className="oddsSelected" alt="selected" />
                )}
              </div>
            );
          })}

          <div className="modal-footer limit d-flex justify-content-center">
            <Button
              type="button"
              className={classNames("setLimitBtn", {
                disable: selectedLimit === -1,
              })}
              onClick={() => selectedLimit !== -1 && handleSetSelectedLimit()}
              text={<>{isLoading ? <Loader /> : t("set_limit")}</>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
