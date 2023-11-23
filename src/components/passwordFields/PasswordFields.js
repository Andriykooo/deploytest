"use client";

import Image from "next/image";
import { useState } from "react";
import { alertToast } from "../../utils/alert";
import { images } from "../../utils/imagesConstant";
import { validateUserPassword } from "../../utils/validation";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import "react-toastify/dist/ReactToastify.css";
import "./PasswordFields.css";
import { useTranslations } from "next-intl";
const PasswordFields = ({
  changePassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
  isLoading,
  title
}) => {
  const t = useTranslations("common");
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
            message: t("max_password_length_256_chars"),
          });
        }
        break;
      case "new-password":
        if (value.length <= 256) {
          setNewPassword(value);
          setValidation(validateUserPassword(value));
        } else {
          alertToast({
            message: t("max_password_length_256_chars"),
          });
        }
        break;
      case "confirm-password":
        if (value.length <= 256) {
          setConfirmPassword(value);
        } else {
          alertToast({
            message: t("max_password_length_256_chars"),
          });
        }
        break;
      default:
        return;
    }
  };

  return (
    <>
      <div>
        <p className="logInTitle">{title}</p>
        {changePassword && (
          <div className="emailValidation">
            <label className="newPasswordLabel">{t("current_password")}</label>
            <div className="password-container position-relative">
              <input
                id="password"
                type={showPassword["currentpassword"] ? "text" : "password"}
                className="password_input"
                placeholder={t("enter_current_password")}
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
          <label className="newPasswordLabel">{t("password")}</label>
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
            {t("password_length_requirement")}
          </p>
          <p className="newPassChecks">
            <span className={validation.specialChar ? "dot valid" : "dot"} />
            {t("password_character_requirement")}
          </p>
          <p className="newPassChecks">
            <span className={validation.numeric ? "dot valid" : "dot"} />
            {t("password_number_requirement")}
          </p>
        </div>
        <div className="emailValidation">
          <label className="newPasswordLabel">{t("confirm_password")}</label>
          <div className="password-container">
            <input
              id="config_password"
              type={showPassword["confirmpassword"] ? "text" : "password"}
              className="password_input"
              placeholder={t("enter_password")}
              onChange={(e) => handlePassword(e.target.value, "confirm-password")}
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
          {t("passwords_must_match")}
        </p>
      </div>
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
          text={<>{isLoading ? <Loader /> : t("confirm")}</>}
        />
      </div>
    </>
  );
};

export default PasswordFields;
