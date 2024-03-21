"use client";

import { addLocalStorageItem } from "@/utils/localStorage";
import { useState } from "react";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import PasswordFields from "../../components/passwordFields/PasswordFields";
import { SuccesToast } from "@/utils/alert";
import { useTranslations } from "next-intl";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import "./ChangePassword.css";
import "../Login/Login.css";

export const ChangePassword = () => {
  const t = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const router = useCustomRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const body = {
      old_password: currentPassword,
      new_password: newPassword,
    };
    apiServices
      .post(apiUrl.CHANGE_PASSWORD, body)
      .then((result) => {
        addLocalStorageItem("token", result?.token);
        addLocalStorageItem("refresh_token", result?.refresh_token);
        SuccesToast({ message: t("password_update_success") });
        setIsLoading(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        router.replace("/");
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="signInImage">
      <div className="loginForm change-password-content">
        <PasswordFields
          title={t("change_password")}
          subtitle={t("security_reasons")}
          changePassword
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          confirmPassword={confirmPassword}
          showBack={false}
        />
      </div>
    </div>
  );
};
