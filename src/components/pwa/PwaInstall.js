"use client";

import { getLocalStorageItem } from "@/utils/localStorage";
import "@khmyznikov/pwa-install";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const PwaInstall = () => {
  const isLogged = useSelector((state) => state.loggedUser);
  const searchParams = useSearchParams();
  const queryPwa = searchParams.get("pwa");
  const isPwaShown = Cookies.get("isPwaShown");

  useEffect(() => {
    let pwa = document.getElementById("pwa-install");

    if (queryPwa === "show") {
      pwa.showDialog();
      return;
    } else if (!isPwaShown && isLogged && getLocalStorageItem("access_token")) {
      pwa.showDialog();
      Cookies.set("isPwaShown", "shown");

      return;
    }
  }, [queryPwa, isLogged]);

  return <pwa-install id="pwa-install" manifest-url="/manifest.json" />;
};
