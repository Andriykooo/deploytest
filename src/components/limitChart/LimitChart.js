import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { useTranslations } from "@/hooks/useTranslations";
import { useSelector } from "react-redux";
import { Pie, PieChart } from "recharts";
import "./LimitChart.css";

export const LimitChart = ({ title, used, amount, usedPercent }) => {
  const t = useTranslations();
  const loggedUser = useSelector((state) => state.loggedUser);

  const data = [
    {
      name: "start",
      value: +used,
      cornerRadius: 100,
    },
    {
      name: "end",
      value: +amount - +used,
    },
  ];

  return (
    <div className="limitDiv">
      <div className="chartInfo">
        <p className="limitChartTitle">{title}</p>
        <ul className="chartDescription">
          <li>
            <span className="usedDot"></span>
            <p className="mb-0">
              {t("profile.used")} - {loggedUser?.user_data?.currency?.symbol}
              {formatNumberWithDecimal(Number(used))}
            </p>
          </li>
          <li>
            <span className="availableDot"></span>
            <p className="mb-0">
              {t("profile.available")} -{" "}
              {amount < 0 ? (
                t("common.not_set")
              ) : (
                <>
                  {loggedUser?.user_data?.currency?.symbol}
                  {formatNumberWithDecimal(amount - used)}
                </>
              )}
            </p>
          </li>
        </ul>
      </div>
      <div className="pieChart">
        <PieChart width={90} height={90}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            startAngle={90}
            endAngle={-270}
            innerRadius={37}
            outerRadius={46}
          />
        </PieChart>
        <div className="limitChartPercentWrapper">
          <div className="limitChartPercent">
            <span className="chartPercent">{usedPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
