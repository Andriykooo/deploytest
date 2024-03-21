"use client";

import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../../store/actions";
import { oddsFormatTypes } from "../../utils/constants";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import classNames from "classnames";
import { useState } from "react";
import { setSettingsApi } from "@/utils/apiQueries";
import { useTranslations } from "next-intl";
import { ProfileValidatedIcon } from "@/utils/icons";
import "./OddsFormat.css";

const OddsFormat = () => {
  const t = useTranslations();
  const loggedUser = useSelector((state) => state.loggedUser);
  const isTablet = useSelector((state) => state.isTablet);
  const [activeOdd, setActiveOdd] = useState(
    loggedUser?.user_data?.settings?.odds_format
  );

  const dispatch = useDispatch();
  const handleClick = (key) => {
    setActiveOdd(key);
    const body = {
      odds_format: key,
    };

    setSettingsApi(body, dispatch, {
      onSuccess: (result) => {
        if (!result?.error) {
          let newUser = {};
          Object.assign(newUser, loggedUser);
          newUser.user_data.settings.odds_format = key;
          dispatch(setLoggedUser(newUser));
        }
      },
    });
  };

  return (
    <div
      className={classNames("depositLimit", {
        "max-width-container": !isTablet,
      })}
    >
      <PreferencesTitle title={t("common.odds_format")} marginBottomSize="lg" />
      {oddsFormatTypes.map((value, index) => {
        return (
          <div
            key={index}
            data-id={index}
            onClick={() => handleClick(value.id)}
            className={classNames("selectDecimal d-flex align-center", {
              selectedOdd: activeOdd === value.id,
            })}
          >
            <p className="decimalText ms-3">
              {t(`odds_format.${value.format}`)}
            </p>
            {activeOdd === value.id ? (
              <ProfileValidatedIcon className="oddsSelected" />
            ) : (
              ""
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OddsFormat;
