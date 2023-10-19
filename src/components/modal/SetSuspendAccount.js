import { useState } from "react";
import { useSelector } from "react-redux";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import Image from "next/image";

export const SetSuspendAccount = ({
  suspendData,
  setSuspendData,
  selectedLimit,
  setSelectedLimit,
  setSuspendPeriod,
}) => {
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
            Suspend account
          </p>
          <Image
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
                  <Image
                    src={images.selected}
                    alt="selected"
                    className="oddsSelected"
                  />
                )}
              </div>
            );
          })}

          <div className="modal-footer limit d-flex justify-content-center">
            <Button
              type="button"
              className={
                selectedLimit !== -1
                  ? "btn btnPrimary finishBtn2 setLimitBtn2 col-8"
                  : "btn finishBtn setLimitBtn col-8 disabled"
              }
              onClick={() => selectedLimit !== -1 && handleSetSelectedLimit()}
              text={<>{isLoading ? <Loader /> : "Set Limit"}</>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
