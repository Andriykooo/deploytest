import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBet,
  removeBetAmount,
  removeReturnValue,
  setBetSlipResponse,
  setBetTicker,
  setSelectBet,
} from "../../store/actions";
import { XIcon } from "../../utils/icons";
import { useDebounce } from "@/hooks/useDebounce";
import { Checkbox } from "@mui/material";
import { BetslipOdds } from "./BetslipOdds/BetslipOdds";
import { useClientTranslation } from "@/app/i18n/client";

const prohibitedCharacters = ["e", "+", " "];

export const SelectedBet = ({ row }) => {
  const { t } = useClientTranslation("common");
  const dispatch = useDispatch();
  const userSelectedBets = useSelector((state) => state.selectedBets);
  const [input, setInput] = useState(row.new_stake || row.stake);
  const [isEW, setIsEW] = useState(false);
  const [isSP, setIsSP] = useState(row.starting_price);
  const [oddValue, setOddValue] = useState(row);
  const [selectioHasOdds, setselectioHasOdds] = useState(false);

  const debouncedValue = useDebounce(input, 500);
  const bet_id =
    row.type === "unnamed_favorite"
      ? +row?.bet_id
      : row?.bet_provider + "-" + row?.bet_id;
  const isRacing =
    row.sport_slug === "horseracing" || row.sport_slug === "greyhoundracing";

  const handlerSetSingleStake = (sp, ew) => {
    const tmp = { ...userSelectedBets };

    tmp.bets.forEach((element) => {
      if (element.bet_id === bet_id) {
        element.stake = input;
        if (isRacing) {
          element.starting_price = sp;
          element.each_way = ew;
        }
      }
    });
    tmp.action = "check";
    dispatch(setSelectBet(tmp));
  };

  const hanldeChangeInput = (e) => {
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
  };

  useEffect(() => {
    const hasOdds = Number(row?.odds_decimal) !== 0;
    setselectioHasOdds(hasOdds);

    if (!hasOdds || row.starting_price) {
      setOddValue({
        ...row,
        odds_decimal: "SP",
        odds_american: "SP",
        odds_fractional: "SP",
      });
    } else {
      setOddValue(row);
    }

    if (row?.new_stake) {
      setInput(row.new_stake);
    }
  }, [row]);

  useEffect(() => {
    if (debouncedValue && userSelectedBets.bets.length > 0) {
      handlerSetSingleStake(isSP, isEW);
    }
  }, [debouncedValue]);

  return (
    <div className="selected-bet-container">
      <div className="selected-bet-title">
        <div className="d-flex align-items-center">
          <div
            className="remove-bet"
            onClick={() => {
              dispatch(removeBet(row));
              dispatch(removeBetAmount(row?.bet_id));
              dispatch(removeReturnValue(row?.bet_id));

              if (userSelectedBets?.bets?.length - 1 === 0) {
                dispatch(
                  setBetTicker({
                    status: "",
                    bet_referral_id: "",
                  })
                );
                dispatch(
                  setBetSlipResponse({
                    singles: [],
                    combinations: [],
                    total_stakes: 0,
                    total_payout: 0,
                  })
                );

                return;
              }
            }}
          >
            <XIcon />
          </div>
          <span className="selected-market-selection"> {row?.name || ""}</span>
        </div>
        {row?.bog_applicable && (
          <span className="selected-bet-bog">{t("bog")}</span>
        )}
      </div>
      <div className="selected-bet-body">
        {/* Bet description */}
        <span className="selected-market"> {row?.description || ""}</span>
        {/* Bet Match Name */}
        <span className="selected-match"> {row?.match_name || ""}</span>
        <div className="bet-amount-container">
          <input
            placeholder="0.00"
            type="text"
            value={input > 0 ? input : ""}
            className="slip-input"
            data-id={bet_id}
            id={"input_stake_" + bet_id}
            onChange={hanldeChangeInput}
          />
          {!isRacing && <BetslipOdds selection={row} />}
          {isRacing && (
            <>
              <BetslipOdds
                selection={oddValue}
                className="racing-bet-odds"
                sp={isSP}
              >
                <div
                  onClick={() => {
                    if (selectioHasOdds) {
                      setIsSP((prev) => {
                        handlerSetSingleStake(!prev, isEW);
                        return !prev;
                      });
                    }
                  }}
                  className="starting-price-arrows"
                >
                  {selectioHasOdds && (
                    <svg
                      width="12"
                      height="14"
                      viewBox="0 0 12 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5L1 3.5ZM11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464466C7.97631 0.269204 7.65973 0.269204 7.46447 0.464466C7.2692 0.659728 7.2692 0.976311 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM1 4.5L11 4.5V3.5L1 3.5L1 4.5Z"
                        fill="#2B2F34"
                      />
                      <path
                        d="M11 10.5C11.2761 10.5 11.5 10.2761 11.5 10C11.5 9.72386 11.2761 9.5 11 9.5L11 10.5ZM0.646446 9.64645C0.451184 9.84171 0.451184 10.1583 0.646446 10.3536L3.82843 13.5355C4.02369 13.7308 4.34027 13.7308 4.53553 13.5355C4.7308 13.3403 4.7308 13.0237 4.53553 12.8284L1.70711 10L4.53553 7.17157C4.7308 6.97631 4.7308 6.65973 4.53553 6.46447C4.34027 6.2692 4.02369 6.2692 3.82843 6.46447L0.646446 9.64645ZM11 9.5L1 9.5L1 10.5L11 10.5L11 9.5Z"
                        fill="#2B2F34"
                      />
                    </svg>
                  )}
                </div>
              </BetslipOdds>
              {row.allow_each_way && (
                <div className="betslip-odds rounded-end-1">
                  <span className="me-1">{t("ew")}</span>
                  <Checkbox
                    onChange={() =>
                      setIsEW((prev) => {
                        handlerSetSingleStake(isSP, !prev);

                        return !prev;
                      })
                    }
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
            </>
          )}
        </div>
        <div className="slip-amount">
          <span></span>
          <span className="styleOfReturnValues styleOfReturnedValuesInline">
            {t("returns")}:{" "}
            <span className="stakes amount">
              {isSP ? "[?]" : row.new_payout || row.payout || "0.00"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
