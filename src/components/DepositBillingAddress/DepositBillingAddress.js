import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/button/Button";
import { ArrowIcon } from "@/utils/icons";
import { Countries } from "@/components/modal/Countries";
import { PhonePrefix } from "@/components/modal/PhonePrefix";
import { Loader } from "@/components/loaders/Loader";
import { States } from "@/components/modal/States";
import { apiUrl } from "@/utils/constants";
import { apiServices } from "@/utils/apiServices";
import { setLoggedUser } from "@/store/actions";

import "../../screens/Login/Login.css";
import "../../screens/SignUp/SignUp.css";

const DepositBillingAddress = () => {
  const t = useTranslations("");
  const dispatch = useDispatch();

  const [showCountries, setShowCountries] = useState(false);
  const [showStates, setShowStates] = useState(false);
  const [country, setCountry] = useState();
  const [state, setState] = useState(null);
  const [user, setUser] = useState({
    country: "",
    address: "",
    city: "",
    zip_code: "",
    phone_number: "",
    phone_prefix: "",
  });
  const [loading, setLoading] = useState(false);

  const loggedUser = useSelector((state) => state.loggedUser);
  const isTablet = useSelector((state) => state?.isTablet);
  const settings = useSelector((state) => state.settings);
  const on_boarding = useSelector((state) => state.on_boarding);

  const userHasPhone = loggedUser?.user_data?.phone_number;

  const isValid = !!(
    user?.country &&
    user?.address &&
    user?.city &&
    user?.zip_code &&
    (userHasPhone || user?.phone_number)
  );

  const submitBilling = async (e) => {
    e.preventDefault();

    if (!isValid) return;

    const body = {
      ...user,
    };

    if (userHasPhone) {
      delete body.phone_number;
      delete body.phone_prefix;
    }
    if (state?.code) body.state = state?.code;
    if (!body?.state) delete body?.state;

    setLoading(true);
    try {
      await apiServices.post(apiUrl.BILLING_ADDRESS, body);
      dispatch(
        setLoggedUser({
          ...loggedUser,
          user_data: {
            ...loggedUser.user_data,
            billing_address_set: true,
          },
        })
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleOnChange = (e, target) => {
    const value = e.target.value;

    setUser({ ...user, [target]: value });
  };

  const onSetCountry = (country) => {
    setCountry(country);

    setState(null);
    setUser({
      ...user,
      country: country?.cca2,
      phone_prefix: country.phone_number_prefix,
    });
  };

  useEffect(() => {
    if (on_boarding) {
      const userCountry = on_boarding?.countries?.find(
        (country) => country.cca2 === settings?.country
      );

      setCountry(userCountry);

      setUser({
        ...user,
        country: userCountry?.cca2,
        phone_prefix: userCountry.phone_number_prefix,
      });
    }
  }, [on_boarding]);

  //   const handlePhoneChange = (e) => {
  //     const value = e.target.value;

  //     setPhoneNumber(value);

  //     const phoneRegexp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

  //     if (value.match(phoneRegexp)) {
  //       setIsValid(true);
  //     } else {
  //       setIsValid(false);
  //     }
  //   };

  return (
    <div className="depositLimit">
      <form className="depositBillinAddress" onSubmit={submitBilling}>
        <div className="signUpWrapper">
          <p className="logInTitle">{t("billing.billing_address")}</p>
          <div className="emailValidation d-grid">
            <label className="nameLabels">{t("billing.country")}</label>
            <div className="residenceInput">
              <Button
                onClick={() => setShowCountries(true)}
                id="country_code"
                type="button"
                className={"login-buttons p-0"}
                value={country?.cca2}
                // placeholder={t("")}
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

          <div className="emailValidation d-grid">
            <label className="nameLabels">{t("billing.address")}</label>
            <input
              onChange={(e) => handleOnChange(e, "address")}
              id="address"
              type="text"
              className="login-buttons"
              placeholder={t("billing.enter_address")}
              value={user?.address}
              autoComplete="new-password"
            />
          </div>

          <div className="emailValidation d-grid">
            <label className="nameLabels">{t("billing.city")}</label>
            <input
              onChange={(e) => handleOnChange(e, "city")}
              id="city"
              type="text"
              className="login-buttons"
              placeholder={t("billing.enter_city")}
              value={user?.city}
              autoComplete="new-password"
            />
          </div>

          <div className="emailValidation d-grid">
            <label className="nameLabels">{t("billing.zip_code")}</label>
            <input
              onChange={(e) => handleOnChange(e, "zip_code")}
              id="zip_code"
              type="text"
              className="login-buttons"
              placeholder={t("billing.enter_zip_code")}
              value={user?.zip_code}
              autoComplete="new-password"
            />
          </div>
          {!userHasPhone && (
            <div className="emailValidation d-grid">
              <label className="nameLabels phoneLabel">
                {t("common.mobile_number")}
              </label>
              <div className="collectionOfInput collectionOfInput2">
                <PhonePrefix
                  selectedCountry={country}
                  setSelectedCountry={onSetCountry}
                />
                <input
                  id="call"
                  type={isTablet ? "tel" : "text"}
                  inputMode="numeric"
                  className="login-buttons inputForPhone"
                  placeholder={t("common.mobile_number")}
                  onChange={(e) => handleOnChange(e, "phone_number")}
                />
              </div>
            </div>
          )}
        </div>

        <div className="authButtonsContainer mt-5">
          <Button
            type="submit"
            className={
              isValid ? "btnPrimary continueBtn validBtn " : "continueBtn"
            }
            // style={{ marginTop: "75px" }}
            text={loading ? <Loader /> : t("common.continue")}
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
          dontSaveInStore
        />
      )}
    </div>
  );
};

export default DepositBillingAddress;
