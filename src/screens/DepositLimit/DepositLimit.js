"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { images } from "@/utils/imagesConstant";
import "../DepositLimit/DepositLimit.css";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { SuccesToast } from "@/utils/alert";
import { setLoggedUser } from "@/store/actions";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";

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
  const isTablet = useSelector((state) => state?.isTablet)
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

    apiServices
      .put(apiUrl.SETTINGS, body)
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

  return (
    <>
      <div className="depositLimit max-width-container">
        <div className="d-flex arrow-top">
          <Image
            src={images.goBackArrow}
            alt="Go back"
            className="ms-0 mb-3"
            onClick={() => router.back()}
          />
        </div>
        <p className="menuTitle arrow-top">Deposit Limit</p>
        <p className="menuText">
          Set daily, weekly or monthly limits on how much you can deposit.
        </p>
        <div className="row mb-3">
          <div className="col-6 subText">Daily Limit</div>
          <PreferencesDropdown
            data={depositData}
            selectedItem={dailyLimit}
            handleToggle={() => handleToggle("daily", "Daily Limit")}
            handleSelect={(v) => {
              setDailyLimit(v);
              setSelectedLimit(v);
            }}
            placeholder={
              dailyLimit > -1
                ? `${dailyLimit} ${user?.user_data?.currency?.abbreviation}`
                : "No limit"
            }
            handleSubmit={handleSelect}
            type="daily"
            modalOnMobile
            btnTitle="Set limit"
            loader={isLoading}
          />
        </div>
        <div className="row  mb-3">
          <div className="col-6 subText">Weekly Limit</div>
          <PreferencesDropdown
            data={depositData}
            selectedItem={weeklyLimit}
            handleToggle={() => handleToggle("weekly", "Weekly Limit")}
            handleSelect={(v) => {
              setWeeklyLimit(v);
              setSelectedLimit(v);
            }}
            placeholder={
              weeklyLimit > -1
                ? `${weeklyLimit} ${user?.user_data?.currency?.abbreviation}`
                : "No limit"
            }
            handleSubmit={handleSelect}
            type="weekly"
            modalOnMobile
            btnTitle="Set limit"
            loader={isLoading}
          />
        </div>
        <div className="row mb-3">
          <div className="col-6 subText">Monthly Limit</div>
          <PreferencesDropdown
            data={depositData}
            selectedItem={monthlyLimit}
            handleToggle={() => handleToggle("monthly", "Monthly Limit")}
            handleSelect={(v) => {
              setMonthlyLimit(v);
              setSelectedLimit(v);
            }}
            placeholder={
              monthlyLimit > -1
                ? `${monthlyLimit} ${user?.user_data?.currency?.abbreviation}`
                : "No limit"
            }
            handleSubmit={handleSelect}
            type="monthly"
            modalOnMobile
            btnTitle="Set limit"
            loader={isLoading}
          />
        </div>
        {!isTablet && <div className="row suspendButton">
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
        </div>}
      </div>
    </>
  );
};

export default DepositLimit;
