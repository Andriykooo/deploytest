import { useState } from "react";
import { useSelector } from "react-redux";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import Image from "next/image";
import { addLocalStorageItem } from "@/utils/localStorage";
import { useTranslations } from "next-intl";

export const ChangePassowrd = ({
  currentPassword,
  newPassword,
  togglePassword,
  handlePassword,
  validation,
  passwordMatch,
  setValidation,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  validateForm,
  showPassword,
  setShowChangePassword,
  showChangePassword,
}) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useSelector((state) => state.setMobile);

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
        SuccesToast({ message: t("common.password_update_success") });
        setIsLoading(false);
        setShowChangePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setValidation({
          ...validation,
          length: false,
          specialChar: false,
          numeric: false,
        });
      })
      .catch(() => {
        setIsLoading(false);
        setShowChangePassword(false);
      });
  };

  return (
    <div
      className={isMobile ? "modal show modalFullScreen" : "modal fade show"}
      id="changePasswordModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={
        showChangePassword
          ? { display: "block", opacity: 1 }
          : { display: "none" }
      }
    >
      <div
        className={
          isMobile
            ? "modal-dialog modal-fullscreen contentPass"
            : "modal-dialog modal-pass"
        }
      >
        <div className="modal-content changePass contentPass">
          <div className="loginForm p-4">
            <Button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setShowChangePassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setValidation({
                  ...validation,
                  length: false,
                  specialChar: false,
                  numeric: false,
                });
              }}
            />
            <p className="logInTitle profile d-flex justify-content-center">
              {t("common.change_password")}
            </p>
            <div className="emailValidation">
              <label className="newPasswordLabel">
                {t("common.current_password")}
              </label>
              <div className="password-container position-relative">
                <input
                  id="password"
                  type={showPassword["currentpassword"] ? "text" : "password"}
                  className="login-buttons"
                  placeholder={t("common.enter_current_password")}
                  onChange={(e) =>
                    handlePassword(e.target.value, "currentpassword")
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
            <div className="emailValidation">
              <label className="newPasswordLabel">
                {t("profile.new_password")}
              </label>
              <div className="password-container position-relative">
                <input
                  id="password"
                  type={showPassword["newpassword"] ? "text" : "password"}
                  className="login-buttons"
                  placeholder={t("profile.enter_new_password")}
                  onChange={(e) =>
                    handlePassword(e.target.value, "newpassword")
                  }
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
                {t("common.password_length_requirement")}
              </p>
              <p className="newPassChecks">
                <span
                  className={validation.specialChar ? "dot valid" : "dot"}
                />
                {t("common.password_character_requirement")}
              </p>
              <p className="newPassChecks">
                <span className={validation.numeric ? "dot valid" : "dot"} />
                {t("common.password_number_requirement")}
              </p>
            </div>
            <div className="emailValidation">
              <label className="newPasswordLabel">
                {t("profile.confirm_new_password")}
              </label>
              <div className="password-container">
                <input
                  id="password"
                  type={showPassword["confirmpassword"] ? "text" : "password"}
                  className="login-buttons"
                  placeholder={t("profile.enter_new_password")}
                  onChange={(e) =>
                    handlePassword(e.target.value, "confirmpassword")
                  }
                />
                <Image
                  onClick={() => togglePassword("confirmpassword")}
                  src={images.showPassIcon}
                  className="showPasswordIcon welcome"
                  alt="Valid"
                  width={20}
                  height={14}
                />
              </div>
            </div>
            <p className="newPassChecks">
              <span className={passwordMatch ? "dot valid" : "dot"} />
              {t("profile.password_match_requirement")}
            </p>
            <Button
              className={
                validateForm()
                  ? "btnPrimary continueBtn2 mt-4"
                  : " mt-4 continueBtn"
              }
              onClick={(e) => validateForm() && handleSubmit(e)}
              text={<>{isLoading ? <Loader /> : t("common.confirm")}</>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
