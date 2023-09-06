"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { PhonePrefix } from "../../components/modal/PhonePrefix";
import { setLoggedUser, setUser } from "../../store/actions";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import "./SignUp.css";

function SignUpWithPhone() {
  const on_boarding = useSelector((state) => state.on_boarding);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [loader, setLoader] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [lastValue, setLastValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [isloader, setIsLoader] = useState(false);
  const [countryCode, setCountryCode] = useState();
  const [thirdValue, setThirdValue] = useState("");
  const [firstValue, setFirstValue] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState([]);

  useEffect(() => {
    setCountries(on_boarding?.countries);
  }, []);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  let user = useSelector((state) => state.user);
  let defaultCountry =
    "https://swifty-global-app-assets-central.s3.eu-west-1.amazonaws.com/flags/countries/png/GB.png";

  const validateAndSubmitForm = (e) => {
    e.preventDefault();
  };
  const [phoneNumber, setPhoneNumber] = useState("");
  const countryPhone = useSelector((state) => state.countryPhone);
  const [phoneExist, setPhoneExist] = useState(false);
  const [countryFlag, setCountryFlag] = useState(
    countryPhone && countryPhone.length > 0
      ? countryPhone[0]?.flag_url
      : defaultCountry
  );
  const [phonePrefix, setphonePrefix] = useState(
    countryPhone && countryPhone.length > 0
      ? countryPhone[0]?.phone_number_prefix
      : "44"
  );
  const choosenCountry = countries.filter((state) => {
    return state.name.toLocaleLowerCase().startsWith(selectedCountry);
  });
  const secondInput = useRef(null);
  const thirdInput = useRef(null);
  const lastInput = useRef(null);

  const dispatch = useDispatch();
  const router = useRouter();

  function handle(e, key) {
    let newUser = {};
    Object.assign(newUser, user);
    newUser["country"] = countryCode;
    if (key === "first_name") {
      newUser["first_name"] = e.currentTarget.value;
    }
    if (key === "country") {
      setSelectedCountry(e.currentTarget.value);
      newUser["country"] = e.currentTarget.value;
    }
    if (key === "phone") {
      setPhoneNumber(e.currentTarget.value);
      newUser["phone"] = e.currentTarget.value;
      var phoneno = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
      if (e.target.value.match(phoneno)) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  }

  const verifyPhone = (e) => {
    e.preventDefault();
    setIsValid(true);
    setLoader(true);
    let body = {
      user: {
        phone_number: phoneNumber,
        phone_number_prefix: phonePrefix,
      },
    };
    apiServices
      .put(apiUrl.USER, body)
      .then((result) => {
        SuccesToast({ message: result.message });
        var newUser = {};
        if (user) {
          newUser = user;
          newUser.phone_number = phoneNumber;
          newUser.phone_number_prefix = phonePrefix;
        } else {
          newUser.phone_number = phoneNumber;
          newUser.phone_number_prefix = phonePrefix;
        }
        dispatch(setUser(newUser));
        setIsValid(false);
        setPhoneExist(true);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  const resetTimer = () => {
    let url = apiUrl.RESEND_CODE;
    setSeconds(59);

    apiServices.get(url).then(() => {
      SuccesToast({ message: "Resend code succesfully" });
      setPhoneExist(true);
    });
  };

  const verifyCode = () => {
    setIsLoader(true);
    setLastValue("");
    let code = firstValue + secondValue + thirdValue + lastValue;
    let url = apiUrl.VERIFY_PHONE + code;

    apiServices
      .get(url)
      .then((result) => {
        SuccesToast({ message: "You have validated number succesfully" });
        dispatch(setLoggedUser(result));

        router.push("/finish_account_setup");
      })
      .catch(() => {
        setIsLoader(false);
      });
  };

  if (firstValue.length > 0) {
    secondInput.current.focus();
  }
  if (secondValue.length > 0) {
    thirdInput.current.focus();
  }
  if (thirdValue.length > 0) {
    lastInput.current.focus();
  }
  if (
    firstValue.length > 0 &&
    secondValue.length > 0 &&
    thirdValue.length > 0 &&
    lastValue.length > 0
  ) {
    verifyCode();
  }
  const ResetNumber = () => {
    setPhoneExist(false);
    setLoader(false);
  };

  return (
    <div className="backgroundImage ">
      {!phoneExist ? (
        <div className=" loginForm d-grid justify-content-center GridStyleForPhone">
          <p className="logInTitle">Add your mobile number</p>
          <form
            onSubmit={validateAndSubmitForm}
            className="d-grid justify-content-center GridStyleForPhone"
          >
            <div className="emailValidation d-grid GridStyleForPhone">
              <label className="nameLabels">Mobile Number</label>
              <div className="collectionOfInput collectionOfInput2">
                <div className="emailValidation d-grid">
                  <div className="residenceInput">
                    <Button
                      id="country_code"
                      className="login-buttons p-0 mobile-login-form"
                      data-bs-toggle={
                        countryPhone && countryPhone.length > 0
                          ? countryPhone[0]?.phone_number_same_country_required
                            ? false
                            : "modal"
                          : "modal"
                      }
                      data-bs-target={
                        countryPhone && countryPhone.length > 0
                          ? countryPhone[0]?.phone_number_same_country_required
                            ? false
                            : "#limitModal"
                          : "#limitModal"
                      }
                      placeholder="Select your country of residence"
                      text={
                        <>
                          <div className="d-flex">
                            {countryFlag && (
                              <Image
                                src={countryFlag}
                                alt=""
                                className="countriesFlags2 mb-1"
                              />
                            )}
                            <p className="ms-2 mb-0  countryName phonePrefixName">
                              +{phonePrefix}
                            </p>
                          </div>
                          <Image
                            src={images.arrowIcon}
                            alt=""
                            className="residenceArrow2"
                          />
                        </>
                      }
                    />
                  </div>
                </div>
                <input
                  id="call"
                  type="text"
                  className="login-buttons inputForPhone"
                  placeholder="Mobile number"
                  onChange={(e) => handle(e, "phone")}
                />
              </div>
              <p className="codeSent mt-5 mb-5 codeSend2">
                We will send a verification code to this number. This is
                required to comply with local laws and regulations.
              </p>
            </div>
            <div className="authButtonsContainer">
              <Button
                className={
                  isValid ? "btnPrimary continueBtn validBtn " : "continueBtn"
                }
                onClick={(e) => {
                  isValid && verifyPhone(e);
                }}
                style={{ marginTop: "75px" }}
                text={<>{loader ? <Loader /> : "Send Code"}</>}
              />
            </div>
          </form>
          <PhonePrefix
            handle={handle}
            selectedCountry={selectedCountry}
            choosenCountry={choosenCountry}
            setCountryFlag={setCountryFlag}
            setCountryCode={setCountryCode}
            setphonePrefix={setphonePrefix}
            setSelectedCountry={setSelectedCountry}
          />
        </div>
      ) : (
        <>
          <div className=" loginForm d-grid justify-content-center">
            <p className="logInTitle">Verify your mobile number</p>
            <form
              onSubmit={validateAndSubmitForm}
              className="d-grid justify-content-center"
            >
              <div className="codeVerification">
                <input
                  type="tel"
                  autoFocus
                  maxLength={1}
                  className="codeInput"
                  onChange={(e) => setFirstValue(e.target.value)}
                />
                <input
                  type="tel"
                  maxLength={1}
                  className="codeInput"
                  ref={secondInput}
                  onChange={(e) => setSecondValue(e.target.value)}
                />
                <input
                  type="tel"
                  maxLength={1}
                  className="codeInput"
                  ref={thirdInput}
                  onChange={(e) => setThirdValue(e.target.value)}
                />
                <input
                  type="tel"
                  maxLength={1}
                  ref={lastInput}
                  className="codeInput"
                  onChange={(e) => setLastValue(e.target.value)}
                />
              </div>
              <p className="codeSent mb-5">
                We have sent a code to the number
                <strong>
                  +{user.phone_number_prefix}
                  {user.phone_number}
                </strong>
              </p>
              <p className="codeSent mb-5">
                Wrong number?{" "}
                <Button
                  className="buttontoresendcode"
                  onClick={ResetNumber}
                  text={"Click here to change ."}
                />
              </p>
              <div className="authButtonsContainer">
                {minutes === 0 && seconds === 0 ? (
                  <Button
                    className={"btnPrimary continueBtn outline"}
                    onClick={(e) => resetTimer(e)}
                    text={"Resend Code"}
                  />
                ) : (
                  <Button
                    className={"continueBtn outline"}
                    style={{ cursor: "not-allowed" }}
                    text={
                      <>
                        Resend in {minutes}:
                        {seconds < 10 ? `0${seconds}` : seconds}
                      </>
                    }
                  />
                )}
                <Button
                  className={
                    isValid ? "btnPrimary continueBtn validBtn " : "continueBtn"
                  }
                  onClick={(e) => {
                    isValid && verifyCode(e);
                  }}
                  text={<>{isloader ? <Loader /> : "Verify"}</>}
                />
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default SignUpWithPhone;
