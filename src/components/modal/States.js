import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/actions";
import { images } from "../../utils/imagesConstant";
import Image from "next/image";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const States = ({
  states,
  showStates,
  setShowStates,
  setState,
  selectedState,
}) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [search, setSearch] = useState("");

  return (
    <>
      <div
        className="modal show"
        id="limitModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={showStates ? { display: "block" } : { display: "block" }}
      >
        <div className="modal-dialog modal-fullscreen countriesModalDialog">
          <div className="modal-content fScreen mt-0 p-2">
            <div className="modal-content-inside">
              <div className="modalTitle-countries">
                <p className="selectCountryTitle depositModalLimit">
                  {t("sign_up.select_state_province")}
                </p>
                <Image
                  src={images.closeIcon}
                  className="closeIconSus closeFullScreenModal"
                  alt="Close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowStates(false);
                  }}
                />
              </div>
              <div className="selectDecimal-countries d-flex searchStyle">
                <Image
                  src={images.search}
                  alt="Search icon"
                  className="countriesSearch"
                />
                <input
                  className="decimalText countryModalText searchField"
                  placeholder={t("common.search")}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
              {states
                .filter((state) =>
                  search
                    ? state.name.toLowerCase().includes(search.toLowerCase())
                    : true
                )
                .map((state) => {
                  const isActive = state.code === selectedState?.code;

                  return (
                    <div
                      key={state.code}
                      alt="Close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      className={classNames(
                        isActive
                          ? "selectDecimal-countries selectedOdd d-flex mb-3"
                          : "selectDecimal-countries d-flex mb-3 "
                      )}
                      onClick={() => {
                        let newUser = user;
                        newUser["state"] = state?.code;
                        newUser["state_name"] = state?.name;
                        dispatch(setUser(newUser));
                        setState(state);
                        setShowStates(false);
                      }}
                    >
                      <div className="selectDecimal-countries d-flex">
                        <p className="m-3 decimalText">{state.name}</p>
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
    </>
  );
};
