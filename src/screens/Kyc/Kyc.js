"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../components/button/Button";
import "../Kyc/Kyc.css";
import "../Login/Login.css";
import { useTranslations } from "next-intl";
function Kyc() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="backgroundImage">
      <div className="kycDiv">
        <p className="logInTitle">{t("kyc.verify_identity")}</p>
        <p className="oneClick d-flex">{t("kyc.take_about_2_minutes")}</p>
        <div className="emailValidation d-grid m-auto">
          <Button
            id="take_photo_of_yor_if"
            type="text"
            className={"login-buttons photo_buttons"}
            placeholder="1 .Take a photo of your ID"
            text={`1. ${t("kyc.take_photo_of_id")}`}
          />
        </div>
        <div className="emailValidation d-grid">
          <Button
            id="take_selfie"
            type="text"
            className={"login-buttons photo_buttons"}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            text={`2. ${t("kyc.take_selfie")}`}
          />
        </div>
        <div className="emailValidation d-grid">
          <Button
            id="upload_photo_of_your_Proof_of_Address"
            type="text"
            className={"login-buttons photo_buttons"}
            text={`3. ${t("kyc.upload_proof_of_address_photo")}`}
          />
        </div>
        <p className="oneClick d-flex text-start">
          {t("kyc.accept_terms_and_conditions_personal_data_processing")}
        </p>
        <div className="authButtonsContainer">
          <Button
            className={"btnPrimary continueBtn validBtn"}
            onClick={() => {
              router.push("/verification");
            }}
            text={t("common.continue")}
          />
          <p
            className="small-text text-white text-center"
            style={{ fontSize: "12px" }}
          >
            {t("kyc.powered_by_sumsub")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Kyc;
