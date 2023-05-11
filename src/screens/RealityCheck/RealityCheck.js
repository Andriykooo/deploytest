import { React, useEffect, useState } from "react";
import "../DepositLimit/DepositLimit.css";
import "../RealityCheck/RealityCheck.css";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";
import Header from "../../components/header/Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SetRealityCheck } from "../../components/modal/SetRealityCheck";
import { images } from "../../utils/imagesConstant";
import { Button } from "../../components/button/Button";
import { Skeleton } from "@mui/material";

const RealityCheck = () => {
  const user_settings = useSelector((state) => state?.user_settings);
  const realityCheckValue = useSelector(
    (state) =>
      state.loggedUser?.user_data?.settings?.safer_gambling?.reality_check
        ?.reality_check_after
  );
  const [loader, setLoader] = useState(true);
  const [realityCheck, setRealityCheck] = useState("");
  const [selectedLimit, setSelectedLimit] = useState(0);
  const [realityCheckData, setRealityCheckData] = useState({
    show: false,
    data: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    setLoader(true);

    setTimeout(() => {
      setRealityCheck(realityCheckValue?.value);
      setLoader(false);
    }, 1500);
  }, [user_settings]);

  let realityCheckTxt = ``;
  if (realityCheckValue?.value === 15) {
    realityCheckTxt = `15 minutes`;
  } else if (realityCheckValue?.value === 30) {
    realityCheckTxt = `30 minutes`;
  } else if (realityCheckValue?.value === 45) {
    realityCheckTxt = `45 minutes`;
  } else if (realityCheckValue?.value === 60) {
    realityCheckTxt = `1 hour`;
  } else {
    realityCheckTxt = `Not Set`;
  }
  let active = "active";

  return (
    <>
      <Header />
      <div className="backgroundLinear ">
        <div className="d-none d-lg-block ">
          <ProfileMenu sideBarMenu page="safer_gambling" active={active} />
        </div>
        <div className="depositLimit max-width-container">
          <div className="d-flex arrow-top">
            <img
              src={images.goBackArrow}
              alt="Go back"
              className="goBackArrow ms-0 mb-3"
              onClick={() => navigate(-1)}
            />
          </div>
          <p className="menuTitle arrow-top">Reality Check </p>
          <p className="menuText">
            Get notified when you have been on the app for a certain period of
            time.
          </p>

          <div className="mb-3 d-flex">
            <div className="subText me-4 col-6">Reality check after</div>

            <div className="selectDepositDiv col-6">
              <Button
                type="button"
                className={"setLimit"}
                onClick={() => {
                  setRealityCheckData({
                    ...realityCheckData,
                    show: true,
                    data: user_settings?.reality_check_options,
                  });
                }}
                text={
                  <>
                    {loader ? (
                      <div className="d-flex justify-content-between">
                        <Skeleton
                          variant="rectangular"
                          className="my-2 depositSkeleton"
                          animation="wave"
                        />
                      </div>
                    ) : (
                      realityCheckTxt
                    )}
                    <img
                      src={images.arrowIcon}
                      className="depositLimitArrow"
                      alt="Click"
                    />
                  </>
                }
              />
            </div>
          </div>
        </div>
        {realityCheckData.show && (
          <>
            <div className="modal-overlay">
              <SetRealityCheck
                options={realityCheckData.data}
                selectedLimit={selectedLimit}
                setSelectedLimit={setSelectedLimit}
                realityCheck={realityCheck}
                setRealityCheck={setRealityCheck}
                setRealityCheckData={setRealityCheckData}
                realityCheckData={realityCheckData}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RealityCheck;
