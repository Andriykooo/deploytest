import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../button/Button";
import { useClientTranslation } from "@/app/i18n/client";

export const PhonePrefix = memo(({ selectedCountry, setSelectedCountry }) => {
  const { t } = useClientTranslation(["sign_up_with_phone", "common"]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const on_boarding = useSelector((state) => state.on_boarding);

  return (
    <>
      <div className="emailValidation d-grid">
        <div className="residenceInput">
          <Button
            type="button"
            id="country_code"
            className="login-buttons mobile-login-form"
            placeholder="Select your country of residence"
            onClick={() => {
              if (!selectedCountry?.phone_number_same_country_required) {
                setIsOpen(true);
              }
            }}
            text={
              <>
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
                </div>
                {!selectedCountry?.phone_number_same_country_required && (
                  <Image
                    src={images.arrowIcon}
                    alt="arrow"
                    className="residenceArrow2"
                    width={14}
                    height={8}
                  />
                )}
              </>
            }
          />
        </div>
      </div>
      <div
        className="modal show"
        id="limitModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className="modal-dialog modal-fullscreen top-50">
          <div className="modal-content fScreen mt-0 p-2">
            <div className="modal-content-inside">
              <div className="modalTitle">
                <p className="selectCountryTitle depositModalLimit">
                  {t("country_selection_prompt")}
                </p>
                <Image
                  src={images.closeIcon}
                  className="closeIconSus closeFullScreenModal"
                  alt="Close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  width={32}
                  height={32}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                />
              </div>
              <div className="selectDecimal d-flex mb-5">
                <Image
                  src={images.search}
                  alt="Search"
                  className="countriesSearch"
                  width={24}
                  height={24}
                />
                <input
                  autoFocus
                  className="decimalText searchField"
                  placeholder={t("common:search")}
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              </div>
              {on_boarding?.countries
                ?.filter((country) => {
                  return (
                    country.name.toLowerCase().includes(search.toLowerCase()) ||
                    country.phone_number_prefix
                      .toString()
                      .includes(search.toLowerCase().replaceAll("+", ""))
                  );
                })
                ?.map((country, index) => {
                  return (
                    <div
                      key={index}
                      data-id={index}
                      className={"selectDecimal d-flex mb-3"}
                      alt="Close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setSearch("");
                        setIsOpen(false);
                        setSelectedCountry(country);
                      }}
                    >
                      <div className="selectDecimal d-flex">
                        <Image
                          src={country.flag_url}
                          alt={country.name}
                          className="countriesFlags"
                          quality={50}
                          width={24}
                          height={24}
                        />
                        <p className="countryModalDecimalText mx-3">
                          +{country.phone_number_prefix}
                        </p>
                        <p className="countryModalDecimalText">
                          {country.name}
                        </p>

                        {country.name === selectedCountry.name && (
                          <Image
                            src={images.validated}
                            alt="selected"
                            className="oddsSelected"
                            height={24}
                            width={24}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
