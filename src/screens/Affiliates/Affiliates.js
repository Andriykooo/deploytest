"use client";

import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import Hero from "../../assets/images/affiliatesBg.png"
import parse from "html-react-parser";
import "../Affiliates/Affiliates.css";
import { useEffect, useState } from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { Footer } from "@/components/footer/Footer";
import Link from "next/link";
import { validateUserEmail } from "@/utils/validation";
import { useDispatch, useSelector } from "react-redux";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { setLoggedUser, setSignUpPlatform, setUser } from "@/store/actions";
import { alertToast } from "@/utils/alert";
import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import { v4 as uuidv4 } from "uuid";
import { refreshCommunicationSocket } from "@/context/socket";
import jwt_decode from "jwt-decode";
import { useGoogleLogin } from "@react-oauth/google";
import classNames from "classnames";
import { Loader } from "@/components/loaders/Loader";
import Cookies from "js-cookie";
import { useClientTranslation } from "@/app/i18n/client";

const Affiliates = () => {
  const { t } = useClientTranslation(["affiliates", "common"])
  const user = useSelector((state) => state.user);
  const loggedUser = useSelector((state) => state.loggedUser);

  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState("")
  const [newUser, setNewUser] = useState();
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showConfirmDepositLimit, setShowConfirmDepositLimit] = useState(true);

  const dispatch = useDispatch();
  const params = useSearchParams();
  const router = useRouter();

  const handleSocialSubmit = (body) => {
    let device_id = uuidv4();
    apiServices
      .post(apiUrl.SIGNIN_SOCIAL, body)
      .then((response) => {
        dispatch(setLoggedUser(response));
        addLocalStorageItem("access_token", response?.token);
        addLocalStorageItem("refresh_token", response?.refresh_token);
        addLocalStorageItem("device_id", device_id);
        addLocalStorageItem("kyc_access_token", response?.kyc_access_token);
        addLocalStorageItem("swifty_id", response?.swifty_id);
        refreshCommunicationSocket(result?.access_token);
        let nextUrlPath = getLocalStorageItem("nextUrlPath");
        if (nextUrlPath && nextUrlPath === "casino") {
          router.push("/casino");
        } else {
          router.push("/");
        }
        if (
          response?.user_data?.actions &&
          response?.user_data?.actions.length > 0
        ) {
          setShowConfirmDepositLimit(true);
        } else {
          return;
        }
        if (
          showConfirmDepositLimit &&
          response?.user_data?.actions.length > 0
        ) {
          router.push("/confirm_deposit_limit");
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const checkEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(setSignUpPlatform("email"));
    let device_id = uuidv4();
    const queryEmail = email.replace(/\+/g, "%2B").toLowerCase();

    apiServices
      .get(`${apiUrl.CHECK_EMAIL}?email=${queryEmail}`)
      .then((resolve) => {
        if (resolve?.email_exist) {
          if (resolve?.sign_up_platform === "email") {
            if (!resolve?.email_verified && !params.get("redirect")) {
              router.push("verify_email");
            }
            setIsVerified(true);
            let newUser = {};
            Object.assign(newUser, user);
            newUser["first_name"] = resolve?.first_name;
            newUser["email"] = email;
            newUser["device_id"] = device_id;
            setNewUser(newUser);
            dispatch(setUser(newUser));
            setIsLoading(false);
            sessionStorage.setItem("loggedUserInTime", new Date());
            router.push(`/login?is_verfied=true&first_name=${resolve?.first_name}&email=${email}`);
          } else if (resolve?.sign_up_platform === "google") {
            alertToast({ message: t("google_sign_in") });
          } else if (resolve?.sign_up_platform === "facebook") {
            alertToast({ message: t("facebook_sign_in") });
          } else if (resolve?.sign_up_platform === "apple") {
            alertToast({ message: t("apple_sign_in") });
          } else {
            alertToast({
              message: t("wrong_platform"),
            });
          }
          setIsLoading(false);
        } else {
          let newUser = {};
          Object.assign(newUser, user);
          newUser["email"] = email;
          newUser["device_id"] = device_id;
          addLocalStorageItem("device_id", device_id);
          dispatch(setUser(newUser));
          addLocalStorageItem("IsLogged", "not_logged");
          router.push("/sign_up");
          setIsLoading(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const responseFacebook = (response) => {
    if (response.email) {
      setIsLoading(true);
      setEmail(response.email);
      setIsValid(true);
      apiServices
        .get(`${apiUrl.CHECK_EMAIL}?email=${response.email}`)
        .then((resolve) => {
          if (resolve?.email_exist) {
            let body = {
              login_platform: "facebook",
              social_token: response?.accessToken,
            };
            handleSocialSubmit(body);
          } else {
            let newUser = {
              email: response?.email,
              social_token: response?.accessToken,
              first_name: response?.name?.split(" ")[0],
              last_name: response?.name?.split(" ")[1],
            };
            dispatch(setUser(newUser));
            dispatch(setSignUpPlatform("facebook"));
            router.push("/sign_up");
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setIsValid(true);
          setEmail("");
          if (response.status !== "unknown" && !response.email) {
            alertToast({
              message: t("no_email_facebook_register"),
            });
          } else {
            alertToast({
              message: t("facebook_login_failed"),
            });
          }
        });
    }
  };

  const responseGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const googleResponse = jwt_decode(tokenResponse.credential);
      setEmail(googleResponse?.email);
      setIsLoading(true);
      setIsValid(true);
      apiServices
        .get(`${apiUrl.CHECK_EMAIL}?email=${googleResponse?.email}`)
        .then((resolve) => {
          if (resolve?.email_exist) {
            let body = {
              login_platform: "google",
              social_token: tokenResponse.credential,
            };
            googleResponse && handleSocialSubmit(body);
          } else {
            let newUser = {
              email: googleResponse?.email,
              social_token: tokenResponse.credential,
              first_name: googleResponse?.givenName,
              last_name: googleResponse?.familyName,
            };
            dispatch(setUser(newUser));
            dispatch(setSignUpPlatform("google"));
            router.push("/sign_up");
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setIsValid(true);
          setEmail("");
        });
    },
  });

  const validateEmail = (e) => {
    setEmail(e.target.value);
    let emailExist = validateUserEmail(e.target.value);
    if (e.target.value) {
      if (emailExist) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } else {
      setIsValid(false);
    }
  };

  const getTerms = () => {
    const language = Cookies.get("language") || "en";
    const country = loggedUser?.user_data?.country || "all";

    apiServices
      .get(apiUrl.TERMS, { country, language })
      .then((res) => {
        setTerms(res.content);
        // setTermsVersion(res.version);
      })
      .catch((error) => {
        alertToast({ message: error.response.data.message });
      });
  };

  useEffect(() => {
    getTerms()
  }, [])

  return (
    <div className="affiliates">
      <div className="affiliatesBanner">
        <div className="customerWelcome">
          <p className="customerWelcomeTitle">{t("new_customer_welcome_offer")}</p>
          <div className="customerWelcomeGet">
            <span>{t("get")}</span>
            <div>
              <span className="goldGet">£25</span>
              <p>{t("free")} <br /> {t("sports_bets")}</p>
            </div>
          </div>
          <div className="customerWelcomePlus">
            <span>{t("plus")}</span>
            <div>
              <span className="goldPlus">50 {t("free").toUpperCase()}</span>
              <span>{t("casino_spins")}</span>
            </div>
          </div>
          <div className="gambleInfo">
            <p>{t("gamble_responsibly")}</p>
            <Link target="_blank" href="https://www.begambleaware.org/"><b>Be</b>Gamble<b>Aware</b>.org</Link>
          </div>
        </div>
        <Image src={Hero} alt="hero" />
      </div>
      <div className="infoForCostumers">
        <p>{t("new_customer_qualifying_terms")}</p>
      </div>
      <div className="affiliatesRegister">
        <form className="registerNow" onSubmit={(e) => e.preventDefault()}>
          <h2 className="registerNowTitle">{t("register_now")}</h2>
          <div className="email-validation">
            <input
              id="email"
              type="email"
              className="login-buttons"
              placeholder={t("enter_email")}
              value={email}
              onChange={(e) => validateEmail(e)}
              autoFocus
            />
            {isValid && (
              <Image
                src={images.validated}
                className="validatedIcon"
                alt="Valid"
              />
            )}
            <button
              onClick={(e) => {
                isValid && checkEmail(e);
              }}
              className={classNames("continueBtn", {
                "btnPrimary validBtn": isValid
              })}
            >
              {isLoading ? <Loader /> : t("common:continue")}
            </button>
            <p className="oneClick d-flex justify-content-center">
              {t("sign_in_one_click")}
            </p>
          </div>
          <div className="whiteButtonsGroup d-grid affiliatesButtons">
            <div className="loginWhiteButtons">
              <Image alt="img-fbIcon" src={images.fbIcon} className="loginIconFb" />
              <div className="continueBtn white">
                <FacebookLogin
                  appId="255259129680845"
                  autoLoad={false}
                  fields="name,email"
                  callback={responseFacebook}
                  className="google-btn"
                />
                <span className="social-login-title">{t("continue_with_facebook")}</span>
              </div>
            </div>
            <div className="loginWhiteButtons">
              <Image
                alt="img-googleIcon"
                src={images.googleIcon}
                className="loginIconGoogle"
              />
              <div className="continueBtn white">
                <button
                  onClick={responseGoogle}
                  className="google-btn" />
                <span className="social-login-title">{t("continue_with_google")}</span>
              </div>
            </div>
          </div>
        </form>
        <div className="offerWorks">
          <h2 className="offerWorksTitle">{t("offer_how_it_works")}</h2>
          <ul className="offerWorksLists">
            <li>
              <div className="listSequence">
                <span>1</span>
              </div>
              <div className="listInfo">
                <h4>{t("common:deposit")}</h4>
                <p>{t("open_account_and_deposit")}</p>
              </div>
            </li>
            <li>
              <div className="listSequence">
                <span>2</span>
              </div>
              <div className="listInfo">
                <h4>{t("release_free_bets")}</h4>
                <p>{t("qualifying_bets_instruction")}</p>
              </div>
            </li>
            <li>
              <div className="listSequence">
                <span>3</span>
              </div>
              <div className="listInfo">
                <h4>{t("use_free_bets")}</h4>
                <p>{t("free_bets_available_after")}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="affiliatesInfo">
        <h3 className="affiliatesInfoTitle generalTitle">{t("swifty_gaming_rewards_welcome")}</h3>
        <div className="affiliatesInfoTerms">
          <h3 className="affiliatesInfoTitle">{t("common:terms_and_conditions")}</h3>
          {parse(terms.toString())}
        </div>
      </div>
      <div className="affiliatesFooter">
        <Footer noMenu />
      </div>
    </div>
  );
}

export default Affiliates;