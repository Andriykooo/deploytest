"use client";

import { refreshCommunicationSocket } from "@/context/socket";
import { addLocalStorageItem } from "@/utils/localStorage";
import { nextWindow } from "@/utils/nextWindow";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import "../ForgotPassword/ForgotPassword.css";
import PasswordFields from "../../components/passwordFields/PasswordFields";
import '../../components/passwordFields/PasswordFields.css'

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const uuid = uuidv4();

  const handleSubmit = (e) => {
    e.preventDefault();
    let userPasswordToken = nextWindow.location?.search.split(
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
      .post(`${apiUrl.PASSWORD_RESET}${userPasswordToken}`, body)
      .then((result) => {
        addLocalStorageItem("access_token", result?.token);
        addLocalStorageItem("refresh_token", result?.refresh_token);
        addLocalStorageItem("device_id", uuid);
        refreshCommunicationSocket(result?.token);
        setTimeout(() => {
          router.push("/");
        }, 500);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="backgroundImage forgotPassword">
        <div className=" loginForm d-grid justify-content-center p-4">
          <p className="logInTitle">Create new password</p>
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
