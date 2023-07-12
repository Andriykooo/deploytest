"use client";

import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import Header from "../../components/header/Header";
import { SetDepositLimit } from "../../components/modal/SetDepositLimit";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";
import { images } from "../../utils/imagesConstant";
import "../DepositLimit/DepositLimit.css";

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

  const user_settings = useSelector((state) => state?.user_settings);
  const saferGambling = useSelector(
    (state) =>
      state.loggedUser?.user_data?.settings?.safer_gambling?.deposit_limit
  );
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setLoader(true);

    setTimeout(() => {
      setDailyLimit(saferGambling?.deposit_limit_daily?.value);
      setWeeklyLimit(saferGambling?.deposit_limit_weekly?.value);
      setMonthlyLimit(saferGambling?.deposit_limit_monthly?.value);
      setLoader(false);
    }, 1500);
  }, [user_settings]);
  let active = "active";

  return (
    <>
      <Header />
      <div className="backgroundLinear ">
        <div className="d-none d-lg-block">
          <ProfileMenu sideBarMenu active={active} page="safer_gambling" />
        </div>
        <div className="depositLimit max-width-container">
          <div className="d-flex arrow-top">
            <Image
              src={images.goBackArrow}
              alt="Go back"
              className="goBackArrow ms-0 mb-3"
              onClick={() => router.back()}
            />
          </div>
          <p className="menuTitle arrow-top">Deposit Limit</p>
          <p className="menuText">
            Set daily, weekly or monthly limits on how much you can deposit.
          </p>
          <div className="row mb-3">
            <div className="col-6 subText">Daily Limit</div>
            <div className="col-6 selectDepositDiv ">
              <Button
                type="button"
                className="setLimit"
                onClick={() => {
                  setDepositData({
                    ...depositData,
                    show: true,
                    type: "daily",
                    title: "Daily Limit",
                    data: user_settings?.deposit_limit_options
                      ?.deposit_limit_daily,
                  });
                }}
                text={
                  <>
                    {dailyLimit === "-1" ? (
                      "No Limit"
                    ) : loader ? (
                      <div className="d-flex justify-content-between">
                        <Skeleton
                          variant="rectangular"
                          className="my-2 depositSkeleton"
                          animation="wave"
                        />
                      </div>
                    ) : (
                      saferGambling?.deposit_limit_daily?.name
                    )}
                    <Image
                      src={images.arrowIcon}
                      className="depositLimitArrow"
                      alt="Click"
                    />
                  </>
                }
              />
            </div>
          </div>
          <div className="row  mb-3">
            <div className="col-6 subText">Weekly Limit</div>
            <div className="col-6 selectDepositDiv">
              <Button
                type="button"
                className="setLimit"
                onClick={() => {
                  setDepositData({
                    ...depositData,
                    show: true,
                    type: "weekly",
                    title: "Weekly Limit",
                    data: user_settings?.deposit_limit_options
                      ?.deposit_limit_weekly,
                  });
                }}
                text={
                  <>
                    {weeklyLimit === "-1" ? (
                      "No Limit"
                    ) : loader ? (
                      <div className="d-flex justify-content-between">
                        <Skeleton
                          variant="rectangular"
                          className="my-2 depositSkeleton"
                          animation="wave"
                        />
                      </div>
                    ) : (
                      saferGambling?.deposit_limit_weekly?.name
                    )}
                    <Image
                      src={images.arrowIcon}
                      className="depositLimitArrow"
                      alt="Click"
                    />
                  </>
                }
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-6 subText">Monthly Limit</div>
            <div className="col-6 selectDepositDiv">
              <Button
                type="button"
                className={"setLimit"}
                onClick={() => {
                  setDepositData({
                    ...depositData,
                    show: true,
                    type: "monthly",
                    title: "Monthly Limit",
                    data: user_settings?.deposit_limit_options
                      ?.deposit_limit_monthly,
                  });
                }}
                text={
                  <>
                    {monthlyLimit === "-1" ? (
                      "No Limit"
                    ) : loader ? (
                      <div className="d-flex justify-content-between">
                        <Skeleton
                          variant="rectangular"
                          className="my-2 depositSkeleton"
                          animation="wave"
                        />
                      </div>
                    ) : (
                      saferGambling?.deposit_limit_monthly?.name
                    )}
                    <Image
                      src={images.arrowIcon}
                      className="depositLimitArrow"
                      alt="Click"
                    />
                  </>
                }
              />
            </div>
          </div>
        </div>
        {depositData.show && (
          <>
            <div className="modal-overlay">
              <SetDepositLimit
                depositData={depositData}
                setDepositData={setDepositData}
                setSelectedLimit={setSelectedLimit}
                selectedLimit={selectedLimit}
                dailyLimit={dailyLimit}
                setDailyLimit={setDailyLimit}
                weeklyLimit={weeklyLimit}
                setWeeklyLimit={setWeeklyLimit}
                monthlyLimit={monthlyLimit}
                setMonthlyLimit={setMonthlyLimit}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DepositLimit;
