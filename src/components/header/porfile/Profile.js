"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { DesktopLoggedUser } from "../logged/DesktopLoggedUser";
import { MobileLoggedUser } from "../logged/MobileLoggedUser";
import { DesktopUnloggedUser } from "../unlogged/DesktopUnloggedUser";
import { MobileUnloggedUser } from "../unlogged/MobileUnloggedUser";
import { getLocalStorageItem } from "@/utils/localStorage";

export const Profile = () => {
  const loggedUser = useSelector((state) => state.loggedUser);
  const isTablet = useSelector((state) => state.isTablet);
  const accesToken = getLocalStorageItem("access_token");

  return !loggedUser?.user_data || !accesToken ? (
    <>{isTablet ? <MobileUnloggedUser /> : <DesktopUnloggedUser />}</>
  ) : (
    <>{isTablet ? <MobileLoggedUser /> : <DesktopLoggedUser />}</>
  );
};
