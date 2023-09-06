import { formatOdd } from "@/utils/global";
import { useSelector } from "react-redux";

export const Odds = ({ selection }) => {
  const user = useSelector((state) => state.loggedUser);
  const settings = useSelector((state) => state.settings);
  const format = user?.user_data?.settings?.odds_format || settings?.defaultOddsFormat;

  return formatOdd(selection, format);
};
