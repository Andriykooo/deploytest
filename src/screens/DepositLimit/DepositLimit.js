"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../DepositLimit/DepositLimit.css";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import { SuccesToast } from "@/utils/alert";
import { setLoggedUser } from "@/store/actions";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import { setSettingsApi } from "@/utils/apiQueries";

const DepositLimit = () => {
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
  const router = useRouter();
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

    setSettingsApi(body, dispatch)
      .then(() => {
        if (currentLimit === -1 && selectedLimit > currentLimit - 1) {
          SuccesToast({
            message: "Successfully updated!",
          });
        } else if (selectedLimit < currentLimit && selectedLimit !== -1) {
          SuccesToast({
            message: "Successfully updated!",
          });
        } else {
          SuccesToast({
            message:
              "Changes have been requested. There is a 24-hour cooldown period before applying.",
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
                dailyLimit !== -1 ? `${dailyLimit} ${currency}` : "No Limit",
              value: dailyLimit,
            };
          } else if (depositData.type === "weekly") {
            newUser.user_data.settings.safer_gambling.deposit_limit.deposit_limit_weekly =
            {
              name:
                weeklyLimit !== -1
                  ? `${weeklyLimit} ${currency}`
                  : "No Limit",
              value: weeklyLimit,
            };
          } else if (depositData.type === "monthly") {
            newUser.user_data.settings.safer_gambling.deposit_limit.deposit_limit_monthly =
            {
              name:
                monthlyLimit !== -1
                  ? `${monthlyLimit} ${currency}`
                  : "No Limit",
              value: monthlyLimit,
            };
          }
        }
        dispatch(setLoggedUser(newUser));
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
      case 'daily': {
        setDailyLimit(e.target.value);
        handleToggle("daily", "Daily Limit")
        break;
      }
      case 'weekly': {
        setWeeklyLimit(e.target.value);
        handleToggle("weekly", "Weekly Limit")
        break;
      }
      case 'monthly': {
        setMonthlyLimit(e.target.value);
        handleToggle("monthly", "Monthly Limit")
        break;
      }
    }
    setSelectedLimit(e.target.value);
  }

  const inputs = [
    {
      type: 'daily',
      title: 'Daily Limit',
      value: dailyLimit,
    },
    {
      type: 'weekly',
      title: 'Weekly Limit',
      value: weeklyLimit,
    },
    {
      type: 'monthly',
      title: 'Monthly Limit',
      value: monthlyLimit,
    },
  ];

  return (
    <>
      <div className="depositLimit max-width-container">
        <PreferencesTitle
          title="Deposit Limit"
          backRoute="/profile/safer_gambling"
          marginBottomSize="sm"
          showBackOnDesktop
        />
        <p className="menuText">
          Set daily, weekly or monthly limits on how much you can deposit.
        </p>
        {inputs.map((item) => isTablet ? (
          <div className="row mb-3" key={item.type}>
            <div className="col-6 subText">{item.title}</div>
            <PreferencesDropdown
              data={depositData}
              selectedItem={dailyLimit}
              handleToggle={() => handleToggle(item.type, item.title)}
              handleSelect={(v) => {
                setDailyLimit(v);
                switch (item.type) {
                  case 'daily': {
                    setDailyLimit(e.target.value);
                    break;
                  }
                  case 'weekly': {
                    setWeeklyLimit(e.target.value);
                    break;
                  }
                  case 'monthly': {
                    setMonthlyLimit(e.target.value);
                    break;
                  }
                }
                setSelectedLimit(v);
              }}
              placeholder={
                item.value > -1
                  ? `${item.value} ${user?.user_data?.currency?.abbreviation}`
                  : "No limit"
              }
              handleSubmit={handleSelect}
              type="daily"
              modalOnMobile
              btnTitle="Set limit"
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
                value={item.value > 0 ? item.value : ''}
                placeholder="Not set"
                disabled={isLoading}
              />
              <span className="depositLimit-currency">{user?.user_data?.currency?.abbreviation || ''}</span>
            </div>
          </div>
        ))}
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
              text={isLoading ? <Loader /> : "Set limit"}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DepositLimit;
