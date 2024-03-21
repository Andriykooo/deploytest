"use client";

import SumsubWebSdk from "@sumsub/websdk-react";
import { useEffect, useState } from "react";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { addLocalStorageItem } from "@/utils/localStorage";
import { nextWindow } from "@/utils/nextWindow";
import { Loader } from "@/components/loaders/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setIsVerifyMessage, setLoggedUser } from "@/store/actions";
import KycModal from "./KycModal";
import "../Login/Login.css";

export const Verification = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loggedUser);
  const [isVerified, setIsVerified] = useState(false);
  const [kycAccessToken, setKycAccessToken] = useState(null);

  useEffect(() => {
    if (user?.user_data?.kyc_status === "verified") setIsVerified(true);
    else getNewAccessToken();
  }, [user]);

  function getNewAccessToken() {
    apiServices
      .get(apiUrl.KYC_TOKEN)
      .then((result) => {
        const token = result?.token;
        addLocalStorageItem("kyc_access_token", token);
        setKycAccessToken(token);
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          alertToast({ message: error?.message });
          nextWindow.location.href = "/login";
        } else {
          setKycAccessToken("");
          alertToast({ message: error?.message });
        }
      });
  }

  if (!user) return null;

  if (isVerified) return <KycModal />;

  return (
    <div className="signInImage">
      {kycAccessToken ? (
        <div className="verification-sumsub">
          <SumsubWebSdk
            accessToken={kycAccessToken}
            expirationHandler={getNewAccessToken}
            config={{
              lang: "en",
              uiConf: {
                customCssStr:
                  ".title {\n  color: var(--global-color-main-text_primary) !important;\n}\n .sumsub-logo > svg {\n fill: var(--global-color-main-icon_primary);\n}",
              },
            }}
            options={{ addViewportTag: false, adaptIframeHeight: true }}
            onError={() => {
              setKycAccessToken("");
            }}
            onMessage={(idCheck, response) => {
              if (idCheck === "idCheck.onStepInitiated") {
                dispatch(setIsVerifyMessage(false));
                dispatch(
                  setLoggedUser({
                    ...user,
                    user_data: {
                      ...user.user_data,
                      kyc_status: "init",
                    },
                  })
                );
              }

              if (response?.reviewStatus) {
                dispatch(setIsVerifyMessage(false));
                dispatch(
                  setLoggedUser({
                    ...user,
                    user_data: {
                      ...user.user_data,
                      kyc_status: response?.reviewStatus,
                    },
                  })
                );
              }
            }}
          />
        </div>
      ) : (
        <div className="loader-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
