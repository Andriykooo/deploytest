"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { setPromo, setSignUpPlatform, setUser } from "../../store/actions";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import {
  validateUserEmail,
  validateUserPassword,
} from "../../utils/validation";
import { LoginEmail } from "./LoginEmail";
import { LoginPassword } from "./LoginPassword";
import { useLoginCallbacks } from "@/hooks/useLoginCallbacks";
import { useTranslations } from "@/hooks/useTranslations";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import "../Login/Login.css";

const Login = ({
  setShowConfirm,
  loginCallback,
  className,
  back,
  disableRedirect,
}) => {
  const t = useTranslations();
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [newUser, setNewUser] = useState();
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { onLoginSuccess, onLoginError } = useLoginCallbacks({
    loginCallback,
    disableRedirect,
  });

  const router = useCustomRouter();
  const params = useSearchParams();

  const dispatch = useDispatch();

  const validateEmail = (e) => {
    setEmail(e.target.value);
    let emailExist = validateUserEmail(e.target.value);
    if (e.target.value) {
      if (emailExist) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } else {
      setIsValid(false);
    }
  };

  const validatePassword = (e) => {
    setPassword(e.target.value);
    let passwordValid = validateUserPassword(e.target.value);
    if (e.target.value) {
      if (passwordValid) {
        setIsPasswordValid(true);
      } else {
        setIsPasswordValid(false);
      }
    } else setIsPasswordValid(false);
  };

  const checkEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(setSignUpPlatform("email"));
    let device_id = uuidv4();
    const queryEmail = email.replace(/\+/g, "%2B").toLowerCase();

    apiServices
      .get(`${apiUrl.CHECK_EMAIL}?email=${queryEmail}`)
      .then((resolve) => {
        if (resolve?.email_exist) {
          if (resolve?.sign_up_platform === "email") {
            setIsVerified(true);
            let newUser = {};
            Object.assign(newUser, user);
            newUser["first_name"] = resolve?.first_name;
            newUser["email"] = email;
            newUser["device_id"] = device_id;
            setNewUser(newUser);
            dispatch(setUser(newUser));
          } else if (resolve?.sign_up_platform === "google") {
            alertToast({ message: t("login.google_sign_in") });
          } else if (resolve?.sign_up_platform === "facebook") {
            alertToast({ message: t("login.facebook_sign_in") });
          } else if (resolve?.sign_up_platform === "apple") {
            alertToast({ message: t("login.apple_sign_in") });
          } else {
            alertToast({
              message: t("login.wrong_platform"),
            });
          }
        } else {
          let newUser = {};
          newUser["email"] = email;
          newUser["device_id"] = device_id;
          dispatch(setUser(newUser));
          router.push("/sign_up");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const checkPassword = (e) => {
    e.preventDefault();
    let body = {
      email: newUser?.email?.toLowerCase(),
      password,
    };
    setIsLoading(true);
    apiServices
      .post(apiUrl.CHECK_PASSWORD, body)
      .then((result) => {
        onLoginSuccess(result, setShowConfirm);
        setIsLoading(false);
      })
      .catch((error) => {
        onLoginError(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (isValid && !isVerified) {
          checkEmail(event);
        } else {
          checkPassword(event);
        }
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [isValid, email, isVerified, password, isPasswordValid]);

  useEffect(() => {
    if (params.get("is_verfied")) {
      setIsVerified(true);
      setNewUser({
        ...(user || {}),
        first_name: params.get("first_name"),
        email: params.get("email"),
        device_id: uuidv4(),
      });
    }

    if (params.get("promo")) {
      dispatch(setPromo(params.get("promo")));
    }
  }, [params]);

  // useEffect(() => {
  //   window.fbAsyncInit = () => {
  //     window.FB.init({
  //       appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  //       cookie: true,
  //       xfbml: true,
  //       version: "v18.0",
  //     });
  //   };
  // }, []);

  return (
    <div className={className}>
      {/* <Script src="https://connect.facebook.net/en_US/sdk.js" />
      <Script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" />
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}> */}
      {back && (
        <Image
          alt="back"
          src={images.signInBack}
          className="signInBack"
          width={24}
          height={24}
          onClick={() => router.back()}
        />
      )}
      {isVerified ? (
        <LoginPassword
          newUser={newUser}
          password={password}
          isValid={isPasswordValid}
          checkPassword={checkPassword}
          isLoading={isLoading}
          validatePassword={validatePassword}
          goBack={() => {
            setIsVerified(false);
            setPassword("");
            setIsPasswordValid(false);
          }}
        />
      ) : (
        <LoginEmail
          email={email}
          isValid={isValid}
          checkEmail={checkEmail}
          isLoading={isLoading}
          validateEmail={validateEmail}
          setEmail={setEmail}
          setIsLoading={setIsLoading}
          setIsValid={setIsValid}
          loginCallback={loginCallback}
        />
      )}
      {/* </GoogleOAuthProvider> */}
    </div>
  );
};

export default Login;
