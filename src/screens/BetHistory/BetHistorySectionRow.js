import { Odds } from "@/components/Odds/Odds";
import { useTranslations } from "@/hooks/useTranslations";
import classNames from "classnames";
import moment from "moment";

const BetHistorySectionRow = ({
  title,
  odds,
  eventResult,
  result,
  market,
  eventStartTime,
  name,
  betsCount,
  betDate,
  bogEnabled,
  bogAmount,
  symbol,
  ewTerms,
}) => {
  const t = useTranslations("");
  return (
    <>
      <div className="betHistoryRow">
        <div
          className={classNames(
            "d-flex",
            "justify-content-between",
            "betHistoryRowHeader",
            {
              betHistoryRowHeaderWinner: result === "winner",
              betHistoryRowHeaderLoser: result === "loser",
            }
          )}
        >
          <div className="d-flex align-items-center justify-flex-start gap-1">
            {bogEnabled && (
              <span className="selected-bet-bog">{t("common.bog")}</span>
            )}
            <p className="betHistoryRowTitle">{title}</p>
          </div>

          <p className="betHistoryRowOdds">
            <Odds selection={odds} />
          </p>
        </div>
        <p className="betHistoryRowResult">
          {eventResult ? `(${eventResult})` : ""} {market}
          {ewTerms?.deduction && ewTerms?.places && market && (
            <span className="ew">
              {" | "} {t("common.ew")}: {ewTerms.deduction} {t("common.for")}{" "}
              {ewTerms?.places} {t("common.places")}
            </span>
          )}
        </p>

        <div className="d-flex justify-content-between">
          <p className="betHistoryRowName">
            {eventStartTime &&
              moment.utc(eventStartTime).local().format("DD MMM HH:mm") + " | "}

            {name}
          </p>
          {betsCount == 1 && (
            <p className="betHistoryBetTime">
              {moment.utc(betDate).local().format("DD MMM, HH:mm")}
            </p>
          )}
        </div>
      </div>
      {bogAmount > 0 && (
        <div className="betHistoryBog">
          <p>
            {t("my_bets.extra_bog", {
              amount: symbol + bogAmount,
            })}
          </p>
        </div>
      )}
    </>
  );
};

export default BetHistorySectionRow;
