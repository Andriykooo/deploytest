"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { WarningIcon } from "@/icons/WarningIcon";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useInternetStatus } from "@/hooks/useInternetStatus";
import "./NoInternet.css";

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
