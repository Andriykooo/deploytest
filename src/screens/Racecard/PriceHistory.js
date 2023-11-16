"use client";

import { useSelector } from "react-redux";
import { formatOdd } from "@/utils/global";
import { Line, LineChart, ResponsiveContainer, XAxis } from "recharts";
import { useEffect, useState } from "react";

export const PriceHistory = ({ item }) => {
  const updatedSelections = useSelector((state) => state.updatedSelections);
  const user = useSelector((state) => state.loggedUser);
  const settings = useSelector((state) => state.settings);

  const updatedSelection = updatedSelections?.[item.bet_id];
  const format =
    user?.user_data?.settings?.odds_format || settings.default_odds_format;

  const [priceHistory, setPriceHistory] = useState(
    item?.price_history?.slice(-3)?.map((price) => {
      const odd = formatOdd(price, format);

      return {
        value: +price?.value,
        name: odd,
      };
    })
  );

  useEffect(() => {
    if (updatedSelection) {
      const selection = updatedSelection.data;

      if (selection?.price_boost) {
        selection.odds_decimal = selection.price_boost_odds.decimal;
        selection.odds_fractional = selection.price_boost_odds.fractional;
      }

      const odd = formatOdd(selection, format);

      const data = {
        name: odd,
        value: selection.odds_decimal,
        odds_decimal: selection.odds_decimal,
        odds_fractional: selection.odds_fractional,
      };

      if (priceHistory.length < 3) {
        setPriceHistory([...priceHistory, data]);
      } else {
        priceHistory.shift();
        setPriceHistory([...priceHistory, data]);
      }
    }
  }, [updatedSelection]);

  return (
    <div className="price-history">
      {item?.price_history && (
        <ResponsiveContainer
          width={108}
          height={52}
          className={"position-absolute"}
        >
          <LineChart data={priceHistory} height={52} width={108}>
            <XAxis
              interval={0}
              axisLine={false}
              tickLine={false}
              dataKey={"name"}
              tick={{ fontSize: 8 }}
            />
            <Line
              isAnimationActive={false}
              type="linear"
              dataKey="value"
              strokeWidth={1}
              r={4}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
