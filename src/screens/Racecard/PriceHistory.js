"use client";

import { useSelector } from "react-redux";
import { formatOdd } from "@/utils/global";
import { Line, LineChart, XAxis } from "recharts";

export const PriceHistory = ({ item }) => {
  const user = useSelector((state) => state.loggedUser);
  const format = user?.user_data?.settings?.odds_format;

  const data = item?.price_history?.slice(-3)?.map((price) => {
    const odd = formatOdd(price, format);

    return {
      value: +price?.value,
      name: odd,
    };
  });

  return (
    <div className="price-history">
      {item?.price_history && (
        <LineChart
          data={data}
          height={32}
          width={107}
          margin={{
            top: 5,
            right: 12,
            left: 12,
            bottom: -16,
          }}
        >
          <XAxis
            interval={0}
            axisLine={false}
            tickLine={false}
            dataKey={"name"}
            tick={{ fill: "#ffffff", fontSize: 8 }}
          />
          <Line
            isAnimationActive={false}
            type="linear"
            dataKey="value"
            stroke="#BC9239"
            strokeWidth={1}
            r={4}
            fill="#BC9239"
          />
        </LineChart>
      )}
    </div>
  );
};
