import { formatOdd } from "@/utils/global";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";

export const Odds = ({ selection, sp, currentStatus, providerSuspended }) => {
  const t = useTranslations("");
  const user = useSelector((state) => state.loggedUser);
  const settings = useSelector((state) => state.settings);
  const format =
    user?.user_data?.settings?.odds_format || settings?.default_odds_format;

  return formatOdd(
    selection,
    format,
    sp && t("racecard.sp"),
    currentStatus,
    providerSuspended
  );
};
