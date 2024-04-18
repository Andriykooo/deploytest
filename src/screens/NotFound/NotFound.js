"use client";

import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";
import { Logo } from "@/components/logo/Logo";
import { CustomLink } from "@/components/Link/Link";
import "./NotFound.css";
import { nextWindow } from "@/utils/nextWindow";

export const NotFoundScreen = () => {
  const t = useTranslations("not_found");

  return (
    <div className="error-page">
      <div className="header-of-error-component">
        <Logo />
      </div>
      <div className="error-content" style={{ height: nextWindow.innerHeight }}>
        <div className="error-number">404</div>
        <div className="error-redirect">
          <p className="error-title">{t("oops_exclamation")}</p>
          <p className="error-description">{t("page_not_found")}</p>
          <div className="error-page-navigation">
            <CustomLink href="/">
              <button className="btnPrimary error-page-navigation-button">
                {t("go_to_homepage")}
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
      </div>
    </div>
  );
};
