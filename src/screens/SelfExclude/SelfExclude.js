"use client";

import { nextWindow } from "@/utils/nextWindow";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { setLoggedUser } from "@/store/actions";
import { SuccesToast } from "@/utils/alert";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import { removeLocalStorageItem } from "@/utils/localStorage";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import { images } from "@/utils/imagesConstant";
import "./SelfExclude.css";
import { setSettingsApi } from "@/utils/apiQueries";

const SelfExclude = () => {
  const [excludeData, setExcludeData] = useState({
    show: false,
    data: [],
  });
  const [loader, setLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [excludePeriod, setExcludePeriod] = useState(false);
  const excludeValue = useSelector(
    (state) =>
      state.loggedUser?.user_data?.settings?.safer_gambling?.self_exclude
        ?.self_exclude_deactivated
  );
  const user = useSelector((state) => state.loggedUser);
  const user_settings = useSelector((state) => state?.user_settings);
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
    setSettingsApi(body, dispatch)
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

  const handleToggle = () => {
    setExcludeData({
      ...excludeData,
      show: !excludeData.show,
      data: user_settings?.self_exclude_deactivate_options,
    });
  };

  const handleSetSelectedLimit = (value) => {
    setExcludePeriod(value);
    setIsLoading(false);
    handleToggle();
  };

  return (
    <>
      <div className="max-width-container selfExcludePage gamblingContainer">
        <div>
          <PreferencesTitle
            title="Self exclude"
            backRoute="/profile/safer_gambling"
            marginBottomSize="sm"
            showBackOnDesktop
          />
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
          <div className="row mb-3">
            <div className="col-6 subText">Deactivate account for</div>
            <PreferencesDropdown
              data={{ ...excludeData, title: "Self exclude" }}
              selectedItem={excludeValue}
              handleToggle={handleToggle}
              handleSelect={(v) => {
                handleSetSelectedLimit(v);
              }}
              placeholder={excludeText}
              loader={loader}
              btnTitle="Set limit"
              modalOnMobile
            />
          </div>
        </div>
        <div className="row suspendButton">
          <Button
            className={
              "setLimit suspendAccBtn w-100 " +
              (excludePeriod
                ? " btnPrimary "
                : "btn finishBtn disabled setLimitBtn col-8")
            }
            onClick={() => excludePeriod && handleSetLimit()}
            text={<>{isLoading ? <Loader /> : "Deactivate account"}</>}
          />
        </div>
      </div>
    </>
  );
};

export default SelfExclude;
