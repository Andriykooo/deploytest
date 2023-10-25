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
import { useTranslations } from "next-intl";
const SuspendAccount = () => {
  const t = useTranslations();
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

  let suspendText = "";
  if (suspendPeriod === 1) {
    suspendText = `1 ${t("suspend_account.day")}`;
  } else if (suspendPeriod === 3) {
    suspendText = `3 ${t("suspend_account.days")}`;
  } else if (suspendPeriod === 5) {
    suspendText = `5 ${t("suspend_account.days")}`;
  } else if (suspendPeriod === 7) {
    suspendText = `7 ${t("suspend_account.days")}`;
  } else if (suspendPeriod === 14) {
    suspendText = `14 ${t("suspend_account.days")}`;
  } else if (suspendPeriod === 30) {
    suspendText = `30 ${t("suspend_account.days")}`;
  } else if (suspendPeriod === 45) {
    suspendText = `45 ${t("suspend_account.days")}`;
  } else {
    suspendText = t("common.not_set");
  }

  const handleToggle = () => {
    setSuspendData({
      ...suspendData,
      show: !suspendData.show,
      data: user_settings?.suspend_account_options.map((option) => {
        let name = "";
        if (option.value === 1) {
          name = `1 ${t("suspend_account.day")}`;
        } else if (option.value === 3) {
          name = `3 ${t("suspend_account.days")}`;
        } else if (option.value === 5) {
          name = `5 ${t("suspend_account.days")}`;
        } else if (option.value === 7) {
          name = `7 ${t("suspend_account.days")}`;
        } else if (option.value === 14) {
          name = `14 ${t("suspend_account.days")}`;
        } else if (option.value === 30) {
          name = `30 ${t("suspend_account.days")}`;
        } else if (option.value === 45) {
          name = `45 ${t("suspend_account.days")}`;
        } else {
          name = t("common.not_set");
        }

        return {
          name,
          value: option.value,
        };
      }),
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
            title={t("common.suspend_account")}
            backRoute="/profile/safer_gambling"
            marginBottomSize="sm"
            showBackOnDesktop
          />
          <p className="menuText">
            {t("suspend_account.break_options_message", {
              company: settings?.companyName,
            })}
          </p>
          <p className="menuText">
            {t("suspend_account.timeout_logout_message")}
          </p>
          <div className="row mb-3 susAccount">
            <div className="col-6 subText">
              {t("suspend_account.suspend_account_for")}
            </div>
            <PreferencesDropdown
              data={{ ...suspendData, title: t("common.suspend_account") }}
              selectedItem={selectedLimit}
              handleToggle={handleToggle}
              handleSelect={handleSetSelectedLimit}
              placeholder={suspendText}
              modalOnMobile
              btnTitle={t("common.set_limit")}
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
            text={<>{isLoading ? <Loader /> : t("common.suspend_account")}</>}
          />
        </div>
      </div>
    </>
  );
};

export default SuspendAccount;
