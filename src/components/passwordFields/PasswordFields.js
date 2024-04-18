"use client";

import { useState } from "react";
import { alertToast } from "../../utils/alert";
import { validateUserPassword } from "../../utils/validation";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import { useTranslations } from "@/hooks/useTranslations";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import "./PasswordFields.css";
import classNames from "classnames";
import PreferencesTitle from "../preferencesTitle/PreferencesTitle";

const PasswordFields = ({
  changePassword,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
  isLoading,
  title,
  subtitle,
  showBack,
}) => {
  const t = useTranslations("common");
  const [validation, setValidation] = useState({
    length: false,
    specialChar: false,
    numeric: false,
  });

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
        <PreferencesTitle title={title} showBack={showBack} />
        {subtitle && <p className="passwordFieldsSubtitle">{subtitle}</p>}
        {changePassword && (
          <div className="emailValidation mb-3">
            <label className="newPasswordLabel">{t("current_password")}</label>
            <PasswordInput
              autoFocus
              value={currentPassword}
              placeholder={t("enter_current_password")}
              onChange={(e) =>
                handlePassword(e.target.value, "current-password")
              }
            />
          </div>
        )}
        <div className="emailValidation mb-3">
          <label className="newPasswordLabel">{t("new_password")}</label>
          <PasswordInput
            value={newPassword}
            placeholder={t("enter_password")}
            onChange={(e) => handlePassword(e.target.value, "new-password")}
          />
          <p
            className={classNames("newPassChecks mt-2", {
              active: validation.length,
            })}
          >
            <span className={validation.length ? "dot valid" : "dot"} />
            {t("password_length_requirement")}
          </p>
          <p
            className={classNames("newPassChecks", {
              active: validation.specialChar,
            })}
          >
            <span className={validation.specialChar ? "dot valid" : "dot"} />
            {t("password_character_requirement")}
          </p>
          <p
            className={classNames("newPassChecks", {
              active: validation.numeric,
            })}
          >
            <span className={validation.numeric ? "dot valid" : "dot"} />
            {t("password_number_requirement")}
          </p>
        </div>
        <div className="emailValidation">
          <label className="newPasswordLabel">
            {t("confirm_new_password")}
          </label>
          <PasswordInput
            value={confirmPassword}
            placeholder={t("enter_password")}
            onChange={(e) => handlePassword(e.target.value, "confirm-password")}
          />
          <p
            className={classNames("newPassChecks mt-2", {
              active: newPassword === confirmPassword && confirmPassword,
            })}
          >
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
      </div>

      <div className="authButtonsContainer mt-4">
        <Button
          className={`w-100 ${
            newPassword === confirmPassword &&
            confirmPassword &&
            validation?.length &&
            validation?.numeric &&
            validation?.specialChar
              ? "btnPrimary continueBtn validBtn"
              : "continueBtn"
          }`}
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
