"use client";

import {
  refreshCommunicationSocket,
  refreshGamingSocket,
} from "@/context/socket";
import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import { nextWindow } from "@/utils/nextWindow";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import {
  setErrorCode,
  setLoggedUser,
  setSignUpPlatform,
  setUser,
} from "../../store/actions";
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
import Cookies from "js-cookie";
import { getUserApi } from "@/utils/apiQueries";
import moment from "moment";

const Login = ({ setShowConfirm }) => {
  const user = useSelector((state) => state.user);
  const logged = useSelector((state) => state.logged);
  const [email, setEmail] = useState("");
  const [newUser, setNewUser] = useState();
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

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
            setIsLoading(false);
          } else if (resolve?.sign_up_platform === "google") {
            alertToast({ message: "Please sign in with Google" });
          } else if (resolve?.sign_up_platform === "facebook") {
            alertToast({ message: "Please sign in with Facebook" });
          } else if (resolve?.sign_up_platform === "apple") {
            alertToast({ message: "Please sign in with Apple" });
          } else {
            alertToast({
              message: "Wrong platform! Please sign in with a different one",
            });
          }
          setIsLoading(false);
        } else {
          let newUser = {};
          Object.assign(newUser, user);
          newUser["email"] = email;
          newUser["device_id"] = device_id;
          addLocalStorageItem("device_id", device_id);
          dispatch(setUser(newUser));
          addLocalStorageItem("IsLogged", "not_logged");
          router.push("/sign_up");
          setIsLoading(true);
        }
      })
      .catch(() => {
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
      .then((response) => {
        let userLogged = {};
        let device_id = uuidv4();
        Object.assign(userLogged, logged);
        userLogged["player_id"] = response?.user_data.player_id;
        addLocalStorageItem("access_token", response?.token);
        addLocalStorageItem("refresh_token", response?.refresh_token);
        addLocalStorageItem("device_id", device_id);
        addLocalStorageItem("kyc_access_token", response?.kyc_access_token);
        addLocalStorageItem("swifty_id", response?.swifty_id);
        let nextUrlPath = getLocalStorageItem("nextUrlPath");

        refreshCommunicationSocket(response?.token);
        refreshGamingSocket(response?.token);

        Cookies.set("country", response.user_data.country);

        setIsLoading(false);

        getUserApi(dispatch).then((userData) => {
          dispatch(setLoggedUser({ ...response, user_data: userData }));
          if (!userData.email_verified) {
            router.push("/verify_email");
          } else if (params.get("redirect")) {
            router.push("/" + params.get("redirect"));
          } else if (nextUrlPath && nextUrlPath === "casino") {
            router.push("/casino");
          } else {
            router.push("/home");
          }

          if (
            response?.user_data?.actions &&
            response?.user_data?.actions.length > 0
          ) {
            setShowConfirm(true);
          } else {
            return;
          }
        });
      })
      .catch((error) => {
        const data = error.response.data.error;

        if (data.code === 1104) {
          dispatch(
            setErrorCode({
              code: data.code,
              message: data.message,
            })
          );
        }

        if (data.code === 1063) {
          dispatch(
            setErrorCode({
              code: data.code,
              message: data.message.replace(
                "{date}",
                moment(data.extra_data.suspended_until).format("DD MMMM YYYY")
              ),
            })
          );
        }

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

  return (
    <div className="backgroundImage">
      {isVerified ? (
        <>
          <LoginPassword
            newUser={newUser}
            passwordShown={passwordShown}
            password={password}
            isValid={isPasswordValid}
            togglePassword={togglePassword}
            checkPassword={checkPassword}
            isLoading={isLoading}
            validatePassword={validatePassword}
          />
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Login;
