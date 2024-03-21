"use client";

import { destroySession, setLoggedUser } from "@/store/actions";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { clearLocalStorage, getLocalStorageItem } from "@/utils/localStorage";
import { useDispatch } from "react-redux";
import { disconnectSocket } from "@/context/socket";
import { nextWindow } from "@/utils/nextWindow";

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = () => {
    apiServices
      .post(apiUrl.SIGN_OUT, {
        device_id: getLocalStorageItem("device_id"),
        tab_id: getLocalStorageItem("tab_id"),
      })
      .then(() => {
        clearLocalStorage();
        dispatch(destroySession());
        dispatch(setLoggedUser(false));
        disconnectSocket();
        nextWindow.location.href = "/";
      });
  };

  return logout;
};
