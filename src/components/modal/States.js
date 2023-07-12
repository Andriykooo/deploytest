import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/actions";
import { images } from "../../utils/imagesConstant";
import Image from "next/image";

export const States = ({
  states,
  setCountryState,
  showStates,
  setShowStates,
  handle,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  return (
    <>
      <div
        className="modal show "
        id="limitModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={showStates ? { display: "block" } : { display: "block" }}
      >
        <div className="modal-dialog modal-fullscreen ">
          <div className="modal-content fScreen mt-0 p-2">
            <div className="modal-content-inside">
              <div className="modalTitle">
                <p className="selectCountryTitle depositModalLimit">
                  Select state or province
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
              <div className="selectDecimal d-flex mb-5">
                <Image
                  src={images.search}
                  alt="Search icon"
                  className="countriesSearch"
                />
                <input
                  className=" decimalText searchField"
                  placeholder="Search"
                  onChange={(e) => handle(e, "state")}
                />
              </div>
              {states.map((state, index) => {
                return (
                  <div
                    key={index}
                    alt="Close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    className={
                      state.code === user?.state
                        ? "selectDecimal selectedOdd d-flex mb-3"
                        : "selectDecimal d-flex mb-3 "
                    }
                    onClick={() => {
                      setCountryState(state.name);
                      let newUser = user;
                      newUser["state"] = state?.code;
                      newUser["state_name"] = state?.name;
                      dispatch(setUser(newUser));
                      setShowStates(false);
                    }}
                  >
                    <div className="selectDecimal d-flex">
                      <p className="m-3 decimalText">{state.name}</p>
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
};
