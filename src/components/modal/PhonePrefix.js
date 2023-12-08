import Image from "next/image";
import { useState } from "react";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { Countries } from "./Countries";

export const PhonePrefix = ({ selectedCountry, setSelectedCountry }) => {
  const [showCountries, setShowCountries] = useState(false);

  return (
    <>
      <div className="emailValidation d-grid m-0">
        <div className="residenceInput">
          <Button
            type="button"
            id="country_code"
            className="login-buttons mobile-login-form"
            placeholder="Select your country of residence"
            onClick={() => {
              if (!selectedCountry?.phone_number_same_country_required) {
                setShowCountries(true);
              }
            }}
            text={
              <div className="d-flex align-items-center">
                <Image
                  src={selectedCountry?.flag_url}
                  alt="country flag"
                  className="countriesFlags2 m-0"
                  width={24}
                  height={24}
                />
                <p className="countryName phonePrefixName">
                  +{selectedCountry?.phone_number_prefix}
                </p>
                {!selectedCountry?.phone_number_same_country_required && (
                  <Image
                    src={images.arrowIcon}
                    alt="arrow"
                    className="residenceArrow2"
                    width={14}
                    height={8}
                  />
                )}
              </div>
            }
          />
        </div>
      </div>
      <Countries
        setCountry={setSelectedCountry}
        showCountries={showCountries}
        setShowCountries={setShowCountries}
        withCode
      />
    </>
  );
};
