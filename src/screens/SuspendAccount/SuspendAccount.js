"use client";

import { removeLocalStorageItem } from "@/utils/localStorage";
import { nextWindow } from "@/utils/nextWindow";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { setLoggedUser } from "@/store/actions";
import { SuccesToast } from "@/utils/alert";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { images } from "@/utils/imagesConstant";
import "../DepositLimit/DepositLimit.css";
import "../SuspendAccount/SuspendAccount.css";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";

const SuspendAccount = () => {
  const [selectedLimit, setSelectedLimit] = useState(-1);
  const [suspendPeriod, setSuspendPeriod] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suspendData, setSuspendData] = useState({
    show: false,
    data: [],
  });
  const user_settings = useSelector((state) => state?.user_settings);
  const isTablet = useSelector((state) => state?.isTablet)
  const suspendValue = useSelector(
    (state) =>
      state.loggedUser?.user_data?.settings?.safer_gambling?.suspend_account
        ?.suspend_account_for
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loggedUser);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(true);

    setTimeout(() => {
      setSuspendPeriod(suspendValue?.value);
      setLoader(false);
    }, 1500);
  }, [suspendValue?.value]);

  const handleSetLimit = () => {
    setIsLoading(true)
    let body = {
      suspend_account_for: suspendPeriod,
    };
    apiServices
      .put(apiUrl.SETTINGS, body)
      .then(() => {
        SuccesToast({ message: "Successfully updated!" });
        setIsLoading(false);
        setSuspendData({
          ...suspendData,
          show: false,
          data: [],
        });
        let newUser = {};
        Object.assign(newUser, user);
        newUser.user_data.settings.safer_gambling.suspend_account.suspend_account_for.value =
          suspendPeriod;
        dispatch(setLoggedUser(newUser));
        removeLocalStorageItem("access_token");
        removeLocalStorageItem("refresh_token");
        setTimeout(() => {
          nextWindow.location.replace("/login");
          setTimeout(() => {
            nextWindow.location.reload();
          }, 500);
        }, 500);
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
          <div className="d-flex arrow-top">
            <Image
              src={images.goBackArrow}
              alt="Go back"
              className="ms-0 mb-3"
              onClick={() => router.back()}
            />
          </div>
          <p className="menuTitle arrow-top">Suspend account</p>
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
              data={{...suspendData, title: "Suspend account"}}
              selectedItem={selectedLimit}
              handleToggle={handleToggle}
              handleSelect={handleSetSelectedLimit}
              placeholder={suspendText}
              loader={isLoading}
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
