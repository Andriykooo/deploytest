"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SuccesToast } from "@/utils/alert";
import { setLoggedUser } from "@/store/actions";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { setSettingsApi } from "@/utils/apiQueries";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import "../DepositLimit/DepositLimit.css";
import "../RealityCheck/RealityCheck.css";
import { useClientTranslation } from "@/app/i18n/client";

const RealityCheck = () => {
  const { t } = useClientTranslation(["reality_check", "common"]);
  const dispatch = useDispatch();
  const user_settings = useSelector((state) => state?.user_settings);
  const user = useSelector((state) => state.loggedUser);

  const [loader, setLoader] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [selectedLimit, setSelectedLimit] = useState(-1);
  const [realityCheckData, setRealityCheckData] = useState({
    show: false,
    data: [],
  });

  useEffect(() => {
    if (user?.user_data) {
      setSelectedLimit(
        user?.user_data?.settings?.safer_gambling?.reality_check
          ?.reality_check_after?.value
      );
      setLoader(false);
    }
  }, [user]);

  let realityCheckTxt = "";

  if (selectedLimit === 15) {
    realityCheckTxt = `15 ${t("common:minutes")}`;
  } else if (selectedLimit === 30) {
    realityCheckTxt = `30 ${t("common:minutes")}`;
  } else if (selectedLimit === 45) {
    realityCheckTxt = `45 ${t("common:minutes")}`;
  } else if (selectedLimit === 60) {
    realityCheckTxt = `1 ${t("common:hour")}`;
  } else {
    realityCheckTxt = t("common:not_set");
  }

  const handleToggle = () => {
    setRealityCheckData({
      ...realityCheckData,
      show: !realityCheckData.show,
      data: user_settings?.reality_check_options,
    });
    setDisabled(true);
  };

  const handleSelect = () => {
    setLoader(true);
    const body = {
      reality_check_after: selectedLimit,
    };
    setSettingsApi(body, dispatch, {
      onSuccess: (response) => {
        if (response?.error) {
          return;
        }
        SuccesToast({ message: t("common:successfully_updated") });
        setDisabled(true);
        setRealityCheckData({
          ...realityCheckData,
          show: false,
          data: [],
        });
        let newUser = {};
        Object.assign(newUser, user);
        newUser.user_data.settings.safer_gambling.reality_check.reality_check_after.value =
          selectedLimit;
        dispatch(setLoggedUser(newUser));
        setLoader(false);
      },
      onError: () => {
        setLoader(false);
      },
    });

    setRealityCheckData({ ...realityCheckData, show: false });
  };

  return (
    <>
      <div className="depositLimit max-width-container">
        <div>
          <PreferencesTitle
            title={t("reality_check")}
            backRoute="/profile/safer_gambling"
            marginBottomSize="sm"
            showBackOnDesktop
          />
          <p className="menuText">{t("reality_check_description")}</p>

          <div className="mb-3 row">
            <div className="subText col-6">{t("reality_check_after")}</div>

            <PreferencesDropdown
              data={{ ...realityCheckData, title: t("reality_check") }}
              selectedItem={selectedLimit}
              handleToggle={handleToggle}
              handleSelect={(value) => {
                setSelectedLimit(value);
                setDisabled(false);
                setRealityCheckData({
                  ...realityCheckData,
                  show: !realityCheckData.show,
                  data: user_settings?.reality_check_options,
                });
              }}
              modalOnMobile
              btnTitle={t("common:set_limit")}
              placeholder={realityCheckTxt}
            />
          </div>
        </div>
        <div className="row suspendButton">
          <Button
            className={
              "setLimit suspendAccBtn w-100 " +
              (!disabled
                ? " btnPrimary "
                : "btn finishBtn disabled setLimitBtn col-8")
            }
            onClick={handleSelect}
            text={loader ? <Loader /> : t("common:set_limit")}
          />
        </div>
      </div>
    </>
  );
};

export default RealityCheck;
