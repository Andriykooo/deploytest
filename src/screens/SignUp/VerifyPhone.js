"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import classNames from "classnames";
import Link from "next/link";
import "../Login/Login.css";
import { setLoggedUser } from "@/store/actions";

export const VerifyPhone = () => {
  const router = useRouter();
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
        SuccesToast({ message: "Resend code succesfully" });
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
    <div className="backgroundImage">
      <div className="loginForm px-4">
        <p className="logInTitle">Verify your phone number</p>
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
            We have sent a code to the number
            <br />
            <strong>
              {user?.user_data?.phone_prefix} {user?.user_data?.phone_number}{" "}
            </strong>
          </p>
          <p className="mb-5">
            <Link href={"/sign_up_with_phone"} className="codeSent">
              Wrong number? Click here to change.
            </Link>
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
                    Resend
                    {!resendIsActive &&
                      ` in ${minutes}:${
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
              text={loader ? <Loader /> : "Verify"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
