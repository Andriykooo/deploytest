"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../screens/DepositLimit/DepositLimit.css";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { SuccesToast } from "@/utils/alert";
import { setLoggedUser } from "@/store/actions";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import classNames from "classnames";
import { useClientTranslation } from "@/app/i18n/client";

const DepositLimitComponent = ({
  backRoute,
  onSetLimit,
  showBackOnDesktop = false,
}) => {
  const { t } = useClientTranslation("common");
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
  const user_settings = useSelector((state) => state?.user_settings);
  const isTablet = useSelector((state) => state?.isTablet);
  let user = useSelector((state) => state.loggedUser);

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
      data: user_settings?.deposit_limit_options?.[`deposit_limit_${type}`],
    });
  };

  const handleSelect = () => {
    let body = {};
    let currentLimit;
    if (depositData.type === "daily") {
      body.deposit_limit_daily = dailyLimit;
      currentLimit = saferGambling?.deposit_limit_daily?.value;
    } else if (depositData.type === "weekly") {
      body.deposit_limit_weekly = weeklyLimit;
      currentLimit = saferGambling?.deposit_limit_weekly?.value;
    } else if (depositData.type === "monthly") {
      body.deposit_limit_monthly = monthlyLimit;
      currentLimit = saferGambling?.deposit_limit_monthly?.value;
    } else {
      return;
    }

    setIsLoading(true);

    apiServices
      .put(apiUrl.SETTINGS, body)
      .then(() => {
        if (currentLimit === -1 && selectedLimit > currentLimit - 1) {
          SuccesToast({
            message: t("successfully_updated"),
          });
        } else if (selectedLimit < currentLimit && selectedLimit !== -1) {
          SuccesToast({
            message: t("successfully_updated"),
          });
        } else {
          SuccesToast({
            message: t("change_request_cooldown_message")
          });
        }
        setDepositData({
          ...depositData,
          show: false,
          title: "",
          type: "",
          data: [],
        });
        let currency = user?.user_data?.currency?.abbreviation;
        let newUser = { ...user };
        if (
          (selectedLimit < currentLimit && selectedLimit !== -1) ||
          (currentLimit === -1 && selectedLimit > currentLimit - 1)
        ) {
          if (depositData.type === "daily") {
            newUser.user_data.settings.safer_gambling.deposit_limit.deposit_limit_daily =
            {
              name:
                dailyLimit !== -1 ? `${dailyLimit} ${currency}` : t("no_limit"),
              value: dailyLimit,
            };
          } else if (depositData.type === "weekly") {
            newUser.user_data.settings.safer_gambling.deposit_limit.deposit_limit_weekly =
            {
              name:
                weeklyLimit !== -1
                  ? `${weeklyLimit} ${currency}`
                  : t("no_limit"),
              value: weeklyLimit,
            };
          } else if (depositData.type === "monthly") {
            newUser.user_data.settings.safer_gambling.deposit_limit.deposit_limit_monthly =
            {
              name:
                monthlyLimit !== -1
                  ? `${monthlyLimit} ${currency}`
                  : t("no_limit"),
              value: monthlyLimit,
            };
          }
        }
        dispatch(setLoggedUser(newUser));
        onSetLimit();
        setSelectedLimit(0);
      })
      .catch(() => { })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChangeInput = (e, type) => {
    if (!/^$|^\d+$/.test(e.target.value)) {
      return;
    }

    switch (type) {
      case "daily": {
        setDailyLimit(e.target.value);
        handleToggle("daily", t("daily_limit"));
        break;
      }
      case "weekly": {
        setWeeklyLimit(e.target.value);
        handleToggle("weekly", t("weekly_limit"));
        break;
      }
      case "monthly": {
        setMonthlyLimit(e.target.value);
        handleToggle("monthly", t("monthly_limit"));
        break;
      }
    }
    setSelectedLimit(e.target.value);
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
      <p className="menuText">
        {t("deposit_limit_settings_description")}
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
                value={item.value > 0 ? item.value : ""}
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
                : "btn finishBtn disabled setLimitBtn col-8")
            }
            onClick={() => selectedLimit && handleSelect()}
            text={isLoading ? <Loader /> : t("set_limit")}
          />
        </div>
      )}
    </div>
  );
};

export default DepositLimitComponent;
