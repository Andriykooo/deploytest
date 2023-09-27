"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { useClientTranslation } from "@/app/i18n/client";

function FinishAccountSetup() {
  const { t } = useClientTranslation(["finish_account_setup", "common"]);
  const [showInformation, setShowInformation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const onBoarding = useSelector((state) => state.on_boarding);
  let user = useSelector((state) => state.loggedUser);

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

  useEffect(() => {
    const onBoardingCountry = onBoarding.countries.find(
      ({ cca2 }) => cca2 == user?.user_data.address_country
    );
    if (onBoardingCountry?.kyc_during_onboarding == false) {
      router.push("/");
    } else {
      setIsLoading(false);
    }

    return () => setIsLoading(false);
  }, []);

  if (isLoading)
    return (
      <div className="finishAccountLoader">
        <Loader />
      </div>
    );

  return (
    <div className="backgroundImage finishAccountSetup">
      <div className=" loginForm px-4">
        <p className="logInTitle">{t("finish_account_setup")}</p>
        <p className="codeSent codeSend2">
          {t("country_laws_require_details")}
          <br />
          <br />
          {t("activate_account_deposit_funds_instructions")} <br />
          <br />
          {`1. ${t("upload_identity_document")}`} <br />
          {`2. ${t("selfie_verification")}`} <br />
          {`3. ${t("upload_proof_of_address")}`}
        </p>
        <div className="loginForm d-grid">
          <Button
            className="buttontoresendcode finishSetupInfo"
            onClick={showInfo}
            text={t("more_information_required_question")}
          />
          {showInformation ? (
            <p className="codeSent codeSend3">
              {t("swifty_app_identity_confirmation")}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="authButtonsContainer">
          <Button
            onClick={continueToKyc}
            className={"btnPrimary continueBtn validBtn codeBtn"}
            text={t("common:continue")}
          />
        </div>
      </div>
    </div>
  );
}

export default FinishAccountSetup;
