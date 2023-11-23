import { CloseIcon, CrossIcon } from "@/utils/icons";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { images } from "../../utils/imagesConstant";
export const Countries = ({
  setCountry,
  setStates,
  showCountries,
  setShowCountries,
  withCode
}) => {
  const t = useTranslations();
  const user = useSelector((state) => state.user);
  const isMobile = useSelector((state) => state.setMobile);
  const isTablet = useSelector((state) => state.isTablet);
  const on_boarding = useSelector((state) => state.on_boarding);
  const [scrolledPixels, setScrolledPixels] = useState();
  const [searchCountry, setSearchCountry] = useState([]);
  const searchRef = useRef(null);

  const choosenCountry = on_boarding?.countries?.filter((country) => {
    return country.name.toLocaleLowerCase().startsWith(searchCountry) || 
    (withCode && country.phone_number_prefix?.toString().startsWith(searchCountry.replaceAll("+", "")));
  });

  return (
    <div
      className="modal show"
      id="limitModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: showCountries ? "block" : "none" }}
    >
      <div className="modal-dialog modal-fullscreen countriesModalDialog">
        <div className="modal-content fScreen mt-0 countriesModalContainer">
          <div
            onScroll={() => setScrolledPixels(searchRef?.current?.getBoundingClientRect().top)}
            className="modal-content-inside">
            <div className="modalTitle-countries">
              <p className="selectCountryTitle depositModalLimit">
                {t("sign_up.select_country_residence")}
              </p>
              <div className="closeDiv">
                <CloseIcon
                  onClick={() => {
                    setShowCountries(false);
                    setSearchCountry("");
                  }}
                />
              </div>
            </div>
            <div
              ref={searchRef}
              className="selectDecimal-countries d-flex searchStyle">
              <Image
                src={images.search}
                alt="Search icon"
                className="countriesSearch"
              />
              <input
                autoFocus
                value={searchCountry}
                className="decimalText countryModalText searchField"
                placeholder={t("common.search")}
                onChange={(e) => setSearchCountry(e.currentTarget.value.toLocaleLowerCase())}
              />
            </div>
            <div className={classNames("modalHeader-fixed", { "d-flex": scrolledPixels <= 52 && isTablet })}>
              <div className="modalTitle-fixed">
                <p className="selectCountryTitle depositModalLimit">
                  {t("sign_up.select_country_residence")}
                </p>
                <div className="closeDiv">
                  <CloseIcon
                    onClick={() => {
                      setShowCountries(false);
                      setSearchCountry("");
                    }}
                  />
                </div>
              </div>
              <div className="selectDecimal-countries d-flex searchStyle">
                <Image
                  src={images.search}
                  alt="Search icon"
                  className="countriesSearch"
                />
                <input
                  autoFocus
                  value={searchCountry}
                  className="decimalText countryModalText searchField"
                  placeholder={t("common.search")}
                  onChange={(e) => setSearchCountry(e.currentTarget.value.toLocaleLowerCase())}
                />
              </div>
            </div>
            {choosenCountry?.map((country) => {
              const isActive = country.cca2 === user?.country;
              return (
                <div
                  key={`${country.cca2}-${country.phone_number_prefix}`}
                  data-id={country.cca2}
                  className={
                    isActive
                      ? "selectDecimal-countries selectedOdd d-flex mb-3"
                      : "selectDecimal-countries d-flex mb-3 "
                  }
                  alt="Close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    if (setStates) {
                      setStates(country?.states || [])
                    }
                    setCountry(country);
                    setSearchCountry("");
                    setShowCountries(false);
                  }}
                >
                  <div className="selectDecimal-countries d-flex">
                    <Image
                      rel="preload"
                      src={country.flag_url}
                      alt={country.name}
                      priority
                      className="countriesFlags"
                      height={24}
                      width={24}
                    />
                    <p className="m-3 decimalText countryModalDecimalText">
                      {withCode && !!country.phone_number_prefix && (
                        <span>+{country.phone_number_prefix}</span>
                      )}
                      {country.name}
                    </p>
                  </div>
                </div>
              );
            })}
            {!choosenCountry.length && (
              <div className="couldntFind">
                <CrossIcon />
                <p>{t("sign_up.couldnt_find_country")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
