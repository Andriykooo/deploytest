"use client";

import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import parse from "html-react-parser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { setData, setLoggedUser, setSwiftyId } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import "../Terms/Terms.css";
import { refreshCommunicationSocket } from "@/context/socket";
import Cookies from "js-cookie";
import { alertToast } from "@/utils/alert";
import { useClientTranslation } from "@/app/i18n/client";
import classNames from "classnames";

const Privacy = () => {
  const { t } = useClientTranslation(["privacy", "common"]);
  const privacyDivRef = useRef(null);
  const searchParams = useSearchParams();
  const [policy, setPolicy] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [policyVersion, setPolicyVersion] = useState("");
  const [acceptButtonDisabled, setAcceptButtonDisabled] = useState(true);
  const user = useSelector((state) => state.user);
  const promo = useSelector((state) => state.promo);
  const loggedUser = useSelector((state) => state.loggedUser);
  const countryPhone = useSelector((state) => state.countryPhone);
  const signup_platform = useSelector((state) => state.signup_platform);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const getPolicy = () => {
    const language = Cookies.get("language") || "en";
    const country = loggedUser?.user_data?.country || "all";

    setLoader(true);
    apiServices
      .get(apiUrl.PRIVACY, { country, language })
      .then((response) => {
        setLoader(false);
        setPolicy(response.content);
        setPolicyVersion(response.version);
      })
      .catch((error) => {
        alertToast({ message: error?.response?.data?.message });
        setLoader(false);
      });
  };

  useEffect(() => {
    if (policy) {
      handleScroll();
    }
  }, [policy]);

  const continueToVerifyEmail = () => {
    let body = {
      email: user.email,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      country_code: user.country,
      state_code: user?.state,
      terms_version: user?.terms_version,
      policy_version: policyVersion,
      device_id: user.device_id,
    };

    if (promo) {
      body.promo_code = promo;
    }

    let url = apiUrl.SIGN_UP;
    setIsLoading(true);
    apiServices
      .post(url, body)
      .then((result) => {
        addLocalStorageItem("access_token", result?.access_token);
        addLocalStorageItem("refresh_token", result?.refresh_token);
        addLocalStorageItem("swifty_id", result?.swifty_id);
        dispatch(setSwiftyId(result?.swifty_id));
        dispatch(setData(result));
        setIsLoading(false);
        refreshCommunicationSocket(result?.access_token);
        router.push("/verify_email");
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleAcceptPrivacyWithSocial = () => {
    const body = {
      email: user?.email,
      phone_number: "",
      first_name: user?.first_name,
      last_name: user?.last_name,
      country_code: user?.country,
      terms_version: user?.terms_version,
      policy_version: policyVersion,
      login_platform: signup_platform,
      social_token: user?.social_token,
    };
    setIsLoading(true);
    apiServices
      .post(apiUrl.SIGNIN_SOCIAL, body)
      .then((response) => {
        setIsLoading(false);
        addLocalStorageItem("access_token", response?.token);
        addLocalStorageItem("refresh_token", response?.refresh_token);
        addLocalStorageItem("swifty_id", response?.swifty_id);
        addLocalStorageItem("kyc_access_token", response?.kyc_access_token);
        dispatch(setSwiftyId(response?.swifty_id));
        dispatch(setData(response));
        dispatch(setLoggedUser(response));
        refreshCommunicationSocket(response?.token);
        if (countryPhone && countryPhone.length > 0) {
          if (countryPhone[0].phone_number_required) {
            router.push("/sign_up_with_phone");
          } else {
            router.push("/finish_account_setup");
          }
        } else {
          router.push("/finish_account_setup");
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleScroll = () => {
    const privacyDiv = privacyDivRef?.current;
    if (
      privacyDiv?.scrollTop + privacyDiv?.clientHeight + 100 >=
      privacyDiv?.scrollHeight
    ) {
      setAcceptButtonDisabled(false);
    }
  };

  useEffect(() => {
    getPolicy();
  }, []);

  const acceptIsActive = !searchParams?.get("mode");

  return (
    <div className="terms backgroundImage">
      <p className="termsTitleForMainPage">{t("privacy_policy")}</p>
      {loader ? (
        <Loader />
      ) : (
        <>
          <div
            ref={privacyDivRef}
            className={
              !loggedUser && pathname.indexOf("/privacy") > "-1"
                ? "termsContent termsContent-height-50"
                : "termsContent termsContent-height-60"
            }
            onScroll={handleScroll}
          >
            {parse(policy.toString())}
          </div>
          {acceptIsActive ? (
            <Button
              className={classNames("acceptBtn", {
                disabled: acceptButtonDisabled,
              })}
              onClick={() => {
                if (
                  !(
                    signup_platform === "google" ||
                    signup_platform === "facebook" ||
                    signup_platform === "apple"
                  )
                ) {
                  continueToVerifyEmail();
                } else {
                  handleAcceptPrivacyWithSocial();
                }
              }}
              disabled={acceptButtonDisabled}
              text={<>{isLoading ? <Loader /> : t("common:accept")}</>}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default Privacy;
