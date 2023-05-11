import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Loader } from "../../components/loaders/Loader";
import { setLoggedUser, setSignUpPlatform, setUser } from "../../store/actions";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";

export const LoginEmail = ({
  email,
  isValid,
  checkEmail,
  isLoading,
  validateEmail,
  setEmail,
  setIsLoading,
  setIsValid,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirmDepositLimit, setShowConfirmDepositLimit] = useState(true);

  const handleSocialSubmit = (body) => {
    let device_id = uuidv4();
    apiServices
      .post(apiUrl.SIGNIN_SOCIAL, body)
      .then((response) => {
        dispatch(setLoggedUser(response));
        localStorage.setItem("access_token", response?.token);
        localStorage.setItem("refresh_token", response?.refresh_token);
        localStorage.setItem("device_id", device_id);
        localStorage.setItem("kyc_access_token", response?.kyc_access_token);
        localStorage.setItem("swifty_id", response?.swifty_id);
        localStorage.setItem("userBalance", response?.user_data?.balance);
        localStorage.setItem(
          "userCurrency",
          response?.user_data?.currency?.abbreviation
        );
        let nextUrlPath = localStorage.getItem("nextUrlPath");
        if (nextUrlPath && nextUrlPath === "casino") {
          navigate("/casino");
        } else {
          navigate("/sports");
        }
        if (
          response?.user_data?.actions &&
          response?.user_data?.actions.length > 0
        ) {
          setShowConfirmDepositLimit(true);
        } else {
          return;
        }
        if (
          showConfirmDepositLimit &&
          response?.user_data?.actions.length > 0
        ) {
          navigate("/confirm_deposit_limit");
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const responseGoogle = (response) => {
    if (response?.profileObj) {
      const googleResponse = response?.profileObj;
      setEmail(googleResponse?.email);
      setIsLoading(true);
      setIsValid(true);
      apiServices
        .get(`${apiUrl.CHECK_EMAIL}?email=${googleResponse?.email}`)
        .then((resolve) => {
          if (resolve?.email_exist) {
            let body = {
              login_platform: "google",
              social_token: response?.tokenId,
            };
            googleResponse && handleSocialSubmit(body);
          } else {
            let newUser = {
              email: googleResponse?.email,
              social_token: response?.tokenId,
              first_name: googleResponse?.givenName,
              last_name: googleResponse?.familyName,
            };
            dispatch(setUser(newUser));
            dispatch(setSignUpPlatform("google"));
            navigate("/sign_up");
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setIsValid(true);
          setEmail("");
        });
    }
  };

  const responseFacebook = (response) => {
    if (response.email) {
      setIsLoading(true);
      setEmail(response.email);
      setIsValid(true);
      apiServices
        .get(`${apiUrl.CHECK_EMAIL}?email=${response.email}`)
        .then((resolve) => {
          if (resolve?.email_exist) {
            let body = {
              login_platform: "facebook",
              social_token: response?.accessToken,
            };
            handleSocialSubmit(body);
          } else {
            let newUser = {
              email: response?.email,
              social_token: response?.accessToken,
              first_name: response?.name?.split(" ")[0],
              last_name: response?.name?.split(" ")[1],
            };
            dispatch(setUser(newUser));
            dispatch(setSignUpPlatform("facebook"));
            navigate("/sign_up");
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setIsValid(true);
          setEmail("");
          if (response.status !== "unknown" && !response.email) {
            alertToast({
              message:
                "No e-mail associated with this Facebook Account, Please Register with Email",
            });
          } else {
            alertToast({
              message:
                "Facebook login failed, please try again or contact our support",
            });
          }
        });
    }
  };

  return (
    <div className=" loginForm d-grid justify-content-center p-4">
      <p className="logInTitle">Let's start with your email</p>
      <form className="d-grid justify-content-center">
        <div className="emailValidation">
          <input
            id="email"
            type="email"
            className="login-buttons"
            placeholder="Enter your e-mail"
            value={email}
            onChange={(e) => validateEmail(e)}
            autoFocus
          />
          {isValid && (
            <img src={images.validated} className="validatedIcon" alt="Valid" />
          )}
        </div>
        <button
          onClick={(e) => {
            isValid && checkEmail(e);
          }}
          className={
            isValid ? "btnPrimary continueBtn validBtn " : "continueBtn"
          }
        >
          {isLoading ? <Loader /> : "Continue"}
        </button>
      </form>
      <p className="oneClick d-flex justify-content-center">
        Or sign in with one click
      </p>
      <div className="whiteButtonsGroup d-grid">
        <div className="loginWhiteButtons">
          <img alt="img-fbIcon" src={images.fbIcon} className="loginIconFb" />
          <div className="continueBtn white">
            <FacebookLogin
              appId="255259129680845"
              autoLoad={false}
              fields="name,email"
              callback={responseFacebook}
              className="google-btn"
            />
            <span className="social-login-title">Continue with Facebook</span>
          </div>
        </div>
        <div className="loginWhiteButtons">
          <img
            alt="img-googleIcon"
            src={images.googleIcon}
            className="loginIconGoogle"
          />
          <div className="continueBtn white">
            <GoogleLogin
              clientId="408471041229-mqj9th0v6poqii9sq6au9jctapt98k4a.apps.googleusercontent.com"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              autoLoad={false}
              cookiePolicy={"single_host_origin"}
              className="google-btn"
            />
            <span className="social-login-title">Continue with Google</span>
          </div>
        </div>
      </div>
    </div>
  );
};
