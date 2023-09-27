import { useClientTranslation } from "@/app/i18n/client";
import { Odds } from "@/components/Odds/Odds";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { alertToast } from "@/utils/alert";
import { getUserApi } from "@/utils/apiQueries";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { images } from "@/utils/imagesConstant";
import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Bet = ({ data }) => {
  return (
    <div className="my-bet-content">
      <div
        className={classNames("my-bet-result-dot", {
          winner: data.result === "winner",
          loser: data.result === "loser",
        })}
      />
      <div className="w-100">
        <div className="my-bet-competition">
          {data.selection_name}
          <span className="my-bet-odds">
            <Odds selection={data} />
          </span>
        </div>

        <div className="my-bet-relust">({data.event_result || "0:0"})</div>
        <div className="my-bet-market-name">{data.market_name}</div>
        {data.event_name}
      </div>
    </div>
  );
};

export const MyBet = ({ data, setData }) => {
  const { t } = useClientTranslation("common");
  const user = useSelector((state) => state.loggedUser);
  const userCurrency = user?.user_data?.currency?.abbreviation;
  const dispatch = useDispatch();

  const getUserData = () => {
    getUserApi(dispatch).then((response) => {
      dispatch(setLoggedUser({ ...loggedUser, user_data: response }));
    });
  };
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const confrimCashOut = () => {
    setIsLoading(true);

    apiServices
      .post(apiUrl.CASH_OUT, {
        bet_id: data.bet_id,
        action: "cashout",
      })
      .then((response) => {
        if (response.status) {
          setData((prev) => {
            return prev.filter((bet) => bet.bet_id !== data.bet_id);
          });
          getUserData();
        } else {
          alertToast({ message: response.message });
        }
      })
      .catch((error) => {
        alertToast({ message: error.response.data.message });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const cashOut = () => {
    setIsConfirmed(true);
  };

  return data.bets.length > 0 ? (
    <div>
      <div
        className={classNames("my-bet", {
          winner: data.result === "winner",
          loser: data.result === "loser",
        })}
      >
        {data.bets.length === 1 && <Bet data={data.bets[0]} />}
        {data.bets.length > 1 && (
          <div>
            <div className="my-bet-name">
              <Image
                alt="arrow"
                height={14}
                width={14}
                src={images.arrowIcon}
                className="my-bet-arrow"
              />
              {data.bet_name}
            </div>
            {data.bets.map((bet, index) => {
              return <Bet data={bet} key={index} />;
            })}
          </div>
        )}
        <div className="my-bet-returns">
          <div>
            {t("stake")}: <span className="my-bet-relust">{data.total_stake}</span>
          </div>
          <div>
            {t("returns")}: <span className="my-bet-relust">{data.payout}</span>
          </div>
        </div>
      </div>
      {data.cashout_button_visible &&
        (!isConfirmed ? (
          <Button
            className="btnAction cash-out"
            onClick={cashOut}
            text={`${t("cash_out")} ${data.cashout_button_amount} ${userCurrency}`}
          />
        ) : (
          <Button
            className="btnPrimary place-bet-button cash-out"
            onClick={confrimCashOut}
            text={
              isLoading ? (
                <Loader />
              ) : (
                `${t("confirm_cash_out")} ${data.cashout_button_amount} ${userCurrency}`
              )
            }
          />
        ))}
    </div>
  ) : null;
};
