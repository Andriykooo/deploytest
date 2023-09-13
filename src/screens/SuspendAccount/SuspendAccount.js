"use client";

import { clearLocalStorage } from "@/utils/localStorage";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import {
  setErrorCode,
  setLogOut,
  setLoggedUser,
  setUser,
} from "@/store/actions";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import "../DepositLimit/DepositLimit.css";
import "../SuspendAccount/SuspendAccount.css";
import { setSettingsApi } from "@/utils/apiQueries";

const SuspendAccount = () => {
  const dispatch = useDispatch();
  const user_settings = useSelector((state) => state?.user_settings);

  const [selectedLimit, setSelectedLimit] = useState(-1);
  const [suspendPeriod, setSuspendPeriod] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suspendData, setSuspendData] = useState({
    show: false,
    data: [],
  });

  const handleSetLimit = () => {
    setIsLoading(true);
    let body = {
      suspend_account_for: suspendPeriod,
    };
    setSettingsApi(body, dispatch)
      .then(() => {
        setIsLoading(false);

        dispatch(setLogOut(null));
        dispatch(setUser(null));
        dispatch(setLoggedUser(null));
        dispatch(
          setErrorCode({
            code: 1063,
            message: `Your account has been suspended for ${suspendPeriod}
                ${suspendPeriod === 1 ? "day" : "days"}.`,
          })
        );
        clearLocalStorage();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  var suspendText = "";
  if (suspendPeriod === 1) {
    suspendText = "1 Day";
  } else if (suspendPeriod === 3) {
    suspendText = "3 Days";
  } else if (suspendPeriod === 5) {
    suspendText = "5 Days";
  } else if (suspendPeriod === 7) {
    suspendText = "7 Days";
  } else if (suspendPeriod === 14) {
    suspendText = "14 Days";
  } else if (suspendPeriod === 30) {
    suspendText = "30 Days";
  } else if (suspendPeriod === 45) {
    suspendText = "45 Days";
  } else {
    suspendText = "Not Set";
  }

  const handleToggle = () => {
    setSuspendData({
      ...suspendData,
      show: !suspendData.show,
      data: user_settings?.suspend_account_options,
    });
  };

  const handleSetSelectedLimit = (value) => {
    if (selectedLimit === value) {
      setSelectedLimit(-1);
      setSuspendPeriod(-1);
    } else {
      setSelectedLimit(value);
      setSuspendPeriod(value);
      handleToggle();
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="depositLimit max-width-container gamblingContainer">
        <div>
          <PreferencesTitle
            title="Suspend account"
            backRoute="/profile/safer_gambling"
            marginBottomSize="sm"
            showBackOnDesktop
          />
          <p className="menuText">
            If you want to take a break from Swifty Predictions, we offer the
            following options.
          </p>
          <p className="menuText">
            Once a timeout has been applied you will be logged out and you won't
            be able to log in for the chosen duration.
          </p>
          <div className="row mb-3 susAccount">
            <div className="col-6 subText">Suspend account for</div>
            <PreferencesDropdown
              data={{ ...suspendData, title: "Suspend account" }}
              selectedItem={selectedLimit}
              handleToggle={handleToggle}
              handleSelect={handleSetSelectedLimit}
              placeholder={suspendText}
              modalOnMobile
              btnTitle="Set limit"
            />
          </div>
        </div>
        <div className="row suspendButton">
          <Button
            className={
              "setLimit suspendAccBtn w-100 " +
              (suspendPeriod
                ? " btnPrimary "
                : "btn finishBtn disabled setLimitBtn col-8")
            }
            onClick={() => suspendPeriod && handleSetLimit()}
            text={<>{isLoading ? <Loader /> : "Suspend Account"}</>}
          />
        </div>
      </div>
    </>
  );
};

export default SuspendAccount;
