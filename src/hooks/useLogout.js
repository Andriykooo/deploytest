"use client";

import { refreshGamingSocket } from "@/context/socket";
import { destroySession } from "@/store/actions";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { clearLocalStorage, getLocalStorageItem } from "@/utils/localStorage";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = () => {
    apiServices
      .post(apiUrl.SIGN_OUT, {
        device_id: getLocalStorageItem("device_id"),
      })
      .finally(() => {
        clearLocalStorage();
        refreshGamingSocket(null);
        dispatch(destroySession());

        const cookieKeys = Object.keys(Cookies.get());

        cookieKeys.forEach((cookieKey) => {
          Cookies.remove(cookieKey);
        });
      });
  };

  return logout;
};
