"use client";

import { Logo } from "@/components/logo/Logo";
import { images } from "@/utils/imagesConstant";
import { useTranslations } from "@/hooks/useTranslations";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetSession } from "@/store/actions";
import { nextWindow } from "@/utils/nextWindow";
import Image from "next/image";
import "../NotFound/NotFound.css";

export const Error = ({ reset }) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const router = useCustomRouter();

  useEffect(() => {
    dispatch(resetSession());
  }, []);

  return (
    <div className="error-page">
      <div className="header-of-error-component">
        <Logo />
      </div>
      <div
        className="error-content flex-column"
        style={{ height: nextWindow.innerHeight }}
      >
        <div className="mb-3">
          <Image src={images.emptyState} height={40} width={40} alt="warning" />
        </div>
        <span>{t("common.something_went_wrong")}</span>
        <button
          className="btnPrimary error-page-navigation-button mt-4"
          onClick={() => {
            reset();
            router.push("/");
          }}
        >
          {t("not_found.go_to_homepage")}
          <Image
            src={images.arrowRight}
            className="error-page-arrow"
            height={14}
            width={14}
            alt="arrow"
          />
        </button>
      </div>
    </div>
  );
};
