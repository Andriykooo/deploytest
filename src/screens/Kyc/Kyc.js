import { useNavigate } from "react-router-dom";
import { BaseLayout } from "../../components/baseLayout/BaseLayout";
import { Button } from "../../components/button/Button";

function Kyc() {
  const navigate = useNavigate();

  return (
    <BaseLayout title="Sign Up">
      <div className="backgroundImage d-flex justify-content-center">
        <div className="kycDiv">
          <p className="logInTitle justify-content-center">
            Verify you identity
          </p>
          <p className="oneClick d-flex justify-content-center">
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
          <p className="oneClick d-flex justify-content-center">
            By tapping Continue, you accept our Terms and Conditions and agree
            to our processing of your personal data, as described in the Consent
            to Personal Data Processing
          </p>
          <Button
            className={"btnPrimary continueBtn validBtn"}
            onClick={() => {
              navigate("/verification");
            }}
            text={"Continue"}
          />
          <span className="small-text">Powered by Sumsub</span>
        </div>
      </div>
    </BaseLayout>
  );
}

export default Kyc;
