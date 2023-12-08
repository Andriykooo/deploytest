"use client";

import { disconnectSocket } from "@/context/socket";
import { destroySession } from "@/store/actions";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { clearLocalStorage, getLocalStorageItem } from "@/utils/localStorage";
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
        disconnectSocket();
        dispatch(destroySession());
      });
  };

  return logout;
};
