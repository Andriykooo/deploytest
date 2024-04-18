"use client";

import { Logo } from "@/components/logo/Logo";
import { useTranslations } from "@/hooks/useTranslations";
import { useDispatch, useSelector } from "react-redux";
import { setSettings } from "@/store/actions";
import { apiUrl } from "@/utils/constants";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { useEffect } from "react";
import axios from "axios";
import "../CustomerServiceNotice/CustomerServiceNotive.css";

export const Maintenance = () => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const router = useCustomRouter();
  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    axios.get(apiUrl.GET_SETTINGS).then((result) => {
      dispatch(setSettings(result.data));

      router.replace("/");
    });
  }, []);

  return (
    <div className="customer-service-notice-wrapper">
      <div className="customer-service-notice">
        <Logo className="customer-service-notice-logo" alwaysDesktop />
        <h1 className="customer-service-notice-title">
          {t("maintenance.title")}
        </h1>
        <p className="customer-service-notice-description">
          {t("maintenance.description_1")}
          <br /> {t("maintenance.description_2")}
        </p>
        <a
          href={`mailto:${
            settings?.company_service_email ||
            "customer.services@swiftygaming.com"
          }`}
          className="customer-service-notice-email"
        >
          {settings?.company_service_email ||
            "customer.services@swiftygaming.com"}
        </a>
      </div>
    </div>
  );
};
