"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SuccesToast } from "@/utils/alert";
import { setLoggedUser } from "@/store/actions";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { setSettingsApi } from "@/utils/apiQueries";
import { useClientTranslation } from "@/app/i18n/client";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import classNames from "classnames";
import "../../screens/DepositLimit/DepositLimit.css";

const DepositLimitComponent = ({
  backRoute,
  onSetLimit,
  showBackOnDesktop = false,
  skipBtn,
  removeLimit,
  onSkip,
}) => {
  const { t } = useClientTranslation(["common", "profile"]);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [weeklyLimit, setWeeklyLimit] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(0);

  const [selectedLimit, setSelectedLimit] = useState(0);
  const [depositData, setDepositData] = useState({
    show: false,
    type: "",
    title: "",
    data: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const isTablet = useSelector((state) => state?.isTablet);
  const user = useSelector((state) => state.loggedUser);

  const saferGambling = useSelector(
    (state) =>
      state.loggedUser?.user_data?.settings?.safer_gambling?.deposit_limit
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (saferGambling) {
      setDailyLimit(saferGambling?.deposit_limit_daily?.value);
      setWeeklyLimit(saferGambling?.deposit_limit_weekly?.value);
      setMonthlyLimit(saferGambling?.deposit_limit_monthly?.value);
    }
  }, [saferGambling]);

  const handleToggle = (type, title) => {
    setDepositData({
      ...depositData,
      show: !depositData.show,
      type: type,
      title: title,
      data: user?.settings?.deposit_limit_options?.[`deposit_limit_${type}`],
    });
  };

  const handleSelect = () => {
    const body = {};

    if (dailyLimit) {
      body.deposit_limit_daily = dailyLimit;
    }

    if (weeklyLimit) {
      body.deposit_limit_weekly = weeklyLimit;
    }

    if (monthlyLimit) {
      body.deposit_limit_monthly = monthlyLimit;
    }

    setIsLoading(true);
    setSettingsApi(body, dispatch, {
      onSuccess: () => {
        const newUser = { ...user };

        Object.entries(body).forEach(([limit, limitValue]) => {
          const value = Number(limitValue);

          if (
            value >
              user.user_data.settings.safer_gambling.deposit_limit[limit]
                .value &&
            user.user_data.settings.safer_gambling.deposit_limit[limit]
              .value !== -1
          ) {
            SuccesToast({
              message: `${t(
                `${limit.replace("deposit_limit_", "")}_limit`
              )} - ${t("change_request_cooldown_message")}`,
            });
          }

          if (
            value <
              user.user_data.settings.safer_gambling.deposit_limit[limit]
                .value ||
            (value > 0 &&
              user.user_data.settings.safer_gambling.deposit_limit[limit]
                .value === -1)
          ) {
            SuccesToast({
              message: `${t(
                `${limit.replace("deposit_limit_", "")}_limit`
              )} - ${t("successfully_updated")}`,
            });

            newUser.user_data.settings.safer_gambling.deposit_limit[limit] = {
              ...newUser.user_data.settings.safer_gambling.deposit_limit[limit],
              name:
                value !== -1
                  ? `${value} ${user?.user_data?.currency?.abbreviation}`
                  : t("no_limit"),
              value: value,
            };

            newUser.user_data.deposit_limit_initiated = true;
          }
        });

        setDepositData({
          show: false,
          title: "",
          type: "",
          data: [],
        });
        dispatch(setLoggedUser(newUser));
        setSelectedLimit(0);
        setIsLoading(false);
        onSkip();
        onSetLimit();
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  const handleChangeInput = (e, type) => {
    if (!/^$|^\d+$/.test(e.target.value)) {
      return;
    }

    switch (type) {
      case "daily": {
        setDailyLimit(!e.target.value.length ? -1 : e.target.value);
        handleToggle("daily", t("daily_limit"));
        break;
      }
      case "weekly": {
        setWeeklyLimit(!e.target.value.length ? -1 : e.target.value);
        handleToggle("weekly", t("weekly_limit"));
        break;
      }
      case "monthly": {
        setMonthlyLimit(!e.target.value.length ? -1 : e.target.value);
        handleToggle("monthly", t("monthly_limit"));
        break;
      }
    }

    if (
      removeLimit &&
      !e.target.value.length &&
      Object.values(saferGambling).some((item) => item.value > -1)
    ) {
      setSelectedLimit(-1);
    } else {
      setSelectedLimit(e.target.value);
    }
  };

  const inputs = [
    {
      type: "daily",
      title: t("daily_limit"),
      value: dailyLimit,
    },
    {
      type: "weekly",
      title: t("weekly_limit"),
      value: weeklyLimit,
    },
    {
      type: "monthly",
      title: t("monthly_limit"),
      value: monthlyLimit,
    },
  ];

  return (
    <div
      className={classNames("depositLimit", {
        "max-width-container": !isTablet,
      })}
    >
      <PreferencesTitle
        title={t("deposit_limit")}
        backRoute={backRoute}
        marginBottomSize="sm"
        showBackOnDesktop={showBackOnDesktop}
      />
      <p className="menuText">{t("deposit_limit_settings_description")}</p>
      {inputs.map((item) =>
        isTablet ? (
          <div className="row mb-3" key={item.type}>
            <div className="col-6 subText">{item.title}</div>
            <PreferencesDropdown
              data={depositData}
              selectedItem={item.value}
              handleToggle={() => handleToggle(item.type, item.title)}
              handleSelect={(v) => {
                switch (item.type) {
                  case "daily":
                    setDailyLimit(v);
                    break;
                  case "weekly":
                    setWeeklyLimit(v);
                    break;
                  case "monthly":
                    setMonthlyLimit(v);
                    break;
                  default:
                    return;
                }
                setSelectedLimit(v);
              }}
              handleSubmit={() => handleSelect()}
              placeholder={
                item.value > 0
                  ? `${item.value} ${user?.user_data?.currency?.abbreviation}`
                  : t("no_limit")
              }
              type={item.type}
              modalOnMobile
              btnTitle={t("set_limit")}
              loader={isLoading}
            />
          </div>
        ) : (
          <div className="depositLimit-item" key={item.type}>
            <div className="subText">{item.title}</div>
            <div className="depositLimit-input-container">
              <input
                type="text"
                className="depositLimit-input"
                onChange={(e) => handleChangeInput(e, item.type)}
                value={item.value >= 0 ? item.value : ""}
                placeholder={t("not_set")}
                disabled={isLoading}
              />
              <span className="depositLimit-currency">
                {user?.user_data?.currency?.abbreviation || ""}
              </span>
            </div>
          </div>
        )
      )}
      {!isTablet && (
        <div className="row suspendButton">
          <Button
            className={
              "setLimit suspendAccBtn w-100 " +
              (selectedLimit
                ? " btnPrimary "
                : "btn finishBtn disabled setLimitBtn col-8 limitBtn")
            }
            onClick={() => handleSelect()}
            text={isLoading ? <Loader /> : t("set_limit")}
          />
        </div>
      )}
      {skipBtn && (
        <div className="row suspendButton">
          <Button
            className="w-100 borderedButton skipBtn"
            onClick={() => onSkip()}
            text={t("profile:skip")}
          />
        </div>
      )}
    </div>
  );
};

export default DepositLimitComponent;
