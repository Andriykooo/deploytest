"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../../store/actions";
import { SuccesToast } from "../../utils/alert";
import { oddsFormatTypes } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import "../OddsFormat/OddsFormat.css";
import classNames from "classnames";
import { useState } from "react";
import { setSettingsApi } from "@/utils/apiQueries";
import { useClientTranslation } from "@/app/i18n/client";

const OddsFormat = () => {
  const { t } = useClientTranslation(["odds_format", "common"]);
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
        if (Object.keys(result).length < 1) {
          let newUser = {};
          Object.assign(newUser, loggedUser);
          newUser.user_data.settings.odds_format = key;
          dispatch(setLoggedUser(newUser));
        }

        if (!result?.error) {
          SuccesToast({ message: t("odds_format_updated") });
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
      <PreferencesTitle title={t("common:odds_format")} marginBottomSize="lg" />
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
            <span className="">
              <p className="decimalText">{t(value.format)}</p>
            </span>
            {activeOdd === value.id ? (
              <Image
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
    </div>
  );
};

export default OddsFormat;
