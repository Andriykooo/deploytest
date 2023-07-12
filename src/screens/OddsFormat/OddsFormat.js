"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/Header";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";
import { setLoggedUser } from "../../store/actions";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl, oddsFormatTypes } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import "../OddsFormat/OddsFormat.css";

const OddsFormat = () => {
  const loggedUser = useSelector((state) => state.loggedUser);
  const dispatch = useDispatch();
  let active = "active";
  const handleClick = (key) => {
    const body = {
      odds_format: key,
    };
    apiServices.put(`${apiUrl.SETTINGS}`, body).then((result) => {
      if (Object.keys(result).length < 1) {
        let newUser = {};
        Object.assign(newUser, loggedUser);
        newUser.user_data.settings.odds_format = key;
        dispatch(setLoggedUser(newUser));
      }
      SuccesToast({ message: "Odds format updated!" });
    });
  };
  const router = useRouter();

  return (
    <>
      <Header />
      <div className=" backgroundLinear ">
        <div className="d-none d-lg-block ">
          <ProfileMenu sideBarMenu page="odds_format" active={active} />
        </div>
        <div className="depositLimit">
          <div className="d-flex d-lg-none">
            <div className="d-flex ">
              <Image
                src={images.goBackArrow}
                alt="Go back"
                className="goBackArrow ms-0 mb-3"
                onClick={() => router.push("/profile")}
              />
            </div>
          </div>
          <p className="menuTitle mb-5">Odds Format</p>
          {oddsFormatTypes.map((value, index) => {
            return (
              <div
                key={index}
                data-id={index}
                onClick={() => handleClick(value.id)}
                className={
                  loggedUser.user_data.settings.odds_format === value.id
                    ? "col-6 selectDecimal selectedOdd d-flex mb-3"
                    : "col-6 selectDecimal d-flex mb-3"
                }
              >
                <span className="">
                  <p className="m-3 decimalText">{value.format}</p>
                </span>
                {loggedUser.user_data.settings.odds_format === value.id ? (
                  <Image
                    src={images.validated}
                    alt="selected"
                    className="oddsSelected"
                  />
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default OddsFormat;
