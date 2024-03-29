"use client";

import { useSelector } from "react-redux";
import { formatOdd } from "@/utils/global";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { getSelectionOdds } from "@/utils/getSelectionOdds";

export const PriceHistory = ({ item, className }) => {
  const updatedSelections = useSelector((state) => state.selections);
  const user = useSelector((state) => state.loggedUser);
  const settings = useSelector((state) => state.settings);
  const isMobile = useSelector((state) => state.setMobile);

  const updatedSelection = updatedSelections?.[item.bet_id];
  const format =
    user?.user_data?.settings?.odds_format || settings.default_odds_format;

  const [priceHistory, setPriceHistory] = useState([]);
  const [isInitial, setIsInitial] = useState(false);

  useEffect(() => {
    if (user) {
      setPriceHistory(
        item?.price_history?.slice(-3)?.map((price) => {
          const odd = formatOdd(price, format);

          return {
            value: +price?.value,
            name: odd,
          };
        })
      );
      setIsInitial(true);
    }
  }, [user]);

  const minValue = Math.min(...priceHistory.map((entry) => entry.value));

  useEffect(() => {
    if (!!updatedSelection?.previousOdds?.odds_decimal && user && isInitial) {
      const updatedSelectionOdds = getSelectionOdds(updatedSelection);

      if (
        updatedSelectionOdds.odds_decimal === "SP" ||
        +updatedSelectionOdds.odds_decimal ===
          +priceHistory?.[priceHistory.length - 1]?.value
      ) {
        return;
      }

      const odd = formatOdd(updatedSelection, format);

      const data = {
        name: odd,
        value: parseFloat(updatedSelection?.odds_decimal),
      };

      if (priceHistory.length < 3) {
        setPriceHistory([...priceHistory, data]);
      } else {
        setPriceHistory([...priceHistory.slice(1), data]);
      }
    }
  }, [updatedSelection?.previousOdds?.odds_decimal, user, isInitial]);

  return (
    <div className={classNames("price-history", className)}>
      {item?.price_history && (
        <LineChart
          data={isMobile ? priceHistory.slice(-2) : priceHistory}
          height={54}
          width={isMobile ? 65 : 108}
          overflow="visible"
        >
          <Line
            isAnimationActive={false}
            type="linear"
            dataKey="value"
            strokeWidth={1}
            r={4}
          />
          <YAxis domain={[minValue, "auto"]} hide />
          <XAxis
            interval={0}
            axisLine={false}
            tickLine={false}
            dataKey="name"
            tick={{ fontSize: 8 }}
          />
        </LineChart>
      )}
    </div>
  );
};
