"use client";

import parse from "html-react-parser";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import Header from "../../components/header/Header";
import { Loader } from "../../components/loaders/Loader";
import { BaseLayout } from "../../layouts/baseLayout/BaseLayout";
import { setData, setLoggedUser, setSwiftyId } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import "../Terms/Terms.css";
import { addLocalStorageItem } from "@/utils/localStorage";

const Privacy = () => {
  const privacyDivRef = useRef(null);
  const [policy, setPolicy] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [policyVersion, setPolicyVersion] = useState("");
  const [acceptButtonDisabled, setAcceptButtonDisabled] = useState(true);
  const user = useSelector((state) => state.user);
  const loggedUser = useSelector((state) => state.loggedUser);
  const countryPhone = useSelector((state) => state.countryPhone);
  const signup_platform = useSelector((state) => state.signup_platform);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    getPolicy();
  }, []);

  const getPolicy = () => {
    const country = loggedUser?.user_data?.country || "US";
    setLoader(true);
    apiServices
      .get(`${apiUrl.PRIVACY}?country=${country}`)
      .then((response) => {
        setLoader(false);
        setPolicy(response.content);
        setPolicyVersion(response.version);
      })
      .catch(() => {
        setLoader(false);
      });
  };

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
        setTimeout(() => {
          router.push("/verify_email");
        }, 500);
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

        if (countryPhone && countryPhone.length > 0) {
          if (countryPhone[0].phone_number_required) {
            setTimeout(() => {
              router.push("/sign_up_with_phone");
            }, 200);
          } else {
            setTimeout(() => {
              router.push("/finish_account_setup");
            }, 200);
          }
        } else {
          setTimeout(() => {
            router.push("/finish_account_setup");
          }, 200);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const handleScroll = () => {
    const privacyDiv = privacyDivRef.current;
    if (
      privacyDiv.scrollTop + privacyDiv.clientHeight + 100 >=
      privacyDiv.scrollHeight
    ) {
      setAcceptButtonDisabled(false);
    }
  };
  const pathname = usePathname();
  return (
    <BaseLayout title="Privacy" className="backgroundImage">
      <Header />
      <div className="terms">
        <p className="termsTitleForMainPage">Privacy Policy</p>
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
            {!loggedUser && pathname.indexOf("/privacy") > "-1" ? (
              <Button
                className={
                  acceptButtonDisabled
                    ? "acceptBtn disabled"
                    : "btnPrimary acceptBtn"
                }
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
                text={<>{isLoading ? <Loader /> : "Accept"}</>}
              />
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default Privacy;
