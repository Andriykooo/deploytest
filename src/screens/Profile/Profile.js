"use client";

import { addLocalStorageItem } from "@/utils/localStorage";
import { nextWindow } from "@/utils/nextWindow";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader, LoaderXs, PageLoader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";

import "../Profile/Profile.css";
import "../Withdraw/Withdraw.css";

import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/button/Button";
import classNames from "classnames";
import { LimitChart } from "@/components/limitChart/LimitChart";
import { LogOutIcon } from "@/utils/icons";
import { useTranslations } from "next-intl";
import { setUserStats } from "@/store/actions";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";

const InfoDiv = ({ children, clickable, onClick }) => {
  return (
    <div
      className={classNames("infoDiv", { "pe-none": clickable })}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Profile = () => {
  const logout = useLogout();
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations();

  const loggedUser = useSelector((state) => state.loggedUser);
  const isTablet = useSelector((state) => state.isTablet);
  const userStats = useSelector((state) => state.userStats);

  const gamingReminder = userStats?.gaming_reminder?.value;

  const [initStarted, setInitStarted] = useState(false);

  function getNewAccessToken() {
    setInitStarted(true);
    return apiServices
      .get(apiUrl.KYC_TOKEN)
      .then((result) => {
        const token = result?.token;
        addLocalStorageItem("kyc_access_token", token);
        router.push("/verification");
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          nextWindow.location.href = "/login";
        }
      });
  }

  const handleClickRedirect = () => {
    router.push("/sign_up_with_phone");
  };

  const handleEmailClickRedirect = () => {
    apiServices.get(apiUrl.RESEND_EMAIL).then(() => {
      router.push("/verify_email");
    });
  };

  const onLogOut = () => {
    logout();
  };

  const limits = [
    {
      name: t("common.daily_limit"),
      amount: userStats?.deposit_limit?.daily?.limit,
      used_amount: userStats?.deposit_limit?.daily?.used_amount,
      used_percent: userStats?.deposit_limit?.daily?.used_percent,
    },
    {
      name: t("common.weekly_limit"),
      amount: userStats?.deposit_limit?.weekly?.limit,
      used_amount: userStats?.deposit_limit?.weekly?.used_amount,
      used_percent: userStats?.deposit_limit?.weekly?.used_percent,
    },
    {
      name: t("common.monthly_limit"),
      amount: userStats?.deposit_limit?.monthly?.limit,
      used_amount: userStats?.deposit_limit?.monthly?.used_amount,
      used_percent: userStats?.deposit_limit?.monthly?.used_percent,
    },
  ];

  useEffect(() => {
    apiServices.get(apiUrl.USER_STATS).then((response) => {
      dispatch(setUserStats(response));
    });
  }, []);

  return (
    <div className="depositLimit">
      {userStats ? (
        <div className="pageContent profileContainer">
          {isTablet && (
            <PreferencesTitle
              title={t("common.profile")}
              marginBottomSize="lg"
            />
          )}
          <div className="profileHeader">
            <p className="profile_username">{userStats?.full_name}</p>
            <Button
              className="logoutBtn"
              type="button"
              onClick={onLogOut}
              text={
                <span>
                  {t("common.log_out")}
                  <LogOutIcon />
                </span>
              }
            />
          </div>
          <div className={classNames("infoDivs", { scrollableDivs: isTablet })}>
            {userStats?.player_id && (
              <InfoDiv>
                <p className="fieldSubTitle mb-0">{t("profile.player_id")}</p>
                <p className="fieldValue mb-0">
                  # {loggedUser?.user_data?.player_id}
                </p>
                <div className="fieldBorder"></div>
              </InfoDiv>
            )}
            <InfoDiv>
              <p className="fieldSubTitle mb-0">
                {t("profile.account_balance")}
              </p>
              <p className="fieldValue mb-0">
                {userStats?.currency}{" "}
                {formatNumberWithDecimal(userStats?.account_balance)}
              </p>
              <div className="fieldBorder"></div>
            </InfoDiv>
            <InfoDiv>
              <p className="fieldSubTitle mb-0">
                {t("profile.free_bet_credits")}
              </p>
              <p className="fieldValue mb-0">
                {userStats?.currency}{" "}
                {formatNumberWithDecimal(userStats?.free_bet_credits)}
              </p>
              <div className="fieldBorder"></div>
            </InfoDiv>
            <InfoDiv>
              <p className="fieldSubTitle mb-0">
                {t("profile.withdrawal_balance")}
              </p>
              <p className="fieldValue mb-0">
                {userStats?.currency}{" "}
                {formatNumberWithDecimal(userStats?.withdrawal_balance)}
              </p>
              <div className="fieldBorder"></div>
            </InfoDiv>
            <InfoDiv>
              <p className="fieldSubTitle mb-0">
                {t("profile.gaming_reminder")}
              </p>
              <p className="fieldValue mb-0">
                {gamingReminder > 0 ? (
                  <>
                    {gamingReminder}
                    <span className="gamingReminderMin">{` ${t(
                      "common.minutes"
                    )}`}</span>
                  </>
                ) : (
                  t("common.not_set")
                )}
              </p>
              <div className="fieldBorder"></div>
            </InfoDiv>
          </div>
          <div className="saferGambContainer">
            <p className="saferGambTitle">{t("common.safer_gambling")}</p>
            <div className="limitDivs">
              {limits.map((limit) => (
                <LimitChart
                  title={limit.name}
                  used={limit.used_amount}
                  amount={limit.amount}
                  usedPercent={limit.used_percent}
                />
              ))}
            </div>
          </div>
          <div className="dashedDiv">
            <Image alt="" src={images.dashedLine} />
          </div>
          <div className="verifyDivs">
            <InfoDiv
              clickable={userStats?.kyc_status === "verified" ? false : true}
            >
              <p className="fieldSubTitle">{t("profile.email_verification")}</p>
              {userStats?.email_verified ? (
                <>
                  <div className="verifyInfo">{userStats?.email}</div>
                  <Image
                    alt="img-validated"
                    src={images.validated}
                    className="profileValidated "
                  />
                </>
              ) : (
                <>
                  <div onClick={handleEmailClickRedirect}>
                    <div className="verifyInfo notVerified ">
                      {t("profile.email_verify_required")}
                    </div>
                    <Image
                      alt="img-arrowIcon"
                      src={images.arrowIcon}
                      className="profileArrow"
                    />
                  </div>
                </>
              )}
            </InfoDiv>
            {
              <>
                {userStats?.phone_number_verified ? (
                  <InfoDiv>
                    <p className="fieldSubTitle">{t("common.mobile_number")}</p>
                    <p className="verifyInfo">{userStats?.phone_number}</p>
                    <Image
                      alt="img-validated"
                      src={images.validated}
                      className="profileValidated"
                    />
                  </InfoDiv>
                ) : (
                  <InfoDiv>
                    <div onClick={handleClickRedirect}>
                      <p
                        className="fieldSubTitle"
                        style={{ cursor: "pointer" }}
                      >
                        {t("common.mobile_number")}
                      </p>
                      {loggedUser?.user_data?.required_values?.phone_number && (
                        <p className="verifyInfo notVerified">
                          {t("profile.mobile_verification_required")}
                        </p>
                      )}
                      <Image
                        alt="img-arrowIcon"
                        src={images.arrowIcon}
                        className="profileArrow"
                      />
                    </div>
                  </InfoDiv>
                )}
              </>
            }
            <InfoDiv
              onClick={() => {
                !(userStats?.kyc_status === "verified") && getNewAccessToken();
              }}
            >
              <p className="fieldSubTitle cursorPointer">
                {t("profile.proof_of_identify")}
              </p>
              {userStats?.kyc_status === "verified" && (
                <div>
                  <p className="verifyInfo">
                    {t("profile.account_is_verified")}
                  </p>
                  <Image
                    alt="img-validated"
                    src={images.validated}
                    className="profileValidated"
                  />
                </div>
              )}
              {userStats?.kyc_status === "rejected" && (
                <div className="d-flex">
                  <p className="verifyInfo notVerified">
                    {t("profile.account_verify_rejected")}
                  </p>

                  {initStarted ? (
                    <div>
                      <LoaderXs />
                    </div>
                  ) : (
                    <Image
                      alt="img-arrowIcon"
                      src={images.arrowIcon}
                      className="profileArrow"
                    />
                  )}
                </div>
              )}
              {userStats?.kyc_status === "pending" && (
                <div className="cursorPointer">
                  <p className="verifyInfo">
                    {t("profile.account_verify_pending")}
                  </p>

                  {initStarted && (
                    <div>
                      <LoaderXs />
                    </div>
                  )}
                </div>
              )}

              {userStats?.kyc_status === "init" && (
                <div className="cursorPointer">
                  <p className="verifyInfo">
                    {t("profile.account_verify_started")}
                  </p>

                  {initStarted && (
                    <div>
                      <LoaderXs />
                    </div>
                  )}
                </div>
              )}

              {userStats?.kyc_status === "not_started" && (
                <div>
                  <div className="d-flex">
                    <p className="verifyInfo notVerified">
                      {t("profile.account_verify_required")}
                    </p>
                    {initStarted ? (
                      <div>
                        <LoaderXs />
                      </div>
                    ) : (
                      <Image
                        alt="img-arrowIcon"
                        src={images.arrowIcon}
                        className="profileArrow"
                      />
                    )}
                  </div>
                </div>
              )}
            </InfoDiv>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Profile;
