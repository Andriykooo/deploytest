import { useClientTranslation } from "@/app/i18n/client";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { images } from "@/utils/imagesConstant";
import classNames from "classnames";
import Image from "next/image";

const BetHistorySection = ({
  title,
  stake,
  returns,
  betsCount,
  result,
  children,
}) => {
  const { t } = useClientTranslation(["bet_history", "common"]);
  return (
    <div
      className={classNames("betHistorySection", {
        betHistorySectionMulti: betsCount > 1,
        betHistorySectionWinner: result === "winner",
        betHistorySectionLoser: result === "loser",
      })}
    >
      {betsCount > 1 && (
        <div className="betHistorySectionHeader d-flex align-items-center">
          <Image
            src={images.arrowIcon}
            className="betHistorySectionArrow"
            alt="arrow"
          />
          <p>{title}</p>
        </div>
      )}
      <div>{children}</div>
      <div className="betHistorySectionFooter d-flex justify-content-between align-items-center">
        <p>
          {t("common:stake")}: <span>{formatNumberWithDecimal(stake)}</span>
        </p>
        <p>
          {t("common:returns")}: <span>{formatNumberWithDecimal(returns)}</span>
        </p>
      </div>
    </div>
  );
};

export default BetHistorySection;
