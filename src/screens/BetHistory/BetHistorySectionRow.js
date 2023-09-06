import { Odds } from "@/components/Odds/Odds";
import classNames from "classnames";

const BetHistorySectionRow = ({
  title,
  odds,
  eventResult,
  result,
  market,
  name,
}) => (
  <div className="betHistoryRow">
    <div
      className={classNames("d-flex", "justify-content-between", "betHistoryRowHeader", {
        betHistoryRowHeaderWinner: result === "winner",
        betHistoryRowHeaderLoser: result === "loser",
      })}
    >
      <p className="betHistoryRowTitle">{title}</p>
      <p className="betHistoryRowOdds">
        <Odds selection={odds} />
      </p>
    </div>
    <p className="betHistoryRowResult">{eventResult ? `(${eventResult}` : ''} {market}</p>
    <p className="betHistoryRowName">{name}</p>
  </div>
);

export default BetHistorySectionRow;
