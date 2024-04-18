"use client";

import React from "react";

import "./CookieBanner.css";
import CookieConsent from "react-cookie-consent";
import { useTranslations } from "@/hooks/useTranslations";

const CookieBanner = () => {
  const t = useTranslations("common");
  return (
    <CookieConsent
      disableStyles
      flipButtons
      enableDeclineButton
      location="bottom"
      cookieName="CookieAccepted"
      buttonText={t("accept_all")}
      declineButtonText={t("reject_all")}
      declineButtonClasses="reject-btn cookie-button"
      buttonWrapperClasses="cookie-buttons"
      buttonClasses="accept-btn cookie-button"
      containerClasses="cookies-container"
    >
      <p className="cookies-title">{t("we_use_cookie")}</p>
      <p className="cookies-description mb-0">{t("cookie_message")}</p>
    </CookieConsent>
  );
};

export default CookieBanner;
