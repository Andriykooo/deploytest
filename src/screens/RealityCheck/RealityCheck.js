"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { images } from "../../utils/imagesConstant";
import "../DepositLimit/DepositLimit.css";
import "../RealityCheck/RealityCheck.css";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { SuccesToast } from "@/utils/alert";
import { setLoggedUser } from "@/store/actions";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";

const RealityCheck = () => {
  const user_settings = useSelector((state) => state?.user_settings);
  let user = useSelector((state) => state.loggedUser);
  const realityCheckValue = useSelector(
    (state) =>
      state.loggedUser?.user_data?.settings?.safer_gambling?.reality_check
        ?.reality_check_after
  );

  const [loader, setLoader] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [realityCheck, setRealityCheck] = useState("");
  const [selectedLimit, setSelectedLimit] = useState(realityCheckValue?.value);
  const [realityCheckData, setRealityCheckData] = useState({
    show: false,
    data: [],
  });
  const router = useRouter();
  const dispatch = useDispatch();

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

  const handleToggle = () => {
    setRealityCheckData({
      ...realityCheckData,
      show: !realityCheckData.show,
      data: user_settings?.reality_check_options,
    });
    setSelectedLimit(realityCheckValue?.value)
    setDisabled(true);
  };

  const handleSelect = () => {
    setLoader(true)
    const body = {
      reality_check_after: selectedLimit,
    };
    apiServices
      .put(apiUrl.SETTINGS, body)
      .then(() => {
        SuccesToast({ message: "Successfully updated!" });
        setDisabled(true);
        setRealityCheckData({
          ...realityCheckData,
          show: false,
          data: [],
        });
        let newUser = {};
        Object.assign(newUser, user);
        newUser.user_data.settings.safer_gambling.reality_check.reality_check_after.value =
          value;
        dispatch(setLoggedUser(newUser));
        setLoader(false)
      })
      .catch(() => { setLoader(false)});
    setRealityCheckData({ ...realityCheckData, show: false });
  };

  return (
    <>
      <div className="depositLimit max-width-container gamblingContainer">
        <div>
          <div className="d-flex arrow-top">
          <Image
            src={images.goBackArrow}
            alt="Go back"
            className="ms-0 mb-3"
            onClick={() => router.back()}
          />
        </div>
        <p className="menuTitle arrow-top">Reality Check </p>
        <p className="menuText">
          Get notified when you have been on the app for a certain period of
          time.
        </p>

        <div className="mb-3 row">
          <div className="subText col-6">Reality check after</div>

          <PreferencesDropdown
            data={{...realityCheckData, title: "Reality Check"}}
            selectedItem={selectedLimit}
            handleToggle={handleToggle}
            handleSelect={(v) => {
              setSelectedLimit(v);
              setDisabled(false);
              setRealityCheckData({
                ...realityCheckData,
                show: !realityCheckData.show,
                data: user_settings?.reality_check_options,
              });
            }}
            placeholder={
              (selectedLimit ? selectedLimit : realityCheckValue?.value) +
              " minutes"
            }
            loader={loader}
            modalOnMobile
            btnTitle="Set limit"
          />
        </div>
        </div>
        <div className="row suspendButton">
          <Button
            className={
              "setLimit suspendAccBtn w-100 " +
              (!disabled
                ? " btnPrimary "
                : "btn finishBtn disabled setLimitBtn col-8")
            }
            onClick={() => selectedLimit && handleSelect()}
            text={<>{loader ? <Loader /> : "Set limit"}</>}
          />
        </div>
      </div>
    </>
  );
};

export default RealityCheck;
