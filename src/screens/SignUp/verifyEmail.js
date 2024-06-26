"use client";

import { addLocalStorageItem } from "@/utils/localStorage";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { setLastVisitedPage, setLoggedUser } from "../../store/actions";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import classNames from "classnames";
import { useTranslations } from "@/hooks/useTranslations";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import "../Login/Login.css";
import "./VerifyEmail.css";

const incomeAccessTrackingUrl =
  process.env.NEXT_PUBLIC_INCOME_ACCESS_TRACKING_URL;

const VerifyEmail = () => {
  const t = useTranslations();
  const [OTP, setOTP] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(59);
  const [loader, setLoader] = useState(false);
  const loggedUser = useSelector((state) => state.loggedUser);
  const user = useSelector((state) => state.user);
  const router = useCustomRouter();
  const isValid = OTP.length === 4;

  const dispatch = useDispatch();

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => {
      clearInterval(myInterval);
    };
  });

  const resetTimer = (e) => {
    e.preventDefault();
    setMinutes(1);

    apiServices
      .get(apiUrl.RESEND_EMAIL)
      .then(() => {
        SuccesToast({ message: t("common.resend_code_success") });
      })
      .catch(() => {
        setLoader(false);
      });
  };

  const verifyCode = () => {
    if (loader) {
      return;
    }

    setLoader(true);

    let code = OTP;
    apiServices
      .get(`${apiUrl.VERIFY_EMAIL + code}`)
      .then((result) => {
        dispatch(setLoggedUser(result));
        addLocalStorageItem("kyc_access_token", result?.kyc_access_token);
        if (result.user_data.email_verified) {
          if (result.user_data.required_values.phone_number) {
            router.push("/sign_up_with_phone");
            dispatch(setLastVisitedPage("/finish_account_setup"));
          } else {
            router.push("/finish_account_setup");
          }
        } else {
          router.push("/");
        }
      })
      .catch(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    const numericOTP = OTP.replace(/\D/g, "");

    setOTP(numericOTP);

    if (numericOTP.length === 4) {
      verifyCode();
    }
  }, [OTP]);

  const resendIsActive = seconds === 0 && minutes === 0;

  return (
    <div className="signInImage">
      <div className="loginForm px-4">
        <form className="d-grid justify-content-center">
          <p className="logInTitle">{t("verify_email.verify_email_address")}</p>
          <div className="codeVerification">
            <OTPInput
              value={OTP}
              onChange={setOTP}
              autoFocus
              OTPLength={4}
              otpType="number"
              disabled={false}
              inputStyle={"codeInput"}
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <p className="codeSent mb-5">
            {t("verify_email.code_sent_to_email_at")}
            <strong> {user?.email}</strong>
          </p>
        </form>
        <div className="authButtonsContainer">
          <Button
            className={classNames("btnPrimary continueBtn outline", {
              "pe-none": !resendIsActive,
            })}
            onClick={resetTimer}
            disabled={!resendIsActive}
            text={
              <span>
                {resendIsActive
                  ? t("sign_up_with_phone.resend_code")
                  : `${t("common.resend_in")} ${minutes}:${
                      seconds < 10 ? `0${seconds}` : seconds
                    }`}
              </span>
            }
          />

          <Button
            disabled={!isValid}
            className={classNames("btnPrimary continueBtn", {
              validBtn: isValid,
            })}
            onClick={verifyCode}
            text={loader ? <Loader /> : t("common.verify")}
          />
        </div>
      </div>
      {incomeAccessTrackingUrl && (
        <iframe
          style={{ display: "none" }}
          src={`${incomeAccessTrackingUrl}?PlayerID=${loggedUser?.user_data?.player_id}&mid=6`}
        ></iframe>
      )}
    </div>
  );
};

export default VerifyEmail;
