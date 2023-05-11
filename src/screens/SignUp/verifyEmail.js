import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../../components/loaders/Loader.css";
import "../Login/Login.css";
import Header from "../../components/header/Header";
import { apiUrl } from "../../utils/constants";
import OTPInput from "react-otp-input";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { setLoggedUser } from "../../store/actions";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";

const VerifyEmail = () => {
  const [OTP, setOTP] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(59);
  const [loader, setLoader] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    localStorage.setItem("tempHome", false);
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
    setLoader(true);
    setIsValid(true);
    let code = OTP;
    apiServices
      .get(`${apiUrl.VERIFY_EMAIL + code}`)
      .then((result) => {
        dispatch(setLoggedUser(result));
        localStorage.setItem("user", result);
        localStorage.setItem("kyc_access_token", result?.kyc_access_token);
        localStorage.setItem("userBalance", result?.user_data?.balance);
        localStorage.setItem(
          "userCurrency",
          result?.user_data?.currency?.abbreviation
        );
        if (result.user_data.email_verified) {
          if (result.user_data.required_values.phone_number) {
            navigate("/sign_up_with_phone");
          } else {
            navigate("/finish_account_setup");
          }
        } else {
          navigate("/");
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

  return (
    <>
      <Helmet>
        <title>Swifty Gaming | Verify Email</title>
      </Helmet>

      <div className="backgroundImage ">
        <Header />
        <>
          <div className=" loginForm d-grid justify-content-center p-4">
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
                />
              </div>
              <p className="codeSent mb-5">
                We have sent a code to your email at
                <strong> {user.email}</strong>
              </p>
              {minutes === 0 && seconds === 0 ? (
                <Button
                  className="btnPrimary continueBtn outline"
                  onClick={resetTimer}
                  text={"Resend Code"}
                />
              ) : (
                <Button
                  className={"continueBtn outline"}
                  style={{ cursor: "not-allowed" }}
                  disabled
                  text={
                    <>
                      Resend in {minutes}:
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </>
                  }
                />
              )}
              <Button
                className={
                  isValid ? "btnPrimary continueBtn validBtn " : "continueBtn"
                }
                onClick={verifyCode}
                text={loader ? <Loader /> : "Verify"}
              />
            </form>
          </div>
        </>
      </div>
    </>
  );
};

export default VerifyEmail;
