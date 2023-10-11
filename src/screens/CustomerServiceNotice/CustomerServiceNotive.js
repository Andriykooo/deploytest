"use client";

import { images } from "@/utils/imagesConstant";
import "./CustomerServiceNotive.css";
import Image from "next/image";
import { useClientTranslation } from "@/app/i18n/client";
import { useEffect } from "react";
import { apiUrl } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSettings } from "@/store/actions";

export const CustomerServiceNotice = () => {
  const { t } = useClientTranslation(["customer_service_notice", "common"]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    axios.get(apiUrl.GET_SETTINGS).then((result) => {
      dispatch(setSettings(result));

      if (!result?.data?.isCountryBlocked) {
        router.replace("/");
      }
    });
  }, []);

  return (
    <div className="customer-service-notice-wrapper">
      <div className="customer-service-notice">
        {/* <Logo className="customer-service-notice-logo" /> */}
        <Image
          src={images.GroupSwifty}
          alt="logo"
          className="customer-service-notice-logo"
        />
        <h1 className="customer-service-notice-title">
          {t("common:customer_service_notice")}
        </h1>
        <p className="customer-service-notice-subtitle">
          {t("thank_you_for_visiting")}
          <br />
          {t("site_blocks_access_from_certain_territories")}
        </p>
        <p className="customer-service-notice-description">
          {t("restricted_country_access_notice")}
        </p>
        <a
          href="mailto:customer.services@swiftygaming.com"
          className="customer-service-notice-email"
        >
          customer.services@swiftygaming.com
        </a>
        <p className="customer-service-notice-description">
          {t("apology_for_inconvenience")}
        </p>
      </div>
    </div>
  );
};
