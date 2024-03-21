import { useTranslations } from "next-intl";
import { Odds } from "@/components/Odds/Odds";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { alertToast } from "@/utils/alert";
import { getUserApi } from "@/utils/apiQueries";
import { apiServices } from "@/utils/apiServices";
import { apiUrl, eventStatus } from "@/utils/constants";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import classNames from "classnames";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser, setMyBets } from "@/store/actions";
import { AddCashFreeBetLogo, ArrowIcon } from "@/utils/icons";
import { BetslipDropdown } from "../BetslipDropdown/BetslipDropdown";
import { BetChip } from "../BetChip/BetChip";
import moment from "moment";

import "./MyBet.css";

const StakesAndReturns = ({ stake, returns, data }) => {
  const t = useTranslations("common");

  return (
    <div className="my-bet-returns">
      <div className="my_bet_result_container">
        {t("stake")}:{" "}
        <span className="my-bet-result">{formatNumberWithDecimal(stake)}</span>
        {data?.is_free_bet == "1" && <AddCashFreeBetLogo />}
      </div>
      <div>
        {t("returns")}: <span className="my-bet-result">{returns}</span>
      </div>
    </div>
  );
};

const Bet = ({ data, singleBet, bet_date, symbol }) => {
  const t = useTranslations("");

  return (
    <div className="my-bet-content">
      <div
        className={classNames("my-bet-result-dot", {
          winner: data.result === eventStatus.WINNER,
          loser: data.result === eventStatus.LOSER,
          pushed: data.result === eventStatus.PUSHED,
        })}
      />
      <div className="w-100">
        <div className="my-bet-competition">
          <div className="d-flex align-items-center gap-1">
            {data?.bog_enabled && (
              <span className="selected-bet-bog">{t("common.bog")}</span>
            )}
            {data.selection_name}
          </div>

          <span className="my-bet-odds">
            <Odds selection={data} />
          </span>
        </div>
        {data.market_name && (
          <div className="my-bet-market-name">
            {data?.event_result && (
              <span className="my-bet-result">{data.event_result}</span>
            )}{" "}
            {data.market_name}
          </div>
        )}
        <div>
          {data?.event_start_time &&
            moment.utc(data?.event_start_time).local().format("DD MMM HH:mm") +
              " | "}
          {data.event_name}
        </div>
        {singleBet && (
          <p className="my-bet-date">
            {moment.utc(bet_date).local().format("DD MMM, HH:mm")}
          </p>
        )}

        {data?.bog_amount > 0 && (
          <div className="my-bet-bog">
            <p>
              {t("my_bets.extra_bog", {
                amount: symbol + data.bog_amount,
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const MyBet = ({ data, selectedButton }) => {
  const t = useTranslations("common");
  const user = useSelector((state) => state.loggedUser);
  const myBets = useSelector((state) => state.myBets);
  const userCurrency = user?.user_data?.currency?.abbreviation;
  const symbol = user?.user_data?.currency.symbol;

  const dispatch = useDispatch();
  const getUserData = () => {
    getUserApi(dispatch).then((response) => {
      dispatch(setLoggedUser({ ...user, user_data: response }));
    });
  };
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [cashOut, setCashOut] = useState({
    amount: "",
    message: "",
  });

  useEffect(() => {
    setCashOut({ amount: data.cashout_button_amount, message: "" });
  }, [data?.cashout_button_amount]);

  const confrimCashOut = () => {
    setIsLoading(true);
    apiServices
      .post(apiUrl.CASH_OUT, {
        bet_id: data.bet_id,
        amount: cashOut.amount,
        action: "cashout",
      })
      .then((response) => {
        if (response.status) {
          dispatch(
            setMyBets({
              ...myBets,
              [selectedButton]: myBets[selectedButton].filter(
                (bet) => bet.bet_id !== data.bet_id
              ),
            })
          );
          getUserData();
        } else {
          setCashOut({
            amount: response.cash_out_amount,
            message: response.message,
          });
        }
      })
      .catch((error) => {
        alertToast({ message: error.response.data.message });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return data.bets.length > 0 ? (
    <div>
      <div
        className={classNames("my-bet", {
          winner: data.result === eventStatus.WINNER,
          loser: data.result === eventStatus.LOSER,
          partial: data.result === eventStatus.PARTIAL,
          pushed: data.result === eventStatus.PUSHED,
        })}
      >
        {data.bets.length === 1 && (
          <Bet
            data={data.bets[0]}
            singleBet
            bet_date={data.bet_date}
            symbol={symbol}
          />
        )}
        {data.bets.length > 1 ? (
          <BetslipDropdown
            show
            active
            className="my-bets-dropdown"
            renderHead={() => (
              <div
                className="my-bet-name-container"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="my-bet-name">
                  <ArrowIcon
                    className={classNames("my-bet-arrow", { active: isOpen })}
                  />
                  <div>
                    {data.bet_name}
                    <BetChip variant={data.result} />
                  </div>
                </div>
                <p className="my-bet-date">
                  {moment.utc(data.bet_date).local().format("DD MMM, HH:mm")}
                </p>
              </div>
            )}
          >
            {data.bets.map((bet, index) => {
              return <Bet data={bet} key={index} symbol={symbol} />;
            })}
            <StakesAndReturns
              stake={data.total_stake}
              returns={data.payout}
              data={data}
            />
          </BetslipDropdown>
        ) : (
          <StakesAndReturns
            stake={data.total_stake}
            returns={data.payout}
            data={data}
          />
        )}
      </div>
      {isOpen &&
        data.cashout_button_visible &&
        (!isConfirmed ? (
          <Button
            className="btnAction cash-out"
            onClick={() => setIsConfirmed(true)}
            text={`${t("cash_out")} ${formatNumberWithDecimal(
              cashOut.amount
            )} ${userCurrency}`}
          />
        ) : cashOut.message ? (
          <div className="cashout-dialog">
            <div className="cashout-message">
              <p className="mb-0">{cashOut.message}</p>
            </div>
            <div className="d-flex">
              <Button
                className="cash-out-btn reject"
                onClick={() => {
                  setIsConfirmed(false);
                  setCashOut({ ...cashOut, message: "" });
                }}
                text={t("reject")}
              />
              <Button
                className="cash-out-btn"
                onClick={confrimCashOut}
                text={isLoading ? <Loader /> : t("accept")}
              />
            </div>
          </div>
        ) : (
          <Button
            className="btnPrimary place-bet-button cash-out"
            onClick={confrimCashOut}
            text={
              isLoading ? (
                <Loader />
              ) : (
                `${t("confirm_cash_out")} ${formatNumberWithDecimal(
                  cashOut.amount
                )} ${userCurrency}`
              )
            }
          />
        ))}
    </div>
  ) : null;
};
