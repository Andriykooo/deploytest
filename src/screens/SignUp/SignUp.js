import React, { useEffect, useState } from "react";
import "../Login/Login.css";
import { Helmet } from "react-helmet-async";
import "react-toastify/dist/ReactToastify.css";
import "../SignUp/SignUp.css";
import Header from "../../components/header/Header";
import { useNavigate } from "react-router-dom";
import { alertToast } from "../../utils/alert";
import { useSelector, useDispatch } from "react-redux";
import { setCountryPhone, setUser } from "../../store/actions";
import { Countries } from "../../components/modal/Countries";
import { States } from "../../components/modal/States";
import { images } from "../../utils/imagesConstant";
import { Button } from "../../components/button/Button";

const SignUp = () => {
  const [states, setStates] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [stateName, setStateName] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryFlag, setCountryFlag] = useState();
  const [countryCode, setCountryCode] = useState();
  const [showStates, setShowStates] = useState(false);
  const [countryState, setCountryState] = useState("");
  const [selectedLimit, setSelectedLimit] = useState(-1);
  const [showCountries, setShowCountries] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [passwordHasANumber, setpasswordHasANumber] = useState(false);
  const [passwordIsLongEnough, setpasswordIsLongEnough] = useState(false);
  const [country, setCountry] = useState("Select your country of residence");
  const [PasswordHasOneCharacter, setPasswordHasOneCharacter] = useState(false);
  const [passwordHasSpecialCharater, setpasswordHasSpecialCharater] =
    useState(false);
  const [data, setData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    country_code: "",
    cca2: "",
    terms_version: "",
    policy_version: "",
  });
  const user = useSelector((state) => state.user);
  const loggedUser = useSelector((state) => state.loggedUser);
  const on_boarding = useSelector((state) => state.on_boarding);
  const signup_platform = useSelector((state) => state.signup_platform);
  const passwordValidation = false;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const preloadCountries = () => {
    const countriesUrl = on_boarding.countries.values();
    for (const value of countriesUrl) {
      let images = value.flag_url;
      const img = new Image();
      img.src = images;
    }
  };

  useEffect(() => {
    preloadCountries();
    setCountries(on_boarding?.countries);
  }, []);

  useEffect(() => {
    if (!loggedUser) {
      localStorage.setItem("tempHome", true);
    } else {
      localStorage.setItem("tempHome", false);
    }
  }, []);

  useEffect(() => {
    if (
      (signup_platform === "google" ||
        signup_platform === "facebook" ||
        signup_platform === "apple") &&
      data.first_name &&
      data.last_name &&
      user?.country
    ) {
      setIsValid(true);
    }
  }, [data, user?.country]);

  function submitValidate(e) {
    e.preventDefault();
    let InfoForCountry = countries.filter((state) => {
      return state.cca2 === countryCode;
    });
    dispatch(setCountryPhone(InfoForCountry));
    if (!user.first_name || !user.email || !user.last_name || !user.country) {
      alertToast({ message: "Please fill in all of the fields!" });
    } else if (isValid) {
      navigate("/terms");
    } else {
      alertToast({ message: "Password incorrect" });
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
    } else if (key === "password") {
      let userpassword = e.currentTarget.value;
      const specialCharRegExp = /(?=.*?[!@#$%^&*()_+?<>{};:"'\.,/`])/;
      const digitsRegExp = /(?=.*?[0-9])/;
      const digitsPassword = digitsRegExp.test(userpassword);
      const specialCharPassword = specialCharRegExp.test(userpassword);
      if (userpassword.length > 0) {
        setPasswordHasOneCharacter(true);
      } else {
        setPasswordHasOneCharacter(false);
      }
      if (userpassword.length > 7) {
        setpasswordIsLongEnough(true);
      } else {
        setpasswordIsLongEnough(false);
        setIsValid(false);
      }
      if (digitsPassword) {
        setpasswordHasANumber(true);
      } else {
        setpasswordHasANumber(false);
        setIsValid(false);
      }
      if (specialCharPassword) {
        setpasswordHasSpecialCharater(true);
      } else {
        setpasswordHasSpecialCharater(false);
        setIsValid(false);
      }
      if (digitsPassword && specialCharPassword && userpassword.length > 7) {
        newUser["password"] = e.currentTarget.value;
        setIsValid(true);
      }
      if (passwordValidation && isValid) {
        setIsValid(true);
      }
    } else if (key === "state") {
      setStateName(e.target.value.toLocaleLowerCase());
    }

    dispatch(setUser(newUser));
    setData({ ...data, [key]: e.target.value });
  }

  const choosenCountry = countries.filter((state) => {
    return state.name.toLocaleLowerCase().startsWith(selectedCountry);
  });

  let choosenState = states.filter((state) => {
    return state.name.toLocaleLowerCase().startsWith(stateName);
  });
  return (
    <>
      <Helmet>
        <title>Swifty Gaming | Sign Up</title>
      </Helmet>
      <div className="backgroundImage ">
        <Header />
        <div className=" loginForm d-grid justify-content-center p-4">
          <p className="logInTitle">New here? Let's get you setup</p>
          <div className="emailValidation d-grid">
            <label className="nameLabels">First Name</label>
            <input
              onChange={(e) => handle(e, "first_name")}
              id="first_name"
              type="text"
              className="login-buttons"
              placeholder="Enter your first name"
              value={data.first_name}
              autoComplete="new-password"
            />
          </div>
          <div className="emailValidation d-grid">
            <label className="nameLabels">Last Name</label>
            <input
              onChange={(e) => handle(e, "last_name")}
              id="last_name"
              type="text"
              className="login-buttons"
              placeholder="Enter your last name"
              value={data.last_name}
              autoComplete="new-password"
            />
          </div>
          <div className="emailValidation d-grid">
            <label className="nameLabels">Country of residence </label>
            <div className="residenceInput">
              <Button
                onClick={() => setShowCountries(true)}
                id="country_code"
                type="select"
                className={"login-buttons p-0"}
                value={countryCode}
                placeholder="Select your country of residence"
                text={
                  <>
                    <div className="d-flex">
                      {countryFlag && (
                        <img
                          src={countryFlag}
                          alt=""
                          className="countriesFlags mb-2"
                        />
                      )}
                      <p className="ms-3 mb-0 mt-1 countryName">{country}</p>
                    </div>
                    <img
                      src={images.arrowIcon}
                      alt=""
                      className="residenceArrow"
                    />
                  </>
                }
              />
            </div>
          </div>
          {user?.country === "US" && states.length > 0 && (
            <div className="emailValidation d-grid">
              <label className="nameLabels">State / Province </label>
              <div className="residenceInput">
                <Button
                  onClick={() => {
                    setShowStates(true);
                    setStateName("");
                  }}
                  id="country_code"
                  type="select"
                  className={"login-buttons p-0 mb-3"}
                  value={countryCode}
                  placeholder="Select your country of residence"
                  text={
                    <>
                      <div className="d-flex">
                        <p className="ms-3 mb-0 mt-1 countryName">
                          {countryState || "Select state or province"}
                        </p>
                      </div>
                      <img
                        src={images.arrowIcon}
                        alt=""
                        className="residenceArrow"
                      />
                    </>
                  }
                />
              </div>
            </div>
          )}
          {!(
            signup_platform === "google" ||
            signup_platform === "facebook" ||
            signup_platform === "apple"
          ) && (
            <div className="emailValidation">
              <label className="newPasswordLabel pt-0">Password</label>
              <input
                onChange={(e) => handle(e, "password")}
                id="password"
                type={passwordShown ? "text" : "password"}
                className="login-buttons"
                placeholder="Enter a password"
                value={data.password}
                autoComplete="new-password"
              />
              <p className="newPassChecks mb-0">
                <span className={passwordIsLongEnough ? "dot valid" : "dot"} />
                Must be at least 8 characters
              </p>
              <p className="newPassChecks mb-0">
                <span
                  className={passwordHasSpecialCharater ? "dot valid" : "dot"}
                />
                Must include a special character
              </p>
              <p className="newPassChecks mb-4">
                <span className={passwordHasANumber ? "dot valid" : "dot"} />
                Must include a number
              </p>
              {PasswordHasOneCharacter ? (
                <img
                  onClick={togglePassword}
                  src={images.showPassIcon}
                  className="showPasswordIcon signUp"
                  alt="Valid"
                />
              ) : (
                ""
              )}
            </div>
          )}
          <Button
            onClick={(e) => {
              submitValidate(e);
            }}
            className={
              isValid
                ? "btnPrimary continueBtn validBtn signUpBtn"
                : "continueBtn signUpBtn"
            }
            text={"Sign Up"}
          />
        </div>
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
            setCountryState={setCountryState}
          />
        )}
      </div>
    </>
  );
};

export default SignUp;
