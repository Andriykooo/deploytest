"use client";

import { addLocalStorageItem } from "@/utils/localStorage";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/button/Button";
import { Countries } from "../../components/modal/Countries";
import { States } from "../../components/modal/States";
import {
  setCountryPhone,
  setData,
  setLoggedUser,
  setSwiftyId,
  setUser,
} from "../../store/actions";
import { alertToast } from "../../utils/alert";
import { images } from "../../utils/imagesConstant";
import "../Login/Login.css";
import "../SignUp/SignUp.css";
import { useTranslations } from "next-intl";
import { CheckboxIcon } from "@/utils/icons";
import { Loader } from "@/components/loaders/Loader";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { refreshCommunicationSocket } from "@/context/socket";
import { LinkType } from "@/components/LinkType/LinkType";
import { DatePicker } from "@/components/datePicker/DatePicker";
import moment from "moment";
import classNames from "classnames";

const socials = ["google", "facebook", "apple"];

const SignUp = () => {
  const t = useTranslations();
  const params = useParams();
  const [states, setStates] = useState([]);
  const [isAgree, setIsAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stateName, setStateName] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryFlag, setCountryFlag] = useState();
  const [countryCode, setCountryCode] = useState();
  const [showStates, setShowStates] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState(-1);
  const [showCountries, setShowCountries] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [passwordHasANumber, setpasswordHasANumber] = useState(false);
  const [passwordIsLongEnough, setpasswordIsLongEnough] = useState(false);
  const [isValidDateOfBirth, setIsValidDateOfBirth] = useState(false);
  const [country, setCountry] = useState(t("sign_up.select_country_residence"));
  const [PasswordHasOneCharacter, setPasswordHasOneCharacter] = useState(false);
  const [passwordHasSpecialCharater, setpasswordHasSpecialCharater] =
    useState(false);
  const [userData, setUserData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    country_code: "",
    cca2: "",
    terms_version: "",
    policy_version: "",
    date_of_birth: "",
  });

  const isValid =
    userData?.first_name &&
    userData?.last_name &&
    country &&
    isValidDateOfBirth &&
    PasswordHasOneCharacter &&
    passwordHasANumber &&
    passwordIsLongEnough &&
    passwordHasSpecialCharater;

  const user = useSelector((state) => state.user);
  const settings = useSelector((state) => state.settings);
  const loggedUser = useSelector((state) => state.loggedUser);
  const on_boarding = useSelector((state) => state.on_boarding);
  const signup_platform = useSelector((state) => state.signup_platform);
  const countryPhone = useSelector((state) => state.countryPhone);
  const promo = useSelector((state) => state.promo);
  const router = useRouter();
  const dispatch = useDispatch();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    const userCountry = on_boarding?.countries?.find(
      (country) => country.cca2 === settings.country
    );
    if (userCountry?.states) {
      setStates(userCountry?.states);
    } else {
      setStates([]);
    }
    setCountry(userCountry);
    setCountryFlag(userCountry?.flag_url);
    setCountryCode(userCountry?.cca2);
    addLocalStorageItem("country_code", userCountry?.cca2);
    let newUser = user;
    newUser["country"] = userCountry?.cca2;
    newUser["country_name"] = userCountry?.name;
    dispatch(setUser(newUser));
  }, []);

  useEffect(() => {
    setCountries(on_boarding?.countries);
  }, [on_boarding]);

  useEffect(() => {
    if (!loggedUser) {
      addLocalStorageItem("tempHome", true);
    } else {
      addLocalStorageItem("tempHome", false);
    }
  }, []);

  function submitValidate(e) {
    e.preventDefault();
    let InfoForCountry = countries.filter((state) => {
      return state.cca2 === countryCode;
    });
    dispatch(setCountryPhone(InfoForCountry));
    if (!user.first_name || !user.email || !user.last_name || !user.country) {
      alertToast({ message: t("sign_up.fill_in_all_fields") });
    } else if (isValid) {
      signupAndVerify();
    } else {
      alertToast({ message: t("sign_up.password_incorrect") });
    }
  }
  function handle(e, key) {
    let newUser = {};
    Object.assign(newUser, user);
    newUser["country"] = countryCode;
    newUser["terms_version"] = user.terms_version;
    if (key === "first_name") {
      newUser["first_name"] = e.currentTarget.value;
    } else if (key === "country") {
      setSelectedCountry(e.currentTarget.value.toLocaleLowerCase());
    } else if (key === "email") {
      newUser["email"] = user.email;
    } else if (key === "last_name") {
      newUser["last_name"] = e.currentTarget.value;
    } else if (key === "date_of_birth") {
      const birthdateMoment = moment(e.target.value, "YYYY-MM-DD");
      const currentMoment = moment();
      const age = currentMoment.diff(birthdateMoment, "years");

      if (age >= country?.gambling_age) {
        setIsValidDateOfBirth(true);
      } else {
        setIsValidDateOfBirth(false);
      }
    } else if (key === "password") {
      let userpassword = e.currentTarget.value;
      const specialCharRegExp = /(?=.*?[!@#$%^&*()_+?<>{};:"'\.,/`])/;
      const digitsRegExp = /(?=.*?[0-9])/;
      const digitsPassword = digitsRegExp.test(userpassword);
      const specialCharPassword = specialCharRegExp.test(userpassword);

      setPasswordHasOneCharacter(userpassword.length > 0);
      setpasswordIsLongEnough(userpassword.length > 7);
      setpasswordHasANumber(digitsPassword);
      setpasswordHasSpecialCharater(specialCharPassword);

      if (digitsPassword && specialCharPassword && userpassword.length > 7) {
        newUser["password"] = e.currentTarget.value;
      }
    } else if (key === "state") {
      setStateName(e.target.value.toLocaleLowerCase());
    }

    dispatch(setUser(newUser));
    setUserData({ ...userData, [key]: e.target.value });
  }
  const signupAndVerify = async () => {
    try {
      setIsLoading(true);
      const language = params.lng || "en";
      const termsReq = apiServices.get(apiUrl.TERMS, {
        country: countryCode,
        language,
      });
      const privacyReq = apiServices.get(apiUrl.PRIVACY, {
        country: countryCode,
        language,
      });

      const [termsResponse, privacyResponse] = await Promise.all([
        termsReq,
        privacyReq,
      ]);

      const body = {
        email: user.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        country_code: countryCode,
        terms_version: termsResponse.version,
        policy_version: privacyResponse.version,
        date_of_birth: moment(userData.date_of_birth).format("YYYY-DD-MM"),
      };

      if (promo) {
        body.promo_code = promo;
      }

      if (socials.includes(signup_platform)) {
        body.phone_number = "";
        body.login_platform = signup_platform;
        body.social_token = user?.social_token;
        handleSocialSignIn(body);
      } else {
        body.password = user.password;
        body.state_code = user?.state;
        body.device_id = user.device_id;
        continueToVerifyEmail(body);
      }
    } catch {
      setIsLoading(false);
    }
  };

  const continueToVerifyEmail = (body) => {
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

  const handleSocialSignIn = (body) => {
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

  const choosenCountry = countries?.filter((state) => {
    return state.name.toLocaleLowerCase().startsWith(selectedCountry);
  });

  let choosenState = states.filter((state) => {
    return state.name.toLocaleLowerCase().startsWith(stateName);
  });

  return (
    <div className="signInImage">
      <form className="loginForm" onSubmit={submitValidate}>
        <p className="logInTitle">{t("sign_up.new_user_setup")}</p>
        <div className="emailValidation d-grid">
          <label className="nameLabels">{t("sign_up.first_name")}</label>
          <input
            onChange={(e) => handle(e, "first_name")}
            id="first_name"
            type="text"
            className="login-buttons"
            placeholder={t("sign_up.enter_first_name")}
            value={userData.first_name}
            autoComplete="new-password"
          />
        </div>
        <div className="emailValidation d-grid">
          <label className="nameLabels">{t("sign_up.last_name")}</label>
          <input
            onChange={(e) => handle(e, "last_name")}
            id="last_name"
            type="text"
            className="login-buttons"
            placeholder={t("sign_up.enter_last_name")}
            value={userData.last_name}
            autoComplete="new-password"
          />
        </div>
        <div className="emailValidation d-grid">
          <label className="nameLabels">
            {t("sign_up.country_of_residence")}
          </label>
          <div className="residenceInput">
            <Button
              onClick={() => setShowCountries(true)}
              id="country_code"
              type="button"
              className={"login-buttons p-0"}
              value={countryCode}
              placeholder={t("sign_up.select_country_residence")}
              text={
                <>
                  <div className="d-flex align-items-center">
                    {countryFlag && (
                      <Image
                        src={countryFlag}
                        alt="country-flag"
                        className="countriesFlags"
                        height={24}
                        width={24}
                      />
                    )}
                    <p className="ms-3 mb-0 countryName">{country?.name}</p>
                  </div>
                  <Image
                    src={images.arrowIcon}
                    alt="country-flag"
                    className="residenceArrow"
                    height={8}
                    width={14}
                  />
                </>
              }
            />
          </div>
        </div>

        <div className="emailValidation d-grid">
          <label className="nameLabels">{t("sign_up.date_of_birth")}</label>
          <DatePicker
            value={userData.date_of_birth}
            onChange={(value) => handle({ target: { value } }, "date_of_birth")}
            placeholder={t("sign_up.enter_date_of_birth")}
          />
          <p className="newPassChecks mb-0 mt-2">
            <span className={isValidDateOfBirth ? "dot valid" : "dot"} />
            {t("common.legal_age_requirement")}
          </p>
        </div>
        {!socials.includes(signup_platform) && (
          <div className="emailValidation d-grid">
            <label className="nameLabels">{t("common.password")}</label>
            <div className="position-relative">
              <input
                onChange={(e) => handle(e, "password")}
                id="password"
                type={passwordShown ? "text" : "password"}
                className="login-buttons"
                placeholder={t("common.enter_password")}
                value={userData.password}
                autoComplete="new-password"
              />
              {PasswordHasOneCharacter ? (
                <Image
                  onClick={togglePassword}
                  src={images.showPassIcon}
                  className="showPasswordIcon signUp"
                  alt="Valid"
                  width={20}
                  height={14}
                />
              ) : (
                ""
              )}
            </div>
            <p className="newPassChecks mb-0 mt-2">
              <span className={passwordIsLongEnough ? "dot valid" : "dot"} />
              {t("common.password_length_requirement")}
            </p>
            <p className="newPassChecks mb-0">
              <span
                className={passwordHasSpecialCharater ? "dot valid" : "dot"}
              />
              {t("common.password_character_requirement")}
            </p>
            <p className="newPassChecks mb-0">
              <span className={passwordHasANumber ? "dot valid" : "dot"} />
              {t("common.password_number_requirement")}
            </p>
          </div>
        )}
        <div className="termsPolicy">
          <div
            className={classNames("checkbox", { active: isAgree })}
            onClick={() => setIsAgree(!isAgree)}
          >
            <CheckboxIcon active={isAgree} />
          </div>
          <p className="mb-0">
            {t("sign_up.read_and_agree")}
            <LinkType
              className="termsPolicyLink"
              path="/terms"
              type="modal"
              modalData={{
                slug: "/terms",
              }}
            >
              {t("common.terms_and_conditions")}
            </LinkType>
            {t("common.and")}
            <LinkType
              className="termsPolicyLink"
              path="/privacy"
              type="modal"
              modalData={{
                slug: "/privacy",
              }}
            >
              {t("privacy.privacy_policy")}
            </LinkType>
          </p>
        </div>

        <div className="authButtonsContainer">
          <Button
            type="submit"
            disabled={!isAgree || !isValid}
            className={
              isValid && isAgree
                ? "btnPrimary continueBtn validBtn signUpBtn"
                : "continueBtn signUpBtn"
            }
            text={isLoading ? <Loader /> : t("sign_up.sign_up")}
          />
        </div>
      </form>
      {showCountries && (
        <Countries
          handle={handle}
          choosenCountry={choosenCountry}
          selectedLimit={selectedLimit}
          setSelectedLimit={setSelectedLimit}
          setCountry={setCountry}
          setCountryFlag={setCountryFlag}
          setCountryCode={setCountryCode}
          setSelectedCountry={setSelectedCountry}
          setStates={setStates}
          showCountries={showCountries}
          setShowCountries={setShowCountries}
        />
      )}
      {showStates && (
        <States
          handle={handle}
          states={choosenState}
          showStates={showStates}
          setShowStates={setShowStates}
        />
      )}
    </div>
  );
};

export default SignUp;
