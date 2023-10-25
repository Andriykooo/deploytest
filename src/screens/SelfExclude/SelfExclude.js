"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import { setSettingsApi } from "@/utils/apiQueries";
import { useLogout } from "@/hooks/useLogout";
import "./SelfExclude.css";
import { useTranslations } from "next-intl";
const SelfExclude = () => {
  const t = useTranslations();
  const [excludeData, setExcludeData] = useState({
    show: false,
    data: [],
  });
  const [loader, setLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [excludePeriod, setExcludePeriod] = useState(false);
  const excludeValue = useSelector(
    (state) =>
      state.loggedUser?.user_data?.settings?.safer_gambling?.self_exclude
        ?.self_exclude_deactivated
  );
  const user_settings = useSelector((state) => state?.user_settings);
  const dispatch = useDispatch();
  const logout = useLogout();

  useEffect(() => {
    setLoader(true);
    setExcludePeriod(excludeValue);
    setLoader(false);
  }, [excludeValue]);

  const handleSetLimit = () => {
    const body = {
      self_exclude_deactivated: excludePeriod,
    };

    setIsLoading(true);

    setSettingsApi(body, dispatch, {
      onSuccess: (response) => {
        if (!response?.error) {
          logout();
        }
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  let excludeText = "";
  if (excludePeriod === 6) {
    excludeText = `6 ${t("self_exclude.months")}`;
  } else if (excludePeriod === 12) {
    excludeText = `1 ${t("self_exclude.year")}`;
  } else if (excludePeriod === 24) {
    excludeText = `2 ${t("self_exclude.years")}`;
  } else if (excludePeriod === 60) {
    excludeText = `5 ${t("self_exclude.years")}`;
  } else {
    excludeText = t("common.not_set");
  }

  const handleToggle = () => {
    setExcludeData({
      ...excludeData,
      show: !excludeData.show,
      data: user_settings?.self_exclude_deactivate_options.map((option) => {
        let name;

        if (option.value === 6) {
          name = `6 ${t("self_exclude.months")}`;
        } else if (option.value === 12) {
          name = `1 ${t("self_exclude.year")}`;
        } else if (option.value === 24) {
          name = `2 ${t("self_exclude.years")}`;
        } else if (option.value === 60) {
          name = `5 ${t("self_exclude.years")}`;
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
    setExcludePeriod(value);
    setIsLoading(false);
    handleToggle();
  };

  return (
    <div className="depositLimit">
      <div className="max-width-container">
        <div>
          <PreferencesTitle
            title={t("common.self_exclude")}
            backRoute="/profile/safer_gambling"
            marginBottomSize="sm"
            showBackOnDesktop
          />
          <p className="menuText">{t("self_exclude.self_exclusion_prompt")}</p>
          <p className="menuText">
            {t("self_exclude.open_wagers_exclusion_message")}
          </p>
          <p className="menuText">
            {t("self_exclude.further_advice_links_message")} <br />
            GamCare: www.gamcare.org.uk
            <br />
            Gam-Anon: www.gamanon.org.uk
            <br />
            GambleAware: www.begambleaware.org
            <br />
          </p>
          <div className="mb-3 d-flex">
            <div className="col-6 subText">
              {t("self_exclude.deactivate_account_for")}
            </div>

            <PreferencesDropdown
              data={{ ...excludeData, title: t("common.self_exclude") }}
              selectedItem={excludeValue}
              handleToggle={handleToggle}
              handleSelect={(v) => {
                handleSetSelectedLimit(v);
              }}
              placeholder={excludeText}
              loader={loader}
              btnTitle={t("common.set_limit")}
              modalOnMobile
            />
          </div>
        </div>
        <div className="suspendButton">
          <Button
            className={
              "setLimit suspendAccBtn w-100 " +
              (excludePeriod
                ? " btnPrimary "
                : "btn finishBtn disabled setLimitBtn col-8")
            }
            onClick={() => excludePeriod && handleSetLimit()}
            text={
              <>
                {isLoading ? <Loader /> : t("self_exclude.deactivate_account")}
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SelfExclude;
