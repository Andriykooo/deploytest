"use client";

import Image from "next/image";
import { useState } from "react";
import { alertToast } from "../../utils/alert";
import { images } from "../../utils/imagesConstant";
import { validateUserPassword } from "../../utils/validation";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import "react-toastify/dist/ReactToastify.css";
import './PasswordFields.css'

const PasswordFields = ({
  changePassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
  isLoading,
}) => {
  const [validation, setValidation] = useState({
    length: false,
    specialChar: false,
    numeric: false,
  });
  const [showPassword, setShowPassword] = useState({
    currentpassword: false,
    newpassword: false,
    confirmpassword: false,
  });

  const togglePassword = (type) => {
    switch (type) {
      case "currentpassword":
        setShowPassword({
          ...showPassword,
          currentpassword: !showPassword.currentpassword,
        });
        break;
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
      case "current-password":
        if (value.length <= 256) {
          setCurrentPassword(value);
        } else {
          alertToast({
            message: "Maximum length of password must be 256 characters",
          });
        }
        break;
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

  return (
    <>
      {changePassword && (
        <div className="emailValidation">
          <label className="newPasswordLabel">Current Password</label>
          <div className="password-container position-relative">
            <input
              id="password"
              type={showPassword["currentpassword"] ? "text" : "password"}
              className="password_input"
              placeholder="Enter current password"
              onChange={(e) =>
                handlePassword(e.target.value, "current-password")
              }
            />
            <Image
              onClick={() => togglePassword("currentpassword")}
              src={images.showPassIcon}
              className="showPasswordIcon"
              alt="Valid"
              width={20}
              height={14}
            />
          </div>
        </div>
      )}
      <div className="emailValidation">
        <label className="newPasswordLabel">Password</label>
        <div className="password-container">
          <input
            id="password"
            type={showPassword["newpassword"] ? "text" : "password"}
            className="password_input"
            placeholder="Enter a password"
            onChange={(e) => handlePassword(e.target.value, "new-password")}
          />
          <Image
            onClick={() => togglePassword("newpassword")}
            src={images.showPassIcon}
            className="showPasswordIcon"
            alt="Valid"
            width={20}
            height={14}
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
            className="password_input"
            placeholder="Enter a password"
            onChange={(e) =>
              handlePassword(e.target.value, "confirm-password")
            }
          />
          <Image
            onClick={() => togglePassword("confirmpassword")}
            src={images.showPassIcon}
            className="showPasswordIcon"
            alt="Valid"
            width={20}
            height={14}
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
      <div className="authButtonsContainer">
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
    </>
  );
};

export default PasswordFields;
