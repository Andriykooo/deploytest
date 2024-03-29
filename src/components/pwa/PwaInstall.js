"use client";

import { getLocalStorageItem } from "@/utils/localStorage";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import "@khmyznikov/pwa-install";

const PwaInstall = () => {
  const userData = useSelector((state) => state.loggedUser);
  const searchParams = useSearchParams();
  const queryPwa = searchParams.get("pwa");
  const showPwa = useMemo(() => Cookies.get("showPwa"), []);
  const isMobile = useSelector((state) => state.setMobile);
  const displayPwa =
    (isMobile &&
      showPwa !== "shown" &&
      userData?.user_data &&
      getLocalStorageItem("access_token")) ||
    queryPwa === "show";

  useEffect(() => {
    const pwa = document.getElementById("pwa-install");

    if (displayPwa) {
      Cookies.set("showPwa", "shown");

      pwa.showDialog();
    } else {
      pwa.hideDialog();
    }
  }, [queryPwa, userData, isMobile]);

  return (
    <pwa-install
      manual-apple="true"
      manual-chrome="true"
      id="pwa-install"
      manifest-url="/manifest.json"
    />
  );
};

export default PwaInstall;
