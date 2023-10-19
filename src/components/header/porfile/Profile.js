"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DesktopLoggedUser } from "../logged/DesktopLoggedUser";
import { MobileLoggedUser } from "../logged/MobileLoggedUser";
import { DesktopUnloggedUser } from "../unlogged/DesktopUnloggedUser";
import { MobileUnloggedUser } from "../unlogged/MobileUnloggedUser";
import { nextWindow } from "@/utils/nextWindow";
import { getLocalStorageItem } from "@/utils/localStorage";
import { useClientPathname } from "@/hooks/useClientPathname";

export const Profile = () => {
  const {pathname} = useClientPathname();
  const loggedUser = useSelector((state) => state.loggedUser);
  const isTablet = useSelector((state) => state.isTablet);
  const accesToken = getLocalStorageItem("access_token");

  const isActiveBetslip = () =>
    pathname.indexOf("/match") > -1 ||
    pathname.indexOf("/sport") > -1 ||
    pathname.indexOf("/home-page") > -1 ||
    pathname === "/" ||
    pathname.indexOf("/inplay") > -1;

  const [showBetSlip, setSHowBetslip] = useState(isActiveBetslip());

  const handleResize = () => {
    setSHowBetslip(isActiveBetslip());
  };

  useEffect(() => {
    nextWindow.addEventListener("resize", handleResize);

    return () => {
      nextWindow.removeEventListener("resize", handleResize);
    };
  });

  return !loggedUser?.user_data || !accesToken ? (
    <>
      {isTablet ? (
        <MobileUnloggedUser showBetSlip={showBetSlip} />
      ) : (
        <DesktopUnloggedUser showBetSlip={showBetSlip} />
      )}
    </>
  ) : (
    <>
      {isTablet ? (
        <MobileLoggedUser showBetSlip={showBetSlip} />
      ) : (
        <DesktopLoggedUser showBetSlip={showBetSlip} />
      )}
    </>
  );
};
