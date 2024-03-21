"use client";

import { useSelector } from "react-redux";
import { DesktopLoggedUser } from "../logged/DesktopLoggedUser";
import { MobileLoggedUser } from "../logged/MobileLoggedUser";
import { DesktopUnloggedUser } from "../unlogged/DesktopUnloggedUser";
import { MobileUnloggedUser } from "../unlogged/MobileUnloggedUser";
import { getLocalStorageItem } from "@/utils/localStorage";

export const Profile = () => {
  const isTablet = useSelector((state) => state.isTablet);
  const accesToken = getLocalStorageItem("access_token");
  const sidebaLeft = useSelector((state) => state.sidebarLeft);
  const sidebarLeftActive = sidebaLeft?.isActive;
  return !accesToken ? (
    <>
      {isTablet && sidebarLeftActive ? (
        <></>
      ) : isTablet ? (
        <MobileUnloggedUser />
      ) : (
        <DesktopUnloggedUser />
      )}
    </>
  ) : (
    <>
      {isTablet && sidebarLeftActive ? (
        <></>
      ) : isTablet ? (
        <MobileLoggedUser />
      ) : (
        <DesktopLoggedUser />
      )}
    </>
  );
};
