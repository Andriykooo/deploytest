"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../components/button/Button";
import "../Kyc/Kyc.css";
import "../Login/Login.css";

function Kyc() {
  const router = useRouter();

  return (
    <div className="backgroundImage">
      <div className="kycDiv">
        <p className="logInTitle">Verify you identity</p>
        <p className="oneClick d-flex">
          It will take about 2 minutes
        </p>
        <div className="emailValidation d-grid m-auto">
          <Button
            id="take_photo_of_yor_if"
            type="text"
            className={"login-buttons photo_buttons"}
            placeholder="1 .Take a photo of your ID"
            text={"1 .Take a photo of your ID"}
          />
        </div>
        <div className="emailValidation d-grid">
          <Button
            id="take_selfie"
            type="text"
            className={"login-buttons photo_buttons"}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            text={"2. Take a selfie"}
          />
        </div>
        <div className="emailValidation d-grid">
          <Button
            id="upload_photo_of_your_Proof_of_Address"
            type="text"
            className={"login-buttons photo_buttons"}
            text={"3. Upload a photo of your Proof of Address"}
          />
        </div>
        <p className="oneClick d-flex text-start">
          By tapping Continue, you accept our Terms and Conditions and agree to
          our processing of your personal data, as described in the Consent to
          Personal Data Processing
        </p>
        <div className="authButtonsContainer">
          <Button
            className={"btnPrimary continueBtn validBtn"}
            onClick={() => {
              router.push("/verification");
            }}
            text={"Continue"}
          />
          <p className="small-text text-white text-center" style={{ fontSize: "12px" }}>Powered by Sumsub</p>
        </div>
      </div>
    </div>
  );
}

export default Kyc;
