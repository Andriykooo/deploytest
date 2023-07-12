import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import { addLocalStorageItem } from "@/utils/localStorage";

export const PhonePrefix = ({
  handle,
  selectedCountry,
  choosenCountry,
  setCountry,
  setCountryFlag,
  setCountryCode,
  setphonePrefix,
  setSelectedCountry,
}) => {
  return (
    <div
      className="modal fade "
      id="limitModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen ">
        <div className="modal-content fScreen mt-0 p-2">
          <div className="modal-content-inside">
            <div className="modalTitle">
              <p className="selectCountryTitle depositModalLimit">
                Select country of mobile number
              </p>
              <Image
                src={images.closeIcon}
                className="closeIconSus closeFullScreenModal"
                alt="Close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="selectDecimal d-flex mb-5">
              <Image
                src={images.search}
                alt="Search icon"
                className="countriesSearch"
              />
              <input
                className=" decimalText searchField"
                placeholder="Search"
                onChange={(e) => handle(e, "country")}
                value={selectedCountry}
              />
            </div>
            {choosenCountry.map((countries, index) => {
              return (
                <div
                  key={index}
                  data-id={index}
                  className={"selectDecimal d-flex mb-3"}
                  alt="Close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setCountry(countries?.name);
                    setCountryFlag(countries?.flag_url);
                    setCountryCode(countries?.cca2);
                    setphonePrefix(countries?.phone_number_prefix);
                    addLocalStorageItem("country_code", countries?.cca2);
                    setSelectedCountry("");
                  }}
                >
                  <div className="selectDecimal d-flex">
                    <Image
                      src={countries.flag_url}
                      alt={countries.name}
                      className="countriesFlags"
                    />
                    <p className="m-3 decimalText">{countries.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
