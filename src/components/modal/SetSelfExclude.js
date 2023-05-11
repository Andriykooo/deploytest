import React, { useState } from "react";
import { useSelector } from "react-redux";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";

export const SetSelfExclude = ({
  excludeData,
  selectedLimit,
  setSelectedLimit,
  setExcludePeriod,
  setExcludeData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useSelector((state) => state.setMobile);

  const handleSetSelectedLimit = () => {
    setExcludeData({ ...excludeData, show: false });
    setExcludePeriod(selectedLimit);
    setIsLoading(false);
  };

  return (
    <div
      className={isMobile ? "modal show modalFullScreen" : "modal fade show"}
      id="limitModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <div
        className={isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"}
      >
        <div className="modal-content modalCenterContent">
          <p className="d-flex justify-content-center depositModalLimit">
            Self Exclude
          </p>
          <img
            src={images.closeIcon}
            className="closeIconSus"
            alt="Close"
            onClick={() => {
              setExcludeData({
                ...excludeData,
                show: false,
                data: [],
              });
            }}
          />
          {excludeData.data.map((row) => {
            return (
              <div
                key={row.value}
                className={
                  selectedLimit === row.value
                    ? "selectDecimal selectedOdd d-flex mb-3"
                    : "selectDecimal d-flex mb-3"
                }
                onClick={() => {
                  if (selectedLimit === row.value) {
                    setSelectedLimit(-1);
                  } else {
                    setSelectedLimit(row.value);
                  }
                }}
              >
                <div className="selectDecimal">
                  <p className="m-3 decimalText">{row.name}</p>
                </div>
                {selectedLimit === row.value && (
                  <img
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
