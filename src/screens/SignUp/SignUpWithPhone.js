"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { PhonePrefix } from "../../components/modal/PhonePrefix";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { setLoggedUser } from "@/store/actions";
import "./SignUp.css";
import { useClientTranslation } from "@/app/i18n/client";

function SignUpWithPhone() {
  const { t } = useClientTranslation(["sign_up_with_phone", "common"]);
  const dispatch = useDispatch();
  const router = useRouter();

  const on_boarding = useSelector((state) => state.on_boarding);
  const user = useSelector((state) => state.loggedUser);
  const settings = useSelector((state) => state.settings);

  const [loader, setLoader] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    on_boarding?.countries?.find((country) => {
      return settings.country === country.cca2;
    })
  );
  const [phoneNumber, setPhoneNumber] = useState("");

  const validateAndSubmitForm = (e) => {
    e.preventDefault();
    sendCode();
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setPhoneNumber(value);

    const phoneRegexp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

    if (value.match(phoneRegexp)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const sendCode = () => {
    if (isValid) {
      setLoader(true);

      const body = {
        user: {
          phone_number: phoneNumber,
          phone_number_prefix: selectedCountry.phone_number_prefix,
        },
      };

      apiServices
        .put(apiUrl.USER, body)
        .then(() => {
          dispatch(
            setLoggedUser({
              ...user,
              user_data: {
                ...user.user_data,
                phone_number: phoneNumber,
                phone_prefix: `+${selectedCountry.phone_number_prefix}`,
              },
            })
          );

          router.push("/verify_phone");
        })
        .catch(() => {
          setLoader(false);
        });
    }
  };

  useEffect(() => {
    if (on_boarding) {
      setSelectedCountry(
        on_boarding?.countries?.find((country) => {
          return settings.country === country.cca2;
        }) || on_boarding.countries[0]
      );
    }
  }, [on_boarding]);

  return (
    <div className="backgroundImage">
      {selectedCountry ? (
        <div className="loginForm GridStyleForPhone">
          <p className="logInTitle">{t("add_mobile_number")}</p>
          <form
            onSubmit={validateAndSubmitForm}
            className="d-grid justify-content-center GridStyleForPhone"
          >
            <div className="emailValidation d-grid GridStyleForPhone">
              <label className="nameLabels">{t("common:mobile_number")}</label>
              <div className="collectionOfInput collectionOfInput2">
                <PhonePrefix
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                />
                <input
                  id="call"
                  type="text"
                  className="login-buttons inputForPhone"
                  placeholder={t("common:mobile_number")}
                  onChange={handleChange}
                />
              </div>
              <p className="codeSent mt-5 mb-5 codeSend2">{t("verification_code_message")}</p>
            </div>
            <div className="authButtonsContainer">
              <Button
                type="submit"
                className={
                  isValid ? "btnPrimary continueBtn validBtn " : "continueBtn"
                }
                style={{ marginTop: "75px" }}
                text={loader ? <Loader /> : t("send_code")}
              />
            </div>
          </form>
        </div>
      ) : (
        <div className="loader-center">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default SignUpWithPhone;
