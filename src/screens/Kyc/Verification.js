import SumsubWebSdk from "@sumsub/websdk-react";
import React, { useEffect, useState } from "react";
import { BaseLayout } from "../../components/baseLayout/BaseLayout";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";

export const Verification = () => {
  const [kycAccessToken, setKycAccessToken] = useState(
    localStorage.getItem("kyc_access_token") || ""
  );

  useEffect(() => {
    if (!kycAccessToken) {
      getNewAccessToken();
    }
  }, []);

  function getNewAccessToken() {
    apiServices
      .get(apiUrl.NEXT_PUBLIC_KYC_TOKEN)
      .then((result) => {
        const token = result?.token;
        localStorage.setItem("kyc_access_token", token);
        setKycAccessToken(token);
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          alertToast({ message: error?.message });
          window.location.href = "/login";
        } else {
          alertToast({ message: error?.message });
        }
      });
  }

  return (
    <BaseLayout title="Sign Up">
      <div className="backgroundImage d-flex justify-content-center">
        <div className="verification-sumsub">
          <SumsubWebSdk
            accessToken={kycAccessToken}
            expirationHandler={() => {
              setKycAccessToken("");
            }}
            config={{
              lang: "en",
              uiConf: {
                customCssStr: ".title {\n  color: white !important;\n}",
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
    </BaseLayout>
  );
};
