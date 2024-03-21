"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveSport } from "../../store/actions";
import classNames from "classnames";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { getLocalStorageItem } from "@/utils/localStorage";

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

export const Logo = ({
  handleNavigateHome,
  className,
  noRedirect,
  alwaysDesktop,
}) => {
  const router = useCustomRouter();
  const dispatch = useDispatch();

  const [isTablet, setIsTablet] = useState(
    window.document.documentElement.clientWidth <= 1024
  );

  const [desktopLogo, setDesktopLogo] = useState(
    getLocalStorageItem("desktop_logo") || `${imageUrl}/logo.png`
  );
  const [mobileLogo, setMobileLogo] = useState(
    getLocalStorageItem("mobile_logo") || `${imageUrl}/icon.png`
  );

  const resizeHandler = () => {
    setIsTablet(window.document.documentElement.clientWidth <= 1024);
  };

  useEffect(() => {
    resizeHandler();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const redirect = () => {
    if (handleNavigateHome) {
      handleNavigateHome?.(false);
    } else {
      router.push("/");
    }
  };

  return (
    <img
      className={classNames("logo", className)}
      src={isTablet && !alwaysDesktop ? mobileLogo : desktopLogo}
      alt="logo"
      onError={() => {
        setDesktopLogo(`${imageUrl}/logo.png`);
        setMobileLogo(`${imageUrl}/icon.png`);
      }}
      onClick={() => {
        if (!noRedirect) {
          redirect();
          dispatch(setActiveSport(null));
        }
      }}
    />
  );
};
