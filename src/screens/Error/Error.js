"use client";

import { CustomLink } from "@/components/Link/Link";
import { Logo } from "@/components/logo/Logo";
import { images } from "@/utils/imagesConstant";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { destroySession, setNotFound } from "@/store/actions";
import { clearLocalStorage } from "@/utils/localStorage";
import { disconnectSocket } from "@/context/socket";
import "../NotFound/NotFound.css";

export const Error = () => {
  const t = useTranslations();
  const dispatch = useDispatch();

  useEffect(() => {
    clearLocalStorage();
    disconnectSocket();
    dispatch(destroySession());
    dispatch(setNotFound(true));

    return () => {
      dispatch(setNotFound(false));
    };
  }, []);

  return (
    <div className="error-page">
      <div className="header-of-error-component">
        <Logo />
      </div>
      <div className="error-content flex-column">
        <div className="mb-3">
          <Image src={images.emptyState} height={40} width={40} alt="warning" />
        </div>
        <span>{t("common.something_went_wrong")}</span>
        <CustomLink href="/">
          <button className="btnPrimary error-page-navigation-button mt-4">
            {t("not_found.go_to_homepage")}
            <Image
              src={images.arrowRight}
              className="error-page-arrow"
              height={14}
              width={14}
              alt="arrow"
            />
          </button>
        </CustomLink>
      </div>
    </div>
  );
};
