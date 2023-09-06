"use client";

import SumsubWebSdk from "@sumsub/websdk-react";
import { useEffect, useState } from "react";
import { BaseLayout } from "../../layouts/baseLayout/BaseLayout";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import { nextWindow } from "@/utils/nextWindow";

export const Verification = () => {
  const [kycAccessToken, setKycAccessToken] = useState(
    getLocalStorageItem("kyc_access_token") || ""
  );

  useEffect(() => {
    if (!kycAccessToken) {
      getNewAccessToken();
    }
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
    </div>
  );
};
