import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import Header from "../../components/header/Header";
import { setLoggedUser, setSignUpPlatform, setUser } from "../../store/actions";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import {
  validateUserEmail,
  validateUserPassword,
} from "../../utils/validation";
import { LoginEmail } from "./LoginEmail";
import { LoginPassword } from "./LoginPassword";

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
  const navigate = useNavigate();
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
            sessionStorage.setItem("loggedUserInTime", new Date());
          } else {
            if (resolve?.sign_up_platform === "google") {
              alertToast({ message: "Please sign in with Google" });
            } else if (resolve?.sign_up_platform === "facebook") {
              alertToast({ message: "Please sign in with Facebook" });
            } else if (resolve?.sign_up_platform === "apple") {
              alertToast({ message: "Please sign in with Apple" });
            }
            setIsLoading(false);
          }
        } else {
          let newUser = {};
          Object.assign(newUser, user);
          newUser["email"] = email;
          newUser["device_id"] = device_id;
          localStorage.setItem("device_id", device_id);
          dispatch(setUser(newUser));
          localStorage.setItem("IsLogged", "not_logged");
          navigate("/sign_up");
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
      email: newUser.email.toLowerCase(),
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
        sessionStorage.setItem("loggedUserInTime", new Date());
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
          setShowConfirm(true);
        } else {
          return;
        }
        setIsLoading(false);
        window.sessionStorage.setItem("loggedUserInTime", new Date());
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const verifyLink = () => {
    navigate("/email_sent");
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
    dispatch(setLoggedUser(null));
  }, []);

  return (
    <>
      <Helmet>
        <title>Swifty Gaming | Log In</title>
      </Helmet>
      <div className="backgroundImage ">
        <Header />
        {isVerified ? (
          <>
            <LoginPassword
              newUser={newUser}
              passwordShown={passwordShown}
              password={password}
              isValid={isPasswordValid}
              togglePassword={togglePassword}
              verifyLink={verifyLink}
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
    </>
  );
};

export default Login;
