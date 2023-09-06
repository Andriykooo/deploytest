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
}) => (
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
        Stake: <span>{stake}</span>
      </p>
      <p>
        Returns: <span>{returns}</span>
      </p>
    </div>
  </div>
);

export default BetHistorySection;
