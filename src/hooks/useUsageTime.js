import { useTranslations } from "next-intl";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useUsageTime = (value) => {
  const t = useTranslations("common");
  const usageTime = useSelector((state) => state.usageTime);

  const [time, setTime] = useState("");

  useEffect(() => {
    const duration = moment.duration(value || usageTime, "minutes");

    const formattedTime = [];
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    if (hours > 0) {
      if (hours > 1) {
        formattedTime.push(`${hours} ${t("hours")}`);
      } else {
        formattedTime.push(`${hours} ${t("hour")}`);
      }
    }

    if (minutes > 0) {
      if (minutes > 1) {
        formattedTime.push(`${minutes} ${t("minutes")}`);
      } else {
        formattedTime.push(`${minutes} ${t("minute")}`);
      }
    }

    setTime(formattedTime.join(", "));
  }, [usageTime, value]);

  return time;
};
