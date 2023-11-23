"use client";

import { addLocalStorageItem } from "@/utils/localStorage";
import { useState } from "react";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { useRouter } from "next/navigation";
import PasswordFields from "../../components/passwordFields/PasswordFields";
import { SuccesToast } from "@/utils/alert";
import "react-toastify/dist/ReactToastify.css";
import "./ChangePassword.css";
import { useTranslations } from "next-intl";
import { useCustomRouter } from "@/hooks/useCustomRouter";

const ChangePasswordMobile = () => {
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
        router.replace("/profile/profile");
      })
      .catch(() => {
        setIsLoading(false);
        setShowChangePassword(false);
      });
  };

  return (
    <div className="change-password-container">
      <div className="change-password-content">
        <PasswordFields
          title={t("change_password")}
          changePassword
          setCurrentPassword={setCurrentPassword}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          confirmPassword={confirmPassword}
          currentPassword={currentPassword}
        />
      </div>
    </div>
  );
};

export default ChangePasswordMobile;
