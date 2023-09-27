"use client";

import { useState } from "react";
import { useClientTranslation } from "@/app/i18n/client";
import { useLoginCallbacks } from "@/hooks/useLoginCallbacks";
import PasswordFields from "../../components/passwordFields/PasswordFields";
import "react-toastify/dist/ReactToastify.css";
import "../ForgotPassword/ForgotPassword.css";
import '../../components/passwordFields/PasswordFields.css'

const ForgotPassword = () => {
  const { t } = useClientTranslation("forgot_password");
  const { onLoginSuccess, onLoginError } = useLoginCallbacks();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let userPasswordToken = nextWindow.location?.search.split(
      "?user_password_token="
    )[1];
    if (!userPasswordToken) {
      alertToast({
        message: t("no_reset_password_token_available"),
      });
      return false;
    }
    setIsLoading(true);

    const body = { new_password: newPassword };

    apiServices
      .post(`${apiUrl.PASSWORD_RESET}${userPasswordToken}`, body)
      .then((result) => {
        onLoginSuccess(result);
        setIsLoading(false);
      })
      .catch((error) => {
        onLoginError(error);
        setIsLoading(false);
      })
  };


  return (
    <>
      <div className="backgroundImage forgotPassword">
        <div className="loginForm p-4">
          <p className="logInTitle">{t("create_new_password")}</p>
          <PasswordFields 
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            confirmPassword={confirmPassword}
          />
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
