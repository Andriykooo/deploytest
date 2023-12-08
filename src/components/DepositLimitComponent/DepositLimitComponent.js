"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { getUserApi, setSettingsApi } from "@/utils/apiQueries";
import { useTranslations } from "next-intl";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import classNames from "classnames";
import "../../screens/DepositLimit/DepositLimit.css";
import { setLoggedUser } from "@/store/actions";

const DepositLimitComponent = ({
  backRoute,
  onSetLimit,
  showBackOnDesktop = false,
  skipBtn,
  removeLimit,
  onSkip,
  loading,
}) => {
  const dispatch = useDispatch();
  const t = useTranslations();

  const [dailyLimit, setDailyLimit] = useState(0);
  const [weeklyLimit, setWeeklyLimit] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(0);

  const [prevValue, setPrevValue] = useState({
    deposit_limit_daily: 0,
    deposit_limit_weekly: 0,
    deposit_limit_monthly: 0,
  });

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

  useEffect(() => {
    const saferGambling =
      user?.user_data?.settings?.safer_gambling?.deposit_limit;

    if (saferGambling) {
      setDailyLimit(saferGambling?.deposit_limit_daily?.value);
      setWeeklyLimit(saferGambling?.deposit_limit_weekly?.value);
      setMonthlyLimit(saferGambling?.deposit_limit_monthly?.value);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      getUserApi(dispatch).then((response) => {
        dispatch(setLoggedUser({ ...user, user_data: response }));
      });
    };
  }, []);

  const handleToggle = (type, title) => {
    setDepositData({
      ...depositData,
      show: !depositData.show,
      type: type,
      title: title,
      data: user?.user_data?.settings?.deposit_limit_options?.[
        `deposit_limit_${type}`
      ],
    });
  };

  const handleSelect = () => {
    const body = {};

    if (dailyLimit && prevValue.deposit_limit_daily !== dailyLimit) {
      body.deposit_limit_daily = dailyLimit;
    }

    if (weeklyLimit && prevValue.deposit_limit_weekly !== weeklyLimit) {
      body.deposit_limit_weekly = weeklyLimit;
    }

    if (monthlyLimit && prevValue.deposit_limit_monthly !== monthlyLimit) {
      body.deposit_limit_monthly = monthlyLimit;
    }

    setIsLoading(true);
    setSettingsApi(body, dispatch, {
      onSuccess: () => {
        Object.entries(body).forEach(([limit, limitValue]) => {
          setPrevValue((prev) => ({ ...prev, [limit]: limitValue }));
        });

        setDepositData({
          show: false,
          title: "",
          type: "",
          data: [],
        });

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
        handleToggle("daily", t("common.daily_limit"));
        break;
      }
      case "weekly": {
        setWeeklyLimit(!e.target.value.length ? -1 : e.target.value);
        handleToggle("weekly", t("common.weekly_limit"));
        break;
      }
      case "monthly": {
        setMonthlyLimit(!e.target.value.length ? -1 : e.target.value);
        handleToggle("monthly", t("common.monthly_limit"));
        break;
      }
    }

    if (
      removeLimit &&
      !e.target.value.length &&
      Object.values(
        user?.user_data?.settings?.safer_gambling?.deposit_limit
      ).some((item) => item.value > -1)
    ) {
      setSelectedLimit(-1);
    } else {
      setSelectedLimit(e.target.value);
    }
  };

  const inputs = [
    {
      type: "daily",
      title: t("common.daily_limit"),
      value: dailyLimit,
    },
    {
      type: "weekly",
      title: t("common.weekly_limit"),
      value: weeklyLimit,
    },
    {
      type: "monthly",
      title: t("common.monthly_limit"),
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
        title={t("common.deposit_limit")}
        backRoute={backRoute}
        marginBottomSize="sm"
        showBackOnDesktop={showBackOnDesktop}
      />
      <p className="menuText">
        {t("common.deposit_limit_settings_description")}
      </p>
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
                  : t("common.no_limit")
              }
              type={item.type}
              modalOnMobile
              btnTitle={t("common.set_limit")}
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
                placeholder={t("common.not_set")}
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
            className={classNames("setLimitBtn", { disable: !selectedLimit })}
            onClick={() => handleSelect()}
            text={isLoading ? <Loader /> : t("common.set_limit")}
          />
        </div>
      )}
      {skipBtn && (
        <div className="row suspendButton">
          <Button
            className="w-100 borderedButton skipBtn"
            onClick={() => onSkip()}
            text={loading ? <Loader /> : t("profile.skip")}
          />
        </div>
      )}
    </div>
  );
};

export default DepositLimitComponent;
