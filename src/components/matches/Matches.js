import { useSelector } from "react-redux";
import { MatchAccordion } from "../custom/MatchAccordion";
import classNames from "classnames";
import "./Matches.css";

const Matches = ({ competitionsData, marketTypes, inPlay, selectedMarket }) => {
  const isTablet = useSelector((state) => state.isTablet);

  return (
    <div>
      {competitionsData?.map((row, index) => {
        return (
          <div
            key={row.id}
            className={classNames("bordered-match", { "mx-3": !isTablet })}
          >
            <MatchAccordion
              row={row}
              inPlay={inPlay}
              active={index === 0}
              marketTypes={marketTypes}
              selectedMarket={selectedMarket}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Matches;
