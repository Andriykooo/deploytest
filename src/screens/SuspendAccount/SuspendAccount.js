"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import { setSettingsApi } from "@/utils/apiQueries";
import { useLogout } from "@/hooks/useLogout";
import "../DepositLimit/DepositLimit.css";
import "../SuspendAccount/SuspendAccount.css";
import { useClientTranslation } from "@/app/i18n/client";

const SuspendAccount = () => {
  const { t } = useClientTranslation(["suspend_account", "common"]);
  const dispatch = useDispatch();
  const logout = useLogout();

  const user_settings = useSelector((state) => state?.user_settings);
  const settings = useSelector((state) => state?.settings);

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
    setSettingsApi(body, dispatch, {
      onSuccess: (response) => {
        setIsLoading(false);

        if (!response?.error) {
          logout();
        }
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  var suspendText = "";
  if (suspendPeriod === 1) {
    suspendText = `1 ${t("day")}`;
  } else if (suspendPeriod === 3) {
    suspendText = `3 ${t("days")}`;
  } else if (suspendPeriod === 5) {
    suspendText = `5 ${t("days")}`;
  } else if (suspendPeriod === 7) {
    suspendText = `7 ${t("days")}`;
  } else if (suspendPeriod === 14) {
    suspendText = `14 ${t("days")}`;
  } else if (suspendPeriod === 30) {
    suspendText = `30 ${t("days")}`;
  } else if (suspendPeriod === 45) {
    suspendText = `45 ${t("days")}`;
  } else {
    suspendText = t("common:not_set");
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
      <div className="depositLimit max-width-container">
        <div>
          <PreferencesTitle
            title={t("common:suspend_account")}
            backRoute="/profile/safer_gambling"
            marginBottomSize="sm"
            showBackOnDesktop
          />
          <p className="menuText">
            {t("break_options_message", { company: settings?.companyName })}
          </p>
          <p className="menuText">{t("timeout_logout_message")}</p>
          <div className="row mb-3 susAccount">
            <div className="col-6 subText">{t("suspend_account_for")}</div>
            <PreferencesDropdown
              data={{ ...suspendData, title: t("common:suspend_account") }}
              selectedItem={selectedLimit}
              handleToggle={handleToggle}
              handleSelect={handleSetSelectedLimit}
              placeholder={suspendText}
              modalOnMobile
              btnTitle={t("common:set_limit")}
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
            text={<>{isLoading ? <Loader /> : t("common:suspend_account")}</>}
          />
        </div>
      </div>
    </>
  );
};

export default SuspendAccount;
