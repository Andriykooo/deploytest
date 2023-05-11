import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/header/Header";
import { alertToast } from "../../utils/alert";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { validateUserPassword } from "../../utils/validation";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setValidation] = useState({
    length: false,
    specialChar: false,
    numeric: false,
  });
  const [showPassword, setShowPassword] = useState({
    newpassword: false,
    confirmpassword: false,
  });
  const navigate = useNavigate();
  const uuid = uuidv4();

  const togglePassword = (type) => {
    switch (type) {
      case "newpassword":
        setShowPassword({
          ...showPassword,
          newpassword: !showPassword.newpassword,
        });
        break;
      case "confirmpassword":
        setShowPassword({
          ...showPassword,
          confirmpassword: !showPassword.confirmpassword,
        });
        break;
      default:
        return;
    }
  };

  const handlePassword = (value, type) => {
    switch (type) {
      case "new-password":
        if (value.length <= 256) {
          setNewPassword(value);
          setValidation(validateUserPassword(value));
        } else {
          alertToast({
            message: "Maximum length of password must be 256 characters",
          });
        }
        break;
      case "confirm-password":
        if (value.length <= 256) {
          setConfirmPassword(value);
        } else {
          alertToast({
            message: "Maximum length of password must be 256 characters",
          });
        }
        break;
      default:
        return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let userPasswordToken = window.location?.search.split(
      "?user_password_token="
    )[1];
    if (!userPasswordToken) {
      alertToast({
        message: "No reset password token available",
      });
      return false;
    }
    setIsLoading(true);
    const body = { new_password: newPassword };
    apiServices
      .post(`${apiUrl.NEXT_PUBLIC_PASSWORD_RESET}${userPasswordToken}`, body)
      .then((result) => {
        localStorage.setItem("access_token", result?.token);
        localStorage.setItem("refresh_token", result?.refresh_token);
        localStorage.setItem("device_id", uuid);
        setTimeout(() => {
          navigate("/");
        }, 500);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>Swifty Gaming | Forgot Password</title>
      </Helmet>
      <Header />
      <div className="backgroundImage">
        <div className=" loginForm d-grid justify-content-center p-4">
          <p className="logInTitle">Create new password</p>
          <div className="emailValidation">
            <label className="newPasswordLabel">Password</label>
            <div className="password-container">
              <input
                id="password"
                type={showPassword["newpassword"] ? "text" : "password"}
                className="login-buttons"
                placeholder="Enter a password"
                onChange={(e) => handlePassword(e.target.value, "new-password")}
              />
              <img
                onClick={() => togglePassword("newpassword")}
                src={images.showPassIcon}
                className="showPasswordIcon"
                alt="Valid"
              />
            </div>
            <p className="newPassChecks">
              <span className={validation.length ? "dot valid" : "dot"} />
              Must be at least 8 characters
            </p>
            <p className="newPassChecks">
              <span className={validation.specialChar ? "dot valid" : "dot"} />
              Must include a special character
            </p>
            <p className="newPassChecks">
              <span className={validation.numeric ? "dot valid" : "dot"} />
              Must include a number
            </p>
          </div>
          <div className="emailValidation">
            <label className="newPasswordLabel">Confirm Password</label>
            <div className="password-container">
              <input
                id="config_password"
                type={showPassword["confirmpassword"] ? "text" : "password"}
                className="login-buttons"
                placeholder="Enter a password"
                onChange={(e) =>
                  handlePassword(e.target.value, "confirm-password")
                }
              />
              <img
                onClick={() => togglePassword("confirmpassword")}
                src={images.showPassIcon}
                className="showPasswordIconBtm"
                alt="Valid"
              />
            </div>
          </div>
          <p className="newPassChecks">
            <span
              className={
                newPassword === confirmPassword && confirmPassword
                  ? "dot valid"
                  : "dot"
              }
            />
            Both passwords must match
          </p>
          <Button
            className={
              newPassword === confirmPassword &&
              confirmPassword &&
              validation?.length &&
              validation?.numeric &&
              validation?.specialChar
                ? "btnPrimary continueBtn validBtn"
                : "continueBtn"
            }
            onClick={(e) => {
              handleSubmit(e);
            }}
            text={<>{isLoading ? <Loader /> : "Confirm"}</>}
          />
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
