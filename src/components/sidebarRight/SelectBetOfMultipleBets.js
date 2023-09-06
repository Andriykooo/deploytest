import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectBet } from "../../store/actions";
import { InfoInformationIcon } from "../../utils/icons";
import { useDebounce } from "@/hooks/useDebounce";
import CombinationInfo from "@/components/modal/CombinationInfo";

const prohibitedCharacters = ["e", "+", " "];

export const SelectOfMultipleBets = ({ row }) => {
  const dispatch = useDispatch();
  const userSelectedBets = useSelector((state) => state.selectedBets);
  const [input, setInput] = useState(row.stake);
  const [rowType, setRowType] = useState();
  const debouncedValue = useDebounce(input, 500);
  const [showModal, setShowModal] = useState(false);

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

  const handlerSetMultipleStake = () => {
    const temp = { ...userSelectedBets };

    const existStake = temp.stakes.find((stake) => {
      return stake.type === rowType;
    });

    if (existStake) {
      existStake.stake = input;
    } else {
      temp.stakes.push({
        type: rowType,
        stake: input,
      });
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
        <div className="selected-bet-title selectMultipleBets">
          <div className="ContainerOfMultipleBets">
            <div onClick={() => setShowModal((prev) => !prev)}>
              <InfoInformationIcon />
            </div>
            <span className="selected-market-selection"></span>
            &nbsp;
            <span>{row?.name || ""}</span>
          </div>

          <div className="selected-bet-body ps-2 pe-1 ">
            <div className="bet-amount-container betAmountMultiBets">
              <input
                placeholder="0.00"
                type="text"
                value={input > 0 ? input : ""}
                className="slip-input inputOfMultiBets"
                onChange={(e) => hanldeChangeInput(e, row.type)}
              />
              <div className="betslip-odds">{returnAmountFormatted}</div>
            </div>
            <div className="slip-amount">
              <span className="styleOfReturnValues styleOfReturnedValuesInline">
                Returns:{" "}
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
