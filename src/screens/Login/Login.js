"use client";

import { addLocalStorageItem } from "@/utils/localStorage";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { setSignUpPlatform, setUser } from "../../store/actions";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import {
  validateUserEmail,
  validateUserPassword,
} from "../../utils/validation";
import "../Login/Login.css";
import { LoginEmail } from "./LoginEmail";
import { LoginPassword } from "./LoginPassword";
import { useLoginCallbacks } from "@/hooks/useLoginCallbacks";
import { useClientTranslation } from "@/app/i18n/client";

const Login = ({ setShowConfirm }) => {
  const { t } = useClientTranslation(["login", "common"]);
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [newUser, setNewUser] = useState();
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { onLoginSuccess, onLoginError } = useLoginCallbacks();

  const router = useRouter();
  const params = useSearchParams();

  const dispatch = useDispatch();
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

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
            alertToast({ message: t("google_sign_in") });
          } else if (resolve?.sign_up_platform === "facebook") {
            alertToast({ message: t("facebook_sign_in") });
          } else if (resolve?.sign_up_platform === "apple") {
            alertToast({ message: t("apple_sign_in") });
          } else {
            alertToast({
              message: t("wrong_platform"),
            });
          }
        } else {
          let newUser = {};
          Object.assign(newUser, user);
          newUser["email"] = email;
          newUser["device_id"] = device_id;
          addLocalStorageItem("device_id", device_id);
          dispatch(setUser(newUser));
          addLocalStorageItem("IsLogged", "not_logged");
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
  }, [params]);

  return (
    <div className="backgroundImage">
      {isVerified ? (
        <LoginPassword
          newUser={newUser}
          passwordShown={passwordShown}
          password={password}
          isValid={isPasswordValid}
          togglePassword={togglePassword}
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
        />
      )}
    </div>
  );
};

export default Login;
