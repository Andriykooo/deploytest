"use client";

import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { useTranslations } from "next-intl";
import { ArrowIcon, CheckboxIcon } from "@/utils/icons";
import { Loader } from "@/components/loaders/Loader";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { connectSocket } from "@/context/socket";
import { LinkType } from "@/components/LinkType/LinkType";
import { DatePicker } from "@/components/datePicker/DatePicker";
import moment from "moment";
import classNames from "classnames";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { PasswordInput } from "@/components/PasswordInput/PasswordInput";
import { messagingGetToken } from "../../../firebase";
import { v4 as uuidv4 } from "uuid";
import { CustomCookie } from "@/utils/cookie";
import { getUserApi } from "@/utils/apiQueries";

import "../Login/Login.css";
import "../SignUp/SignUp.css";

const socials = ["google", "facebook", "apple"];

const SignUp = () => {
  const t = useTranslations();
  const params = useParams();
  const router = useCustomRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const settings = useSelector((state) => state.settings);
  const on_boarding = useSelector((state) => state.on_boarding);
  const signup_platform = useSelector((state) => state.signup_platform);
  const countryPhone = useSelector((state) => state.countryPhone);
  const promo = useSelector((state) => state.promo);

  const [isAgree, setIsAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [showStates, setShowStates] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [country, setCountry] = useState();
  const [password, setPassword] = useState("");
  const [passwordHasANumber, setpasswordHasANumber] = useState(false);
  const [passwordIsLongEnough, setpasswordIsLongEnough] = useState(false);
  const [PasswordHasOneCharacter, setPasswordHasOneCharacter] = useState(false);
  const [state, setState] = useState(null);
  const [passwordHasSpecialCharater, setpasswordHasSpecialCharater] =
    useState(false);

  const validateDateOfBirth = () => {
    const birthdateMoment = moment(user?.date_of_birth, "YYYY-MM-DD");
    const currentMoment = moment();
    const age = currentMoment.diff(birthdateMoment, "years");

    return (
      age >=
      (country?.states.length ? state?.gambling_age : country?.gambling_age)
    );
  };

  const isValidDateOfBirth = validateDateOfBirth();
  const isValidPassword =
    socials.includes(signup_platform) ||
    (PasswordHasOneCharacter &&
      passwordHasANumber &&
      passwordIsLongEnough &&
      passwordHasSpecialCharater);

  const isValid =
    user?.first_name &&
    user?.last_name &&
    country &&
    isValidDateOfBirth &&
    isValidPassword;

  const submitValidate = (e) => {
    e.preventDefault();
    let InfoForCountry = countries.filter((state) => {
      return state.cca2 === country?.cca2;
    });
    dispatch(setCountryPhone(InfoForCountry));

    if (!user.first_name || !user.email || !user.last_name || !country) {
      alertToast({ message: t("sign_up.fill_in_all_fields") });
    } else if (isValid) {
      signupAndVerify();
    } else {
      alertToast({ message: t("sign_up.password_incorrect") });
    }
  };

  const handleOnChange = (e, key) => {
    let newUser = {};
    Object.assign(newUser, user);
    if (key === "first_name") {
      newUser["first_name"] = e.currentTarget.value;
    } else if (key === "last_name") {
      newUser["last_name"] = e.currentTarget.value;
    } else if (key === "date_of_birth") {
      newUser["date_of_birth"] = e.target.value;
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
      setPassword(e.currentTarget.value);
    }

    dispatch(setUser(newUser));
  };

  const signupAndVerify = async () => {
    try {
      setIsLoading(true);

      const termsReq = apiServices.get(apiUrl.TERMS, {
        country: country?.cca2,
        language: params.lng,
      });
      const privacyReq = apiServices.get(apiUrl.PRIVACY, {
        country: country?.cca2,
        language: params.lng,
      });

      const [termsResponse, privacyResponse] = await Promise.all([
        termsReq,
        privacyReq,
      ]);

      const body = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        country_code: country?.cca2,
        terms_version: termsResponse.version,
        policy_version: privacyResponse.version,
        date_of_birth: moment(user.date_of_birth).format("YYYY-MM-DD"),
      };

      const btag = CustomCookie.get("btag") || getLocalStorageItem("btag");

      if (btag) {
        body.income_access_tag = btag;
      }

      if (promo) {
        body.promo_code = promo;
      }

      if (socials.includes(signup_platform)) {
        body.phone_number = "";
        body.login_platform = signup_platform;
        body.social_token = user?.social_token;
        handleSocialSignIn(body);
      } else {
        body.password = password;
        body.state_code = state;
        body.device_id = getLocalStorageItem("device_id");
        continueToVerifyEmail(body);
      }
    } catch {
      setIsLoading(false);
    }
  };

  const continueToVerifyEmail = async (body) => {
    try {
      setIsLoading(true);
      const result = await apiServices.post(apiUrl.SIGN_UP, body);

      addLocalStorageItem("access_token", result?.access_token);
      addLocalStorageItem("refresh_token", result?.refresh_token);
      addLocalStorageItem("swifty_id", result?.swifty_id);
      dispatch(setSwiftyId(result?.swifty_id));
      dispatch(setData(result));
      connectSocket(result?.access_token);
      messagingGetToken();

      const userData = await getUserApi(dispatch);

      dispatch(
        setLoggedUser({
          user_data: userData,
        })
      );

      setIsLoading(false);
      router.push("/verify_email");
    } catch {
      setIsLoading(false);
    }
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
        const uuidV4 = uuidv4();
        addLocalStorageItem("device_id", uuidV4);

        connectSocket(response?.token, uuidV4);
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

  const onSetCountry = (country) => {
    setCountry(country);
    addLocalStorageItem("country_code", country?.cca2);
    let newUser = user;
    newUser["country"] = country?.cca2;
    newUser["country_name"] = country?.name;
    dispatch(setUser(newUser));
  };

  useEffect(() => {
    if (on_boarding) {
      const userCountry = on_boarding?.countries?.find(
        (country) => country.cca2 === settings?.country
      );

      setCountries(on_boarding?.countries);
      setCountry(userCountry);
    }
  }, [on_boarding]);

  return (
    <div className="signInImage">
      <Image
        alt="back"
        src={images.signInBack}
        className="signInBack"
        width={24}
        height={24}
        onClick={() => router.back()}
      />
      <form className="loginForm goingBack" onSubmit={submitValidate}>
        <div className="signUpWrapper">
          <p className="logInTitle">{t("sign_up.new_user_setup")}</p>
          <div className="emailValidation d-grid">
            <label className="nameLabels">{t("sign_up.first_name")}</label>
            <input
              onChange={(e) => handleOnChange(e, "first_name")}
              id="first_name"
              type="text"
              className="login-buttons"
              placeholder={t("sign_up.enter_first_name")}
              value={user?.first_name}
              autoComplete="new-password"
            />
          </div>
          <div className="emailValidation d-grid">
            <label className="nameLabels">{t("sign_up.last_name")}</label>
            <input
              onChange={(e) => handleOnChange(e, "last_name")}
              id="last_name"
              type="text"
              className="login-buttons"
              placeholder={t("sign_up.enter_last_name")}
              value={user?.last_name}
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
                value={country?.cca2}
                placeholder={t("sign_up.select_country_residence")}
                text={
                  <>
                    <div className="d-flex align-items-center">
                      {!!country?.flag_url && (
                        <Image
                          src={country?.flag_url}
                          alt="country-flag"
                          className="countriesFlags"
                          height={24}
                          width={24}
                        />
                      )}
                      <p className="ms-3 mb-0 mt-1 countryName">
                        {country?.name}
                      </p>
                    </div>
                    <ArrowIcon className="residenceArrow" />
                  </>
                }
              />
            </div>
          </div>
          {country?.states.length > 0 && (
            <div className="emailValidation d-grid">
              <label className="nameLabels">
                {t("sign_up.state_or_province")}
              </label>
              <div className="residenceInput">
                <Button
                  onClick={() => {
                    setShowStates(true);
                  }}
                  id="state"
                  type="button"
                  className={"login-buttons p-0"}
                  value={state}
                  text={
                    <>
                      <div className="d-flex align-items-center">
                        <p className="ms-3 mb-0 countryName">
                          {state?.name || t("sign_up.select_state_or_province")}
                        </p>
                      </div>
                      <ArrowIcon className="residenceArrow" />
                    </>
                  }
                />
              </div>
            </div>
          )}
          <div className="emailValidation d-grid position-static">
            <label className="nameLabels">{t("sign_up.date_of_birth")}</label>
            <DatePicker
              defaultActiveStartDate={
                new Date(moment().subtract(country?.gambling_age, "years"))
              }
              value={user?.date_of_birth}
              onChange={(value) =>
                handleOnChange({ target: { value } }, "date_of_birth")
              }
              placeholder={t("sign_up.enter_date_of_birth")}
            />
            <p
              className={classNames("newPassChecks mb-0 mt-2", {
                active: isValidDateOfBirth,
              })}
            >
              <span className={isValidDateOfBirth ? "dot valid" : "dot"} />
              {t("common.legal_age_requirement")}
            </p>
          </div>
          {!socials.includes(signup_platform) && (
            <div className="emailValidation d-grid mt-3">
              <label className="nameLabels">{t("common.password")}</label>
              <PasswordInput
                placeholder={t("common.enter_password")}
                value={password}
                onChange={(e) => handleOnChange(e, "password")}
              />
              <p
                className={classNames("newPassChecks mt-2", {
                  active: passwordIsLongEnough,
                })}
              >
                <span className={passwordIsLongEnough ? "dot valid" : "dot"} />
                {t("common.password_length_requirement")}
              </p>
              <p
                className={classNames("newPassChecks", {
                  active: passwordHasSpecialCharater,
                })}
              >
                <span
                  className={passwordHasSpecialCharater ? "dot valid" : "dot"}
                />
                {t("common.password_character_requirement")}
              </p>
              <p
                className={classNames("newPassChecks", {
                  active: passwordHasANumber,
                })}
              >
                <span className={passwordHasANumber ? "dot valid" : "dot"} />
                {t("common.password_number_requirement")}
              </p>
            </div>
          )}
          <div className="termsPolicy">
            <div className="checkbox" onClick={() => setIsAgree(!isAgree)}>
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
        </div>

        <div className="authButtonsContainer">
          <Button
            type="submit"
            disabled={!isAgree || !isValid || !isValidDateOfBirth}
            className={
              isValid && isAgree && isValidDateOfBirth
                ? "btnPrimary continueBtn validBtn signUpBtn"
                : "continueBtn signUpBtn"
            }
            text={isLoading ? <Loader /> : t("sign_up.sign_up")}
          />
        </div>
      </form>
      {showCountries && (
        <Countries
          setCountry={onSetCountry}
          showCountries={showCountries}
          setShowCountries={setShowCountries}
        />
      )}
      {showStates && (
        <States
          selectedState={state}
          setState={setState}
          states={country?.states}
          showStates={showStates}
          setShowStates={setShowStates}
        />
      )}
    </div>
  );
};

export default SignUp;
