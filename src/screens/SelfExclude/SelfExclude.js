"use client";

import { nextWindow } from "@/utils/nextWindow";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import Header from "../../components/header/Header";
import { Loader } from "../../components/loaders/Loader";
import { SetSelfExclude } from "../../components/modal/SetSelfExclude";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";
import { setLoggedUser } from "../../store/actions";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import "./SelfExclude.css";

const SelfExclude = () => {
  const [excludeData, setExcludeData] = useState({
    show: false,
    data: [],
  });
  const [loader, setLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState(-1);
  const [excludePeriod, setExcludePeriod] = useState(false);
  const excludeValue = useSelector(
    (state) =>
      state.loggedUser?.user_data?.settings?.safer_gambling?.self_exclude
        ?.self_exclude_deactivated
  );
  const user = useSelector((state) => state.loggedUser);
  const user_settings = useSelector((state) => state?.user_settings);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoader(true);

    setTimeout(() => {
      setExcludePeriod(excludeValue);
      setLoader(false);
    }, 1500);
  }, [excludeValue]);

  const handleSetLimit = () => {
    const body = {
      self_exclude_deactivated: excludePeriod,
    };
    apiServices
      .put(apiUrl.SETTINGS, body)
      .then(() => {
        SuccesToast({ message: "Successfully updated!" });
        setIsLoading(false);
        setExcludeData({
          ...excludeData,
          show: false,
          data: [],
        });
        let newUser = {};
        Object.assign(newUser, user);
        newUser.user_data.settings.safer_gambling.self_exclude.self_exclude_deactivated =
          excludePeriod;
        dispatch(setLoggedUser(newUser));
        removeLocalStorageItem("access_token");
        removeLocalStorageItem("refresh_token");

        setTimeout(() => {
          nextWindow.location.replace("/login");
          setTimeout(() => {
            nextWindow.location.reload();
          }, 500);
        }, 500);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  var excludeText = "";
  if (excludePeriod === 6) {
    excludeText = "6 Months";
  } else if (excludePeriod === 12) {
    excludeText = "1 Year";
  } else if (excludePeriod === 24) {
    excludeText = "2 Years";
  } else if (excludePeriod === 60) {
    excludeText = "5 Years";
  } else {
    excludeText = "Not Set";
  }

  return (
    <>
      <Header />
      <div className="backgroundLinear">
        <div className="d-none d-lg-block">
          <ProfileMenu sideBarMenu page="safer_gambling" active={"active"} />
        </div>
        <div className="selfExcludePage">
          <div className="d-flex arrow-top">
            <Image
              src={images.goBackArrow}
              alt="Go back"
              className="goBackArrow ms-0 mb-3"
              onClick={() => router.back()}
            />
          </div>
          <p className="menuTitle arrow-top">Self exclude</p>
          <p className="menuText">
            If you feel you are spending too much time wagering or are at risk
            of doing so and developing a gambling problem, please consider
            self-exclusion.
          </p>
          <p className="menuText">
            If you have any open wagers at the time of excluding, any winnings
            will be credited to your account in the normal way and you can
            contact our customer service team to arrange payment.
          </p>
          <p className="menuText">
            For further advice please check the links below. <br />
            GamCare: www.gamcare.org.uk
            <br />
            Gam-Anon: www.gamanon.org.uk
            <br />
            GambleAware: www.begambleaware.org
            <br />
          </p>
          <div className="row mb-3 menuText">
            <div className="col-6 subText">Deactivate account for</div>
            <div className="col-6 selectDepositDiv selfExcludeStyle">
              <Button
                type="button"
                className={"setLimit"}
                onClick={() => {
                  setExcludeData({
                    ...excludeData,
                    show: true,
                    data: user_settings?.self_exclude_deactivate_options,
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
                      excludeText
                    )}
                    <Image
                      src={images.arrowIcon}
                      className="depositLimitArrow"
                      alt="Click"
                    />
                  </>
                }
              />
            </div>
          </div>
          <div className="row menuText ps-2">
            <Button
              className={
                "setLimit suspendAccBtn " +
                (excludePeriod
                  ? " btnPrimary "
                  : "btn finishBtn disabled setLimitBtn col-8")
              }
              onClick={() => excludePeriod && handleSetLimit()}
              text={<>{isLoading ? <Loader /> : "Deactivate account"}</>}
            />
          </div>
        </div>
        {excludeData.show && (
          <>
            <div className="modal-overlay">
              <SetSelfExclude
                excludeData={excludeData}
                setExcludeData={setExcludeData}
                selectedLimit={selectedLimit}
                setSelectedLimit={setSelectedLimit}
                excludePeriod={excludePeriod}
                setExcludePeriod={setExcludePeriod}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SelfExclude;
