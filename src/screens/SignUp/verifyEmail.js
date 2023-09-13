"use client";

import { addLocalStorageItem } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import "../../components/loaders/Loader.css";
import { setLoggedUser } from "../../store/actions";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import "../Login/Login.css";
import Cookies from "js-cookie";
import classNames from "classnames";

const VerifyEmail = () => {
  const [OTP, setOTP] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(59);
  const [loader, setLoader] = useState(false);
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const isValid = OTP.length === 4;

  const dispatch = useDispatch();
  useEffect(() => {
    addLocalStorageItem("tempHome", false);
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
    let url = apiUrl.RESEND_EMAIL;
    apiServices
      .get(url)
      .then(() => {
        SuccesToast({ message: "Resend code succesfully" });
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
          } else {
            router.push("/finish_account_setup");
          }
          Cookies.set("country", result.user_data.country);
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
    <div className="backgroundImage">
      <div className="loginForm d-grid justify-content-center px-4">
        <p className="logInTitle">Verify your e-mail address</p>
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
          <p className="codeSent mb-5">
            We have sent a code to your email at
            <strong> {user?.email}</strong>
          </p>
          <div className="authButtonsContainer">
            <Button
              className={classNames("btnPrimary continueBtn outline", {
                validBtn: resendIsActive,
              })}
              onClick={resetTimer}
              disabled={!resendIsActive}
              text={
                <span>
                  Resend
                  {!resendIsActive &&
                    ` in ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
                </span>
              }
            />
            <Button
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

export default VerifyEmail;
