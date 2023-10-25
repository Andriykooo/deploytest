import { useTranslations } from "next-intl";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useUsageTime = () => {
  const t = useTranslations("common");
  const usageStartTime = useSelector((state) => state.usageStartTime);

  const [time, setTime] = useState("");

  useEffect(() => {
    const date1 = moment(usageStartTime);
    const date2 = moment(new Date());
    const duration = moment.duration(date2.diff(date1));

    const usageTime = [];
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (hours > 0) {
      if (hours > 1) {
        usageTime.push(`${hours} ${t("hours")}`);
      } else {
        usageTime.push(`${hours} ${t("hour")}`);
      }
    }

    if (minutes > 0) {
      if (minutes > 1) {
        usageTime.push(`${minutes} ${t("minutes")}`);
      } else {
        usageTime.push(`${minutes} ${t("minute")}`);
      }
    }

    if (seconds > 0) {
      if (seconds > 1) {
        usageTime.push(`${seconds} ${t("seconds")}`);
      } else {
        usageTime.push(`${seconds} ${t("second")}`);
      }
    }

    const timeout = setTimeout(() => {
      setTime(usageTime.join(", "));
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  });

  return time;
};
