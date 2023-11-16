import { formatOdd } from "@/utils/global";
import { useSelector } from "react-redux";

export const Odds = ({ selection }) => {
  const user = useSelector((state) => state.loggedUser);
  const settings = useSelector((state) => state.settings);
  const format = user?.user_data?.settings?.odds_format || settings?.default_odds_format;

  return formatOdd(selection, format);
};
