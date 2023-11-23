"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { useTranslations } from "next-intl";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { CloseIcon } from "@/utils/icons";
import Image from "next/image";
import { images } from "@/utils/imagesConstant";

function FinishAccountSetup() {
  const t = useTranslations();
  const [showInformation, setShowInformation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useCustomRouter();
  const onBoarding = useSelector((state) => state.on_boarding);
  const isTablet = useSelector((state) => state.isTablet);
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
      ({ cca2 }) => cca2 == user?.user_data?.country
    );

    if (!onBoardingCountry?.kyc_during_onboarding) {
      router.push("/");
    } else {
      setIsLoading(false);
    }

    return () => setIsLoading(false);
  }, []);

  if (isLoading || !onBoarding)
    return (
      <div className="finishAccountLoader">
        <Loader />
      </div>
    );

  return (
    <div className="signInImage finishAccountSetup">
      <div className="loginForm px-4">
        <div>
          <p className="logInTitle">
            {t("finish_account_setup.finish_account_setup")}
          </p>
          <p className="codeSent codeSend2">
            {t("finish_account_setup.country_laws_require_details")}
            <br />
            <br />
            {t(
              "finish_account_setup.activate_account_deposit_funds_instructions"
            )}{" "}
            <br />
            <br />
            {`1. ${t("finish_account_setup.upload_identity_document")}`} <br />
            {`2. ${t("finish_account_setup.selfie_verification")}`} <br />
            {`3. ${t("finish_account_setup.upload_proof_of_address")}`}
          </p>
          <div className="d-grid">
            <Button
              className="buttontoresendcode finishSetupInfo"
              onClick={showInfo}
              text={t("sign_up.more_information_required_question")}
            />
            <div className="finishAccLine">
              <Image alt="Line" src={images.finishAccLine} />
            </div>
            {showInformation &&
              (!isTablet ? (
                <>
                  <p className="codeSent codeSend3">
                    {t("finish_account_setup.swifty_app_identity_confirmation")}
                  </p>
                </>
              ) : (
                <div className="signUpModal">
                  <div className="signUpModalClose">
                    <CloseIcon onClick={() => setShowInformation(false)} />
                  </div>
                  <div className="loginForm goingBack">
                    <p className="logInTitle">
                      {t("finish_account_setup.required_documents")}
                    </p>
                    <p className="codeSent codeSend3">
                      {t(
                        "finish_account_setup.swifty_app_identity_confirmation"
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="authButtonsContainer">
          <Button
            onClick={continueToKyc}
            className={"btnPrimary continueBtn validBtn codeBtn"}
            text={t("common.continue")}
          />
        </div>
      </div>
    </div>
  );
}

export default FinishAccountSetup;
