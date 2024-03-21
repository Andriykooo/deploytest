import { eventStatus } from "@/utils/constants";
import { useTranslations } from "next-intl";
import "./BetChip.css";

export const BetChip = ({ variant }) => {
  const t = useTranslations();

  if (variant === eventStatus.PARTIAL) {
    return <div className="bet-chip partial">{t("partial")}</div>;
  }

  if (variant === eventStatus.PUSHED) {
    return <div className="bet-chip pushed">{t("pushed")}</div>;
  }

  return null;
};
