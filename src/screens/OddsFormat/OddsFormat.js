"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import ProfileBack from "@/components/profileBack/ProfileBack";
import { setLoggedUser } from "../../store/actions";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl, oddsFormatTypes } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import "../OddsFormat/OddsFormat.css";

const OddsFormat = () => {
  const loggedUser = useSelector((state) => state.loggedUser);
  const dispatch = useDispatch();
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

  return (
    <div className="depositLimit">
      <ProfileBack />
      <p className="menuTitle mb-5">Odds Format</p>
      {oddsFormatTypes.map((value, index) => {
        return (
          <div
            key={index}
            data-id={index}
            onClick={() => handleClick(value.id)}
            className={
              loggedUser?.user_data?.settings?.odds_format === value.id
                ? "col-6 selectDecimal selectedOdd d-flex mb-3"
                : "col-6 selectDecimal d-flex mb-3"
            }
          >
            <span className="">
              <p className="m-3 decimalText">{value.format}</p>
            </span>
            {loggedUser?.user_data?.settings?.odds_format === value.id ? (
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
  );
};

export default OddsFormat;
