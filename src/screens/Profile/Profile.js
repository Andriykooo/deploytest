"use client";

import { addLocalStorageItem } from "@/utils/localStorage";
import { nextWindow } from "@/utils/nextWindow";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { LoaderXs } from "../../components/loaders/Loader";
import { ChangePassowrd } from "../../components/modal/ChangePassword";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { theme } from "../../utils/config";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { validateUserPassword } from "../../utils/validation";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";

import "../Profile/Profile.css";
import "../Withdraw/Withdraw.css";
import { useTranslations } from "next-intl";
const InfoDiv = styled.div`
  margin-bottom: 16px;
  width: 100%;
  position: relative;
  background: ${theme?.colors?.mainSecondary};
  border-radius: 10px;
  cursor: ${(props) => (props.clickable ? " pointer" : "")};
  margin-left: 10px;
  height: ${(props) => (props.autoHeight ? "auto" : "80px")};
`;

const EmailDiv = styled.div`
  margin-bottom: 16px;
  width: 100%;
  position: relative;
  background: ${theme?.colors?.mainSecondary};
  border-radius: 10px;
  cursor: ${(props) => (props.clickable ? " pointer" : "")};
  margin-left: 10px;
  height: auto;
`;

const Profile = () => {
  const t = useTranslations();
  const loggedUser = useSelector((state) => state.loggedUser);
  const isTablet = useSelector((state) => state.isTablet);
  const [newPassword, setNewPassword] = useState("");
  const [initStarted, setInitStarted] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
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
  const isValid = false;
  const passwordShown = false;

  const router = useRouter();

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
      case "currentpassword":
        if (value.length <= 256) {
          setCurrentPassword(value);
        } else {
          alertToast({
            message: t("profile.password_max_length_requirement"),
          });
        }
        break;
      case "newpassword":
        if (value.length <= 256) {
          setNewPassword(value);
          setValidation(validateUserPassword(value));
        } else {
          alertToast({
            message: t("profile.password_max_length_requirement"),
          });
        }
        break;
      case "confirmpassword":
        if (value.length <= 256) {
          setConfirmPassword(value);
        } else {
          alertToast({
            message: t("profile.password_max_length_requirement"),
          });
        }
        break;
      default:
        return;
    }
  };

  const validateForm = () => {
    return (
      validation.numeric &&
      validation.specialChar &&
      validation.length &&
      currentPassword.length > 0 &&
      newPassword === confirmPassword
    );
  };

  function getNewAccessToken() {
    setInitStarted(true);
    return apiServices
      .get(apiUrl.KYC_TOKEN)
      .then((result) => {
        const token = result?.token;
        addLocalStorageItem("kyc_access_token", token);
        router.push("/verification");
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          nextWindow.location.href = "/login";
        }
      });
  }

  const handleClickRedirect = () => {
    router.push("/sign_up_with_phone");
  };

  const handleEmailClickRedirect = () => {
    apiServices.get(apiUrl.RESEND_EMAIL).then(() => {
      router.push("/verify_email");
    });
  };

  return (
    <div className="depositLimit">
      <div className="pageContent">
        <PreferencesTitle title={t("common.profile")} marginBottomSize="lg" />

        <div className="row col-4 mb-3 profileRow">
          {loggedUser?.user_data?.player_id && (
            <InfoDiv>
              <p className="fieldSubTitle m-2">{t("profile.player_id")}</p>
              <div className="playerId m-2">
                <p className="playerId mb-0">
                  {loggedUser?.user_data?.player_id}
                </p>
              </div>
            </InfoDiv>
          )}
          <EmailDiv
            clickable={
              loggedUser?.user_data?.kyc_status === "verified" ? false : true
            }
          >
            <p className="fieldSubTitle m-2">
              {t("profile.email_verification")}
            </p>
            {loggedUser?.user_data?.email_verified ? (
              <>
                <div className="playerId m-2">
                  {loggedUser?.user_data?.email}
                </div>
                <Image
                  alt="img-validated"
                  src={images.validated}
                  className="profileValidated "
                />
              </>
            ) : (
              <>
                <div onClick={handleEmailClickRedirect}>
                  <p className="playerId notVerified m-2 ">
                    {t("profile.email_verify_required")}
                  </p>
                  <Image
                    alt="img-arrowIcon"
                    src={images.arrowIcon}
                    className="profileArrow"
                  />
                </div>
              </>
            )}
          </EmailDiv>
          {
            <>
              {loggedUser?.user_data?.phone_number_verified ? (
                <InfoDiv>
                  <p className="fieldSubTitle m-2">
                    {t("common.mobile_number")}
                  </p>
                  <p className="playerId m-2" style={{ lineHeight: "40px" }}>
                    {loggedUser?.user_data?.phone_prefix}{" "}
                    {loggedUser?.user_data?.phone_number}
                  </p>
                  <Image
                    alt="img-validated"
                    src={images.validated}
                    className="profileValidated"
                  />
                </InfoDiv>
              ) : (
                <InfoDiv autoHeight>
                  <div onClick={handleClickRedirect}>
                    <p
                      className="fieldSubTitle ms-2"
                      style={{ cursor: "pointer" }}
                    >
                      {t("common.mobile_number")}
                    </p>
                    {loggedUser?.user_data?.required_values.phone_number && (
                      <p className="playerId notVerified m-2">
                        {t("profile.mobile_verification_required")}
                      </p>
                    )}
                    <Image
                      alt="img-arrowIcon"
                      src={images.arrowIcon}
                      className="profileArrow"
                    />
                  </div>
                </InfoDiv>
              )}
            </>
          }
          <InfoDiv
            mobileNumber
            onClick={() => {
              !(loggedUser?.user_data?.kyc_status === "verified") &&
                getNewAccessToken();
            }}
          >
            <p className="fieldSubTitle m-2 cursorPointer">
              {t("profile.proof_of_identify")}
            </p>
            {loggedUser?.user_data?.kyc_status === "verified" && (
              <div>
                <p className="playerId m-2">
                  {t("profile.account_is_verified")}
                </p>
                <Image
                  alt="img-validated"
                  src={images.validated}
                  className="profileValidated "
                />
              </div>
            )}
            {loggedUser?.user_data?.kyc_status === "rejected" && (
              <div className="d-flex">
                <p className="playerId notVerified m-2">
                  {t("profile.account_verify_rejected")}
                </p>

                {initStarted ? (
                  <div>
                    <LoaderXs />
                  </div>
                ) : (
                  <Image
                    alt="img-arrowIcon"
                    src={images.arrowIcon}
                    className="profileArrow"
                  />
                )}
              </div>
            )}
            {loggedUser?.user_data?.kyc_status === "pending" && (
              <div className="cursorPointer">
                <p className="playerId m-2">
                  {t("profile.account_verify_pending")}
                </p>

                {initStarted && (
                  <div>
                    <LoaderXs />
                  </div>
                )}
              </div>
            )}

            {loggedUser?.user_data?.kyc_status === "init" && (
              <div className="cursorPointer">
                <p className="playerId m-2">
                  {t("profile.account_verify_started")}
                </p>

                {initStarted && (
                  <div>
                    <LoaderXs />
                  </div>
                )}
              </div>
            )}

            {loggedUser?.user_data?.kyc_status === "not_started" && (
              <div>
                <div className="d-flex">
                  <p className="playerId notVerified m-2">
                    {t("profile.account_verify_required")}
                  </p>
                  {initStarted ? (
                    <div>
                      <LoaderXs />
                    </div>
                  ) : (
                    <Image
                      alt="img-arrowIcon"
                      src={images.arrowIcon}
                      className="profileArrow"
                    />
                  )}
                </div>
              </div>
            )}
          </InfoDiv>
          <div
            className="col-12 infoDiv profile changePw clickable"
            onClick={() =>
              isTablet
                ? router.push("change_password")
                : setShowChangePassword(true)
            }
          >
            <p className="fieldSubTitle m-3 ms-2">
              {t("common.change_password")}
            </p>
            <Image
              alt="img-arrowIcon"
              src={images.arrowIcon}
              className="profileArrow"
            />
          </div>
          {showChangePassword && (
            <div className="modal-overlay">
              <ChangePassowrd
                isValid={isValid}
                passwordShown={passwordShown}
                togglePassword={togglePassword}
                handlePassword={handlePassword}
                validation={validation}
                passwordMatch={
                  newPassword ? newPassword === confirmPassword : false
                }
                setValidation={setValidation}
                validateForm={validateForm}
                currentPassword={currentPassword}
                newPassword={newPassword}
                showPassword={showPassword}
                setShowChangePassword={setShowChangePassword}
                showChangePassword={showChangePassword}
                setCurrentPassword={setCurrentPassword}
                setNewPassword={setNewPassword}
                setConfirmPassword={setConfirmPassword}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
