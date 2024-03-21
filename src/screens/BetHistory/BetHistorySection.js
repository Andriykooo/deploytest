import { useTranslations } from "next-intl";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import classNames from "classnames";
import { AddCashFreeBetLogo, ArrowIcon } from "@/utils/icons";
import { BetslipDropdown } from "@/components/sidebarRight/BetslipDropdown/BetslipDropdown";
import { eventStatus } from "@/utils/constants";
import { BetChip } from "@/components/sidebarRight/BetChip/BetChip";
import moment from "moment";

const BetHistorySection = ({
  title,
  stake,
  returns,
  betsCount,
  result,
  children,
  betDate,
  betId,
  item,
}) => {
  const t = useTranslations();

  return (
    <div
      className={classNames("betHistorySection", {
        betHistorySectionMulti: betsCount > 1,
        betHistorySectionWinner: result === eventStatus.WINNER,
        betHistorySectionLoser: result === eventStatus.LOSER,
        betHistorySectionPartial: result === eventStatus.PARTIAL,
        betHistorySectionPushed: result === eventStatus.PUSHED,
      })}
    >
      <BetslipDropdown
        show={betsCount > 1}
        active
        renderHead={(isActive) => (
          <div className="betHistorySectionHeaderWrapper">
            <div className="betHistorySectionHeader">
              <ArrowIcon
                className={classNames("betHistorySectionArrow", {
                  active: isActive,
                })}
              />
              <p>{title}</p>
              <BetChip variant={result} />
            </div>

            <p className="betHistoryBetTime">
              {moment.utc(betDate).local().format("DD MMM, HH:mm")}
            </p>
          </div>
        )}
      >
        <div>{children}</div>
        <div className="betHistorySectionFooter d-flex justify-content-between align-items-center">
          <p>
            ID: <span>{betId}</span>
          </p>

          <p className="my_bet_result_container">
            {t("common.stake")}: <span>{formatNumberWithDecimal(stake)}</span>
            {item?.is_free_bet == "1" && <AddCashFreeBetLogo />}
          </p>
          <p>
            {t("common.returns")}:{" "}
            <span>{formatNumberWithDecimal(returns)}</span>
          </p>
        </div>
      </BetslipDropdown>
    </div>
  );
};

export default BetHistorySection;
