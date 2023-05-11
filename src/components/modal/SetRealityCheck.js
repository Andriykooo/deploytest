import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../../store/actions";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";

export const SetRealityCheck = ({
  options,
  selectedLimit,
  setSelectedLimit,
  realityCheck,
  setRealityCheck,
  realityCheckData,
  setRealityCheckData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  let user = useSelector((state) => state.loggedUser);
  const isMobile = useSelector((state) => state.setMobile);
  const dispatch = useDispatch();

  const handleSetLimit = () => {
    const body = {
      reality_check_after: realityCheck,
    };
    setIsLoading(true);
    apiServices
      .put(apiUrl.NEXT_PUBLIC_SETTINGS, body)
      .then(() => {
        SuccesToast({ message: "Successfully updated!" });
        setIsLoading(false);
        setRealityCheckData({
          ...realityCheckData,
          show: false,
          data: [],
        });
        let newUser = {};
        Object.assign(newUser, user);
        newUser.user_data.settings.safer_gambling.reality_check.reality_check_after.value =
          realityCheck;
        dispatch(setLoggedUser(newUser));
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setRealityCheck(selectedLimit);
  }, [selectedLimit]);

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
        <div className="modal-content modalCenterContent">
          <p className="d-flex justify-content-center depositModalLimit">
            Reality check
          </p>
          <img
            src={images.closeIcon}
            className="closeIconSus"
            alt="Close"
            onClick={() => {
              setRealityCheckData({
                ...realityCheckData,
                show: false,
                data: [],
              });
            }}
          />
          {options.map((value, index) => {
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
                    setSelectedLimit(0);
                  } else {
                    setSelectedLimit(value.value);
                  }
                }}
              >
                <div className="selectDecimal">
                  <p className="m-3 decimalText">{value.name}</p>
                </div>
                {selectedLimit === value.value ? (
                  <img
                    src={images.validated}
                    alt="selected"
                    className="oddsSelected"
                  />
                ) : (
                  ""
                )}
              </div>
            );
          })}

          <div className="modal-footer limit d-flex justify-content-center">
            <Button
              type="button"
              className={
                selectedLimit !== 0
                  ? "btn btnPrimary finishBtn2 setLimitBtn2 col-8"
                  : "btn finishBtn setLimitBtn col-8 disabled"
              }
              onClick={() => selectedLimit !== 0 && handleSetLimit()}
              text={<>{isLoading ? <Loader /> : "Set Limit"}</>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
