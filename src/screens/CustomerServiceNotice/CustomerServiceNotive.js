"use client";

import { images } from "@/utils/imagesConstant";
import "./CustomerServiceNotive.css";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { apiUrl } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setSettings } from "@/store/actions";
import { Logo } from "@/components/logo/Logo";
import { useCustomRouter } from "@/hooks/useCustomRouter";

export const CustomerServiceNotice = () => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const router = useCustomRouter();
  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    axios.get(apiUrl.GET_SETTINGS).then((result) => {
      dispatch(setSettings(result.data));

      if (!result?.data?.is_country_blocked) {
        router.replace("/");
      }
    });
  }, []);

  return (
    <div className="customer-service-notice-wrapper">
      <div className="customer-service-notice">
        <Logo className="customer-service-notice-logo" />
        <h1 className="customer-service-notice-title">
          {t("common.customer_service_notice")}
        </h1>
        <p className="customer-service-notice-subtitle">
          {t("customer_service_notice.thank_you_for_visiting", {
            company: settings?.company_name,
          })}
          <br />
          {t(
            "customer_service_notice.site_blocks_access_from_certain_territories"
          )}
        </p>
        <p className="customer-service-notice-description">
          {t("customer_service_notice.restricted_country_access_notice")}
        </p>
        <a
          href={`mailto:${settings?.company_service_email}`}
          className="customer-service-notice-email"
        >
          {settings?.company_service_email}
        </a>
        <p className="customer-service-notice-description">
          {t("customer_service_notice.apology_for_inconvenience")}
        </p>
      </div>
    </div>
  );
};
