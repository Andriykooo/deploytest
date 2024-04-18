import { prohibitedCharacters } from "@/utils/constants";
import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useSelector } from "react-redux";
import { useGenerateBetslip } from "@/hooks/useGenerateBetslip";
import { calcStakeLimit } from "@/utils/global";
import { Checkbox } from "../../Checkbox/Checkbox";

export const AllSingles = () => {
  const t = useTranslations("common");

  const userSelectedBets = useSelector((state) => state.selectedBets);
  const isTablet = useSelector((state) => state.isTablet);

  const generateBetslip = useGenerateBetslip();

  const [input, setInput] = useState("");
  const [isEW, setIsEW] = useState(false);

  const allowEachWay = userSelectedBets?.singles.some(
    (bet) => bet.allow_each_way == true
  );

  const handleChangeStakes = (value) => {
    const tmp = { ...userSelectedBets };

    tmp.singles.forEach((element) => {
      element.stake = value > 0 ? value : "";
    });

    tmp.action = "check";

    generateBetslip(tmp);
  };

  const handleChangeEW = () => {
    const tmp = { ...userSelectedBets };

    tmp.singles.forEach((element) => {
      if (element?.allow_each_way) {
        element.each_way = !isEW;
      }
    });

    tmp.action = "check";

    setIsEW(!isEW);
    generateBetslip(tmp);
  };

  const handleChange = (e) => {
    const nativeIventData = e.nativeEvent.data || "";
    const value = e.target.value || "0";
    const [number, float] = value.split(".");

    if (
      prohibitedCharacters.includes(nativeIventData) ||
      +value < 0 ||
      /^0[0-9]+/.test(number) ||
      (float && float?.length > 4) ||
      isNaN(+value)
    ) {
      return;
    }

    const limit = calcStakeLimit(value);
    if (limit) {
      setInput(value);
      handleChangeStakes(value);
    }
  };

  return (
    <div className="selected-bet-container all-singles">
      <div className="selected-bet-title">
        <div className="d-flex align-items-center">
          <span className="selected-market-selection">{t("all_singles")}</span>
        </div>
      </div>
      <div className="selected-bet-body">
        <div className="bet-amount-container">
          <input
            placeholder="0.00"
            type={isTablet ? "tel" : "text"}
            inputMode="numeric"
            value={input > 0 ? input : ""}
            className="slip-input"
            onChange={handleChange}
          />

          {allowEachWay && (
            <div className="betslip-odds rounded-end-1">
              <span className="me-1">{t("ew")}</span>
              <Checkbox onChange={handleChangeEW} value={isEW} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
