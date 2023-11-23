"use client";

import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import classNames from "classnames";
import "../Login/Login.css";
import { setLoggedUser } from "@/store/actions";
import { useTranslations } from "next-intl";
import { CustomLink } from "@/components/Link/Link";
import { useCustomRouter } from "@/hooks/useCustomRouter";

export const VerifyPhone = () => {
  const t = useTranslations();
  const router = useCustomRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.loggedUser);

  const [OTP, setOTP] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(59);
  const [loader, setLoader] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);

  const isValid = OTP.length === 4;
  const resendIsActive = seconds === 0 && minutes === 0;

  const resetTimer = (e) => {
    setResendLoader(true);
    e.preventDefault();
    setMinutes(1);

    apiServices
      .get(apiUrl.RESEND_CODE)
      .then(() => {
        SuccesToast({ message: t("common.resend_code_success") });
      })
      .finally(() => {
        setResendLoader(false);
      });
  };

  const verifyCode = () => {
    if (loader) {
      return;
    }

    setLoader(true);

    let code = OTP;
    apiServices
      .get(`${apiUrl.VERIFY_PHONE + code}`)
      .then(() => {
        dispatch(
          setLoggedUser({
            ...user,
            user_data: {
              ...user.user_data,
              phone_number_verified: true,
            },
          })
        );
        router.push("/finish_account_setup");
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    const myInterval = setInterval(() => {
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

  useEffect(() => {
    const numericOTP = OTP.replace(/\D/g, "");

    setOTP(numericOTP);

    if (numericOTP.length === 4) {
      verifyCode();
    }
  }, [OTP]);

  return (
    <div className="signInImage">
      <div className="loginForm px-4">
        <p className="logInTitle">{t("verify_phone.verify_phone_number")}</p>
        <form className="d-grid justify-content-center">
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
          <p className="codeSent">
            {t("verify_phone.code_sent_to_number")}
            <br />
            <strong>
              {user?.user_data?.phone_prefix} {user?.user_data?.phone_number}{" "}
            </strong>
          </p>
          <p className="mb-5">
            <CustomLink href={"/sign_up_with_phone"} className="codeSent">
              {t("verify_phone.wrong_number_change_link")}
            </CustomLink>
          </p>
          <div className="authButtonsContainer">
            <Button
              className={classNames("btnPrimary continueBtn outline", {
                validBtn: resendIsActive,
              })}
              onClick={resetTimer}
              disabled={!resendIsActive}
              text={
                resendLoader ? (
                  <Loader />
                ) : (
                  <span>
                    {resendIsActive
                      ? t("common.resend")
                      : `${t("common.resend_in")} ${minutes}:${
                          seconds < 10 ? `0${seconds}` : seconds
                        }`}
                  </span>
                )
              }
            />
            <Button
              type="submit"
              disabled={!isValid}
              className={classNames("btnPrimary continueBtn", {
                validBtn: isValid,
              })}
              onClick={verifyCode}
              text={loader ? <Loader /> : t("common.verify")}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
