"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserSettings } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import "../Profile/Profile.css";
import "../SaferGambling/SaferGambling.css";
import "../Withdraw/Withdraw.css";
import ProfileBack from "@/components/profileBack/ProfileBack";

export const SaferGambling = () => {
  const isTablet = useSelector((state) => state.isTablet)
  const dispatch = useDispatch();

  useEffect(() => {
    apiServices.get(apiUrl.SETTING_OPTIONS).then((response) => {
      dispatch(setUserSettings(response));
    });
  }, []);
  const saferGambling = [
    {
      title: "Deposit Limits",
      link: "/profile/deposit_limit",
      desc: "Set deposit limits to control your spending",
    },
    {
      title: "Gaming Reminders",
      link: "/profile/reality_check",
      desc: "Control your game time with reminders",
    },
    {
      title: "Suspend Account",
      link: "/profile/suspend_account",
      desc: "Take a break from Swifty Gaming",
    },
    {
      title: "Self Exclude",
      link: "/profile/self_exclude",
      desc: "Excluded yourself from Swifty Gaming",
    },
    {
      title: "More information",
      link: "/profile/safer_gambling_information",
      desc: "Read about Safer Gambling",
    },
  ];

  return (
    <div className="pageContent-safer">
      <div className="depositLimit saferContainer">
        <ProfileBack showOnDesktop />

        <div>
          <p className="menuTitle">Safer Gambling </p>
        </div>
        <div className="row saferDivs">
          <div>
            {saferGambling.map((row, index) => {
              return (
                <div className="infoDiv saferInfo mb-3" key={index}>
                  <Link href={row.link}>
                    <p className="saferTitle m-2">{row.title}</p>
                    {!isTablet && <p className="saferMessage m-2 ">{row.desc}</p>}
                    <Image
                      alt="img-arrowIcon"
                      src={images.arrowIcon}
                      className="profileArrow"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="mb-3 yellowDiv d-flex">
            <Image
              src={images.whenTheFun}
              alt="Safer Gambling"
              className="m-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
