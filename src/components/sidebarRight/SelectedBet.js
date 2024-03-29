import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeBet, setSidebarRight } from "../../store/actions";
import { LiveBetslip, XIcon } from "../../utils/icons";
import { BetslipOdds } from "./BetslipOdds/BetslipOdds";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import { phaseStatus, prohibitedCharacters } from "@/utils/constants";
import { Checkbox } from "../Checkbox/Checkbox";
import { useGenerateBetslip } from "@/hooks/useGenerateBetslip";
import { calcStakeLimit } from "@/utils/global";
import moment from "moment";
import { Skeleton } from "@/components/Skeleton/Skeleton";

export const SelectedBet = ({ bet, disabled }) => {
  const t = useTranslations("common");
  const dispatch = useDispatch();
  const userSelectedBets = useSelector((state) => state.selectedBets);
  const liveSelections = useSelector((state) => state.liveSelections);
  const updatedEvents = useSelector((state) => state.updatedEvents);
  const isTablet = useSelector((state) => state.isTablet);

  const [showChangePriceSp, setShowChangePriceSp] = useState(false);

  const updatedEvent = updatedEvents[bet?.event_id];
  const isRacing =
    bet.sport_slug === "horseracing" || bet.sport_slug === "greyhoundracing";
  const isLive =
    liveSelections.has(bet.bet_id) ||
    updatedEvent?.data?.current_status === phaseStatus.IN_PLAY;

  const isSuspended =
    (isRacing && isLive) ||
    updatedEvent?.data?.current_status === phaseStatus.FINISHED;

  useEffect(() => {
    if (bet?.trading_status !== "suspended" && +bet.odds_decimal > 0)
      setShowChangePriceSp(true);
    else setShowChangePriceSp(false);
  }, [bet?.trading_status, bet.odds_decimal]);

  if (isSuspended) {
    bet.trading_status = "suspended";
  }

  if (bet?.type === "unnamed_favorite") {
    bet.bet_id = bet.event_id;
    bet.starting_price = true;
  }

  const [isEW, setIsEW] = useState(false);

  const bet_id = bet?.bet_id;

  const generateBetslip = useGenerateBetslip();

  const handleChangeEW = () => {
    const tmp = { ...userSelectedBets };

    tmp.singles.forEach((element) => {
      if (element.bet_id === bet_id && isRacing) {
        element.each_way = !isEW;
        element.starting_price = bet.starting_price;
      }
    });

    tmp.action = "check";

    setIsEW(!isEW);
    generateBetslip(tmp);
  };

  const handleChangeSP = () => {
    const tmp = { ...userSelectedBets };

    tmp.singles.forEach((element) => {
      if (element.bet_id === bet_id && isRacing) {
        element.starting_price = !bet.starting_price;
        element.each_way = isEW;
      }
    });

    tmp.action = "check";
    generateBetslip(tmp);
  };

  const handlerSetSingleStake = (value) => {
    const limit = calcStakeLimit(value);

    if (limit) {
      const tmp = { ...userSelectedBets };

      tmp.singles.forEach((element) => {
        if (element.bet_id === bet_id) {
          element.stake = value;
        }
      });

      tmp.action = "check";
      generateBetslip(tmp);
    }
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

    handlerSetSingleStake(e.target.value);
  };

  useEffect(() => {
    setIsEW(bet?.each_way);
  }, [bet?.each_way]);

  return (
    <div className={classNames("selected-bet-container", { disabled })}>
      <div className="selected-bet-title">
        <div className="d-flex align-items-center">
          {!disabled && (
            <div
              className="remove-bet"
              onClick={() => {
                generateBetslip({
                  ...userSelectedBets,
                  singles: userSelectedBets.singles.filter(
                    (single) => single.bet_id !== bet.bet_id
                  ),
                });

                dispatch(removeBet(bet));

                if (
                  userSelectedBets?.singles?.length === 1 &&
                  window.document.documentElement.clientWidth < 1400
                ) {
                  dispatch(setSidebarRight({ isActive: false }));
                }
              }}
            >
              <XIcon size="9" />
            </div>
          )}
          <span className="selected-market-selection">{bet?.name || ""}</span>
        </div>
        <div className="selected-bet-title-right">
          {bet?.bog_applicable && (
            <span className="selected-bet-bog">{t("bog")}</span>
          )}
          {isLive && <LiveBetslip />}
        </div>
      </div>
      <div className="selected-bet-body">
        <div>
          {/* Bet Description */}
          <span className="selected-market">{bet?.description || ""}</span>
          {/* Bet Match Name */}
          {!bet?.event_date && !isRacing ? (
            <Skeleton
              width="100%"
              height={18}
              className="bet-skeleton skeleton-light"
            />
          ) : (
            <span className="selected-match">
              <span className="match-date">
                {bet?.event_date &&
                  !isRacing &&
                  moment.utc(bet?.event_date).local().format("DD MMM HH:mm") +
                    " | "}
              </span>
              <span className="match-name">{bet?.match_name || ""}</span>
            </span>
          )}
        </div>
        <div>
          <div className="bet-amount-container">
            <div
              id={"input_stake_" + bet?.bet_id}
              className="slip-input-wrapper"
            >
              <input
                placeholder="0.00"
                value={bet?.new_stake || bet?.stake || ""}
                type={isTablet ? "tel" : "text"}
                inputMode="numeric"
                className="slip-input"
                onChange={hanldeChangeInput}
              />
            </div>
            {!isRacing && <BetslipOdds selection={bet} />}
            {isRacing && (
              <>
                <BetslipOdds
                  selection={bet}
                  className="racing-bet-odds"
                  onClick={() => {
                    showChangePriceSp && handleChangeSP();
                  }}
                >
                  {showChangePriceSp && (
                    <div className="starting-price-arrows">
                      <svg
                        width="12"
                        height="14"
                        viewBox="0 0 12 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5L1 3.5ZM11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464466C7.97631 0.269204 7.65973 0.269204 7.46447 0.464466C7.2692 0.659728 7.2692 0.976311 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM1 4.5L11 4.5V3.5L1 3.5L1 4.5Z"
                          fill="var(--global-color-betslip-text_tertiary)"
                        />
                        <path
                          d="M11 10.5C11.2761 10.5 11.5 10.2761 11.5 10C11.5 9.72386 11.2761 9.5 11 9.5L11 10.5ZM0.646446 9.64645C0.451184 9.84171 0.451184 10.1583 0.646446 10.3536L3.82843 13.5355C4.02369 13.7308 4.34027 13.7308 4.53553 13.5355C4.7308 13.3403 4.7308 13.0237 4.53553 12.8284L1.70711 10L4.53553 7.17157C4.7308 6.97631 4.7308 6.65973 4.53553 6.46447C4.34027 6.2692 4.02369 6.2692 3.82843 6.46447L0.646446 9.64645ZM11 9.5L1 9.5L1 10.5L11 10.5L11 9.5Z"
                          fill="var(--global-color-betslip-text_tertiary)"
                        />
                      </svg>
                    </div>
                  )}
                </BetslipOdds>
                {bet?.allow_each_way && (
                  <div className="betslip-odds rounded-end-1">
                    <span className="me-1">{t("ew")}</span>
                    <Checkbox onChange={handleChangeEW} value={isEW} />
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
                {bet?.starting_price
                  ? "[?]"
                  : bet?.new_payout || bet?.payout || "0.00"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
