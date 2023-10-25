import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectBet } from "../../store/actions";
import { InfoInformationIcon } from "../../utils/icons";
import { useDebounce } from "@/hooks/useDebounce";
import CombinationInfo from "@/components/modal/CombinationInfo";
import { useTranslations } from "next-intl";
import { Checkbox } from "@mui/material";
import classNames from "classnames";

const prohibitedCharacters = ["e", "+", " "];

export const SelectOfMultipleBets = ({ row }) => {
  const t = useTranslations("common");
  const dispatch = useDispatch();
  const userSelectedBets = useSelector((state) => state.selectedBets);

  const [input, setInput] = useState(row.stake);
  const [rowType, setRowType] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isEW, setIsEW] = useState(false);

  const allowEachWay = useMemo(() => row.each_way, []);
  const debouncedValue = useDebounce(input, 500);

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

    setInput?.(value ? value : "0");
    setRowType(type);
  };

  const handleEw = () => {
    let tmp = { ...userSelectedBets };
    tmp.stakes.forEach((element) => {
      if (element.type === row.type) {
        element.each_way = !isEW;
      }
    });

    tmp.action = "check";
    setIsEW(!isEW);
    dispatch(setSelectBet(tmp));
  };

  const handlerSetMultipleStake = () => {
    const temp = { ...userSelectedBets };

    const existStake = temp.stakes.find((stake) => {
      return stake.type === rowType;
    });

    if (existStake) {
      existStake.stake = input;

      if (allowEachWay) {
        existStake.each_way = isEW;
      }
    } else {
      const newStake = {
        type: rowType,
        stake: input,
      };

      if (allowEachWay) {
        newStake.each_way = isEW;
      }

      temp.stakes.push(newStake);
    }

    dispatch(setSelectBet(temp));
  };

  useEffect(() => {
    if (row?.new_stake) {
      setInput(row.new_stake);
    }
  }, [row]);

  useEffect(() => {
    if (debouncedValue && rowType) {
      handlerSetMultipleStake();
    }
  }, [debouncedValue]);

  let payoutAmountFormatted = "";
  if (row?.payout && row?.payout == "?") {
    payoutAmountFormatted = "[?]";
  } else {
    payoutAmountFormatted = Number(row?.payout).toFixed(2);
  }
  let returnAmountFormatted = "";
  if (row?.return && row?.return == "?") {
    returnAmountFormatted = "[?]";
  } else returnAmountFormatted = row?.return;

  return (
    <>
      <div className="selected-bet-container containerOfMultiBets">
        <div
          className={classNames("selected-bet-title selectMultipleBets", {
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
                onClick={() => setShowModal((prev) => !prev)}
                className="infoIcon"
              >
                <InfoInformationIcon />
              </div>
              <span>{row?.name || ""}</span>
            </div>
          </div>

          <div className="selected-bet-body">
            <div className="bet-amount-container betAmountMultiBets">
              <input
                placeholder="0.00"
                type="text"
                value={input > 0 ? input : ""}
                className="slip-input inputOfMultiBets"
                onChange={(e) => hanldeChangeInput(e, row.type)}
              />

              <div className="betslip-odds">{returnAmountFormatted}</div>
              {allowEachWay && (
                <div className="betslip-odds rounded-end-1">
                  <span className="me-1">{t("ew")}</span>
                  <Checkbox
                    onChange={handleEw}
                    sx={{
                      padding: 0,
                      color: "#FFFFFF",
                      "&.Mui-checked": {
                        color: "#BC9239",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 16,
                      },
                    }}
                  />
                </div>
              )}
            </div>
            <div className="slip-amount">
              <span className="styleOfReturnValues styleOfReturnedValuesInline">
                {t("returns")}:{" "}
                <span className="stakes amount">{payoutAmountFormatted}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <CombinationInfo
          name={row?.name}
          type={row?.type}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};
