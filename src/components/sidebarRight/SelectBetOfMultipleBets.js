import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { InfoInformationIcon } from "../../utils/icons";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import { Checkbox } from "../Checkbox/Checkbox";
import { useGenerateBetslip } from "@/hooks/useGenerateBetslip";
import { calcStakeLimit } from "@/utils/global";

const prohibitedCharacters = ["e", "+", " "];

export const SelectOfMultipleBets = ({
  row,
  setShowCombinationInfo,
  disabled,
}) => {
  const t = useTranslations("common");

  const userSelectedBets = useSelector((state) => state.selectedBets);
  const isTablet = useSelector((state) => state.isTablet);

  const [input, setInput] = useState(row.stake);
  const [payout, setPayout] = useState("");
  const [isEW, setIsEW] = useState(false);

  const allowEachWay = useMemo(() => row.each_way, []);

  const generateBetslip = useGenerateBetslip();

  const handlerSetMultipleStake = (value, ew, type) => {
    const temp = { ...userSelectedBets };

    let stakeExist = false;

    temp.stakes.forEach((stake) => {
      if (stake.type === type) {
        stake.stake = value;
        stakeExist = true;

        if (allowEachWay) {
          stake.each_way = ew;
        }
      }
    });

    if (!stakeExist) {
      const newStake = {
        stake: value,
        type,
      };

      if (allowEachWay) {
        newStake.each_way = ew;
      }

      temp.stakes.push(newStake);
    }

    generateBetslip(temp);
  };

  const hanldeChangeInput = (e, type) => {
    const nativeIventData = e.nativeEvent.data || "";
    const value = e.target.value;
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
      setInput?.(value ? value : "0");
      handlerSetMultipleStake(value, isEW, type);
    }
  };

  const handleEw = (type) => {
    let tmp = { ...userSelectedBets };
    tmp.stakes.forEach((element) => {
      if (element.type === row.type) {
        element.each_way = !isEW;
      }
    });

    tmp.action = "check";
    setIsEW(!isEW);
    generateBetslip(tmp);
    handlerSetMultipleStake(input, !isEW, type);
  };

  useEffect(() => {
    if (row?.new_stake) {
      setInput(row.new_stake);
    }

    let payoutAmountFormatted = "";
    if (row?.payout && row?.payout == "?") {
      payoutAmountFormatted = "[?]";
    } else {
      payoutAmountFormatted = Number(row?.payout).toFixed(2);
    }

    if (row?.new_payout) {
      payoutAmountFormatted = Number(row?.new_payout).toFixed(2);
    }

    setPayout(payoutAmountFormatted);
  }, [row]);

  let returnAmountFormatted = "";
  if (row?.return && row?.return == "?") {
    returnAmountFormatted = "[?]";
  } else returnAmountFormatted = row?.return;

  return (
    <>
      <div
        className={classNames("selected-bet-container containerOfMultiBets", {
          disabled,
        })}
      >
        <div
          className={classNames("selectMultipleBets", {
            eachWay: allowEachWay,
            bog: row.bog_applicable,
          })}
        >
          <div className="ContainerOfMultipleBets">
            {row?.bog_applicable && (
              <span className="selected-bet-bog">{t("bog")}</span>
            )}
            <div className="ContainerOfMultipleBetsName">
              <div
                onClick={() =>
                  setShowCombinationInfo({ ...row, modalOpen: true })
                }
                className="infoIcon"
              >
                <InfoInformationIcon />
              </div>
              <span className="selected-bet-title">{row?.name || ""}</span>
            </div>
          </div>

          <div className="selected-bet-body">
            <div className="bet-amount-container betAmountMultiBets">
              <input
                placeholder="0.00"
                type={isTablet ? "tel" : "text"}
                inputMode="numeric"
                value={input > 0 ? input : ""}
                className="slip-input inputOfMultiBets"
                onChange={(e) => hanldeChangeInput(e, row.type)}
              />

              <div className="betslip-odds">{returnAmountFormatted}</div>
              {allowEachWay && (
                <div className="betslip-odds rounded-end-1">
                  <span className="me-1">{t("ew")}</span>
                  <Checkbox onChange={() => handleEw(row.type)} value={isEW} />
                </div>
              )}
            </div>
            <div className="slip-amount">
              <span className="styleOfReturnValues styleOfReturnedValuesInline">
                {t("returns")}: <span className="stakes amount">{payout}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
