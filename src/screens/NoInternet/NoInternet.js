"use client";

import { useTranslations } from "next-intl";
import "./NoInternet.css";
import { WarningIcon } from "@/utils/icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useInternetStatus } from "@/hooks/useInternetStatus";

export const NoInternet = () => {
  const t = useTranslations();
  const router = useRouter();
  const isOnline = useInternetStatus();

  useEffect(() => {
    if (isOnline) {
      router.back();
    }
  }, [isOnline, router]);

  return (
    <div className="no-internet-page-wrapper">
      <div className="no-internet-page">
        <WarningIcon className="no-internet-icon" />
        <h3 className="no-internet-title">
          {t("no_internet.there_is_no_internet")}
        </h3>
        <p className="no-internet-description">
          {t("no_internet.please_check_your_connection")}
        </p>
      </div>
    </div>
  );
};
