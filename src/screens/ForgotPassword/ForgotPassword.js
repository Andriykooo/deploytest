"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLoginCallbacks } from "@/hooks/useLoginCallbacks";
import PasswordFields from "../../components/passwordFields/PasswordFields";
import { useSearchParams } from "next/navigation";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { alertToast } from "@/utils/alert";
import "../Login/Login.css";
import "../../components/passwordFields/PasswordFields.css";

const ForgotPassword = () => {
  const t = useTranslations("forgot_password");
  const { onLoginSuccess, onLoginError } = useLoginCallbacks({
    loginCallback: () => {},
  });
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const userPasswordToken = searchParams.get("user_password_token");

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
      });
  };

  return (
    <div className="signInImage">
      <div className="loginForm goingBack">
        <PasswordFields
          title={t("create_new_password")}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          confirmPassword={confirmPassword}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
