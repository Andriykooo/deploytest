"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../components/button/Button";

function FinishAccountSetup() {
  const [showInformation, setShowInformation] = useState(false);
  const router = useRouter();

  const showInfo = () => {
    if (!showInformation) {
      setShowInformation(true);
    } else {
      setShowInformation(false);
    }
  };
  const continueToKyc = () => {
    router.push("/kyc");
  };
  return (
    <div className="backgroundImage finishAccountSetup">
      <div className=" loginForm d-grid justify-content-center px-4">
        <p className="logInTitle">Finish account setup</p>
        <p className="codeSent codeSend2">
          Your country's laws require us to get some more details before we
          start.
          <br/>
          <br />To activate your account and deposit funds please complete the
          following: <br/><br/>1. Upload identity document <br/>2. Selfie verification (photo
          time!) <br/>3. Upload proof of address
        </p>
        <div className="loginForm d-grid">
          <Button
            className="buttontoresendcode finishSetupInfo"
            onClick={showInfo}
            text={"Want more information on why this is required?"}
          />
          {showInformation ? (
            <p className="codeSent codeSend3">
              To use the Swifty app we need to confirm your identity. Country
              laws and/or gambling license rules require Swifty to perform
              customer due diligence before a player is allowed to use our
              platform. At a minimum, we are required to verify customer names,
              addresses and date of births. These checks are aimed at helping
              prevent harm on gaming platforms and to stop crime.
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="authButtonsContainer">
          <Button
            onClick={continueToKyc}
            className={"btnPrimary continueBtn validBtn codeBtn"}
            text={"Continue"}
          />
        </div>
      </div>
    </div>
  );
}

export default FinishAccountSetup;
