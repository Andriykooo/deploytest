import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/actions";
import { images } from "../../utils/imagesConstant";
import Image from "next/image";
import { addLocalStorageItem } from "@/utils/localStorage";

export const Countries = ({
  handle,
  choosenCountry,
  setCountry,
  setCountryFlag,
  setCountryCode,
  setSelectedCountry,
  setStates,
  showCountries,
  setShowCountries,
}) => {
  const user = useSelector((state) => state.user);
  const isMobile = useSelector((state) => state.setMobile);
  const dispatch = useDispatch();

  return (
    <div
      className="modal show"
      id="limitModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={showCountries ? { display: "block" } : { display: "none" }}
    >
      <div className="modal-dialog modal-fullscreen countriesModalDialog">
        <div className="modal-content fScreen mt-0 p-2">
          <div className="modal-content-inside">
            <div className="modalTitle-countries">
              <p className="selectCountryTitle depositModalLimit">
                Select country of residence
              </p>
              <Image
                src={images.closeIcon}
                className="closeIconSus closeFullScreenModal"
                alt="Close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ cursor: "pointer" }}
                onClick={() => setShowCountries(false)}
              />
            </div>
            <div className="selectDecimal-countries d-flex searchStyle">
              <Image
                src={images.search}
                alt="Search icon"
                className="countriesSearch"
              />
              <input
                className=" decimalText countryModalText searchField"
                placeholder="Search"
                onChange={(e) => handle(e, "country")}
              />
            </div>
            {choosenCountry?.map((country, index) => {
              const isActive = country.cca2 === user?.country;

              return (
                <div
                  key={index}
                  data-id={index}
                  className={
                    isActive
                      ? "selectDecimal-countries selectedOdd d-flex mb-3"
                      : "selectDecimal-countries d-flex mb-3 "
                  }
                  alt="Close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    if (country?.states) {
                      setStates(country?.states);
                    } else {
                      setStates([]);
                    }
                    setCountry(country?.name);
                    setCountryFlag(country?.flag_url);
                    setCountryCode(country?.cca2);
                    addLocalStorageItem("country_code", country?.cca2);
                    let newUser = user;
                    newUser["country"] = country?.cca2;
                    newUser["country_name"] = country?.name;
                    dispatch(setUser(newUser));
                    setSelectedCountry("");
                    setShowCountries(false);
                  }}
                >
                  <div className="selectDecimal-countries d-flex">
                    <Image
                      rel="preload"
                      src={country.flag_url}
                      alt={country.name}
                      className="countriesFlags"
                      height={24}
                      width={24}
                    />
                    <p className="m-3 decimalText countryModalDecimalText">
                      {isMobile && !!country.phone_number_prefix && (
                        <span>+{country.phone_number_prefix}</span>
                      )}
                      {country.name}
                    </p>
                  </div>
                  {isActive && (
                    <Image
                      src={images.validated}
                      alt="selected"
                      className="oddsSelected"
                      height={24}
                      width={24}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
