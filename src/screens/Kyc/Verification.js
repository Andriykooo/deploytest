"use client";

import SumsubWebSdk from "@sumsub/websdk-react";
import { useEffect, useState } from "react";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { addLocalStorageItem } from "@/utils/localStorage";
import { nextWindow } from "@/utils/nextWindow";
import { Loader } from "@/components/loaders/Loader";

export const Verification = () => {
  const [kycAccessToken, setKycAccessToken] = useState(null);

  useEffect(() => {
    getNewAccessToken();
  }, []);

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
          alertToast({ message: error?.message });
        }
      });
  }

  return (
    <div className="backgroundImage">
      {kycAccessToken ? (
        <div className="verification-sumsub">
          <SumsubWebSdk
            accessToken={kycAccessToken}
            expirationHandler={() => {
              setKycAccessToken("");
            }}
            config={{
              lang: "en",
              uiConf: {
                customCssStr:
                  ".title {\n  color: white !important;\n}\n .sumsub-logo > svg {\n fill: white;\n}",
              },
            }}
            options={{ addViewportTag: false, adaptIframeHeight: true }}
            onMessage={() => {}}
            onError={() => {
              setKycAccessToken("");
            }}
            onReady={(data) => console.log(data)}
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
