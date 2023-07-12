import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../../store/actions";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import Image from "next/image";

export const SetDepositLimit = ({
  depositData,
  selectedLimit,
  setSelectedLimit,
  setDepositData,
  dailyLimit,
  setDailyLimit,
  weeklyLimit,
  setWeeklyLimit,
  monthlyLimit,
  setMonthlyLimit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  let user = useSelector((state) => state.loggedUser);
  const isMobile = useSelector((state) => state.setMobile);
  const saferGambling = useSelector(
    (state) =>
      state.loggedUser?.user_data?.settings?.safer_gambling?.deposit_limit
  );
  const dispatch = useDispatch();

  const handleSetLimit = () => {
    let body = {};
    let currentLimit;
    if (depositData.type === "daily") {
      body.deposit_limit_daily = dailyLimit;
      currentLimit = saferGambling?.deposit_limit_daily?.value;
    } else if (depositData.type === "weekly") {
      body.deposit_limit_weekly = weeklyLimit;
      currentLimit = saferGambling?.deposit_limit_weekly?.value;
    } else if (depositData.type === "monthly") {
      body.deposit_limit_monthly = monthlyLimit;
      currentLimit = saferGambling?.deposit_limit_monthly?.value;
    } else {
      return;
    }

    setIsLoading(true);
    apiServices
      .put(apiUrl.SETTINGS, body)
      .then(() => {
        if (currentLimit === -1 && selectedLimit > currentLimit - 1) {
          SuccesToast({
            message: "Successfully updated!",
          });
        } else if (selectedLimit < currentLimit && selectedLimit !== -1) {
          SuccesToast({
            message: "Successfully updated!",
          });
        } else {
          SuccesToast({
            message:
              "Changes have been requested. There is a 24-hour cooldown period before applying.",
          });
        }
        setIsLoading(false);
        setDepositData({
          ...depositData,
          show: false,
          title: "",
          type: "",
          data: [],
        });
        let currency = user?.user_data?.currency?.abbreviation;
        let newUser = { ...user };
        if (
          (selectedLimit < currentLimit && selectedLimit !== -1) ||
          (currentLimit === -1 && selectedLimit > currentLimit - 1)
        ) {
          if (depositData.type === "daily") {
            newUser.user_data.settings.safer_gambling.deposit_limit.deposit_limit_daily =
              {
                name:
                  selectedLimit !== -1
                    ? `${selectedLimit} ${currency}`
                    : "No Limit",
                value: selectedLimit,
              };
          } else if (depositData.type === "weekly") {
            newUser.user_data.settings.safer_gambling.deposit_limit.deposit_limit_weekly =
              {
                name:
                  selectedLimit !== -1
                    ? `${selectedLimit} ${currency}`
                    : "No Limit",
                value: selectedLimit,
              };
          } else if (depositData.type === "monthly") {
            newUser.user_data.settings.safer_gambling.deposit_limit.deposit_limit_monthly =
              {
                name:
                  selectedLimit !== -1
                    ? `${selectedLimit} ${currency}`
                    : "No Limit",
                value: selectedLimit,
              };
          }
        }
        dispatch(setLoggedUser(newUser));
        setSelectedLimit(0);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (depositData.type === "daily" && selectedLimit !== 0) {
      setDailyLimit(selectedLimit);
    } else if (depositData.type === "weekly" && selectedLimit !== 0) {
      setWeeklyLimit(selectedLimit);
    } else if (depositData.type === "monthly" && selectedLimit !== 0) {
      setMonthlyLimit(selectedLimit);
    }
  }, [selectedLimit]);

  return (
    <div
      className={isMobile ? "modal show modalFullScreen" : "modal fade"}
      id="limitModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block", padding: "0" }}
    >
      <div
        className={isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"}
      >
        <div className="modal-content">
          <p className="d-flex justify-content-center depositModalLimit">
            {depositData.title}
          </p>
          <Image
            src={images.closeIcon}
            className="closeIconSus"
            alt="Close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              setDepositData({
                ...depositData,
                show: false,
                type: "",
                title: "",
                data: [],
              });
              setSelectedLimit(0);
              setDailyLimit(saferGambling?.deposit_limit_daily?.value);
              setWeeklyLimit(saferGambling?.deposit_limit_weekly?.value);
              setMonthlyLimit(saferGambling?.deposit_limit_monthly?.value);
            }}
          />
          {depositData.data.map((value, index) => {
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
                {selectedLimit === value.value && (
                  <Image
                    src={images.validated}
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
