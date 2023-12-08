import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { MatchAccordion } from "../custom/MatchAccordion";
import "./Matches.css";
import classNames from "classnames";

const Matches = ({ competitionsData, marketOptions, inPlay, type }) => {
  let competitions = competitionsData;
  const selectedBets = useSelector((state) => state.selectedBets);
  const isTablet = useSelector((state) => state.isTablet);

  useEffect(() => {
    if (competitions && competitions.length > 0) {
      for (let i = 0; i < selectedBets.length; i++) {
        let selectedBetId = selectedBets[i]?.bet_id;
        let selectedElement = document.querySelector(
          `#bet_odds_${selectedBetId}`
        );
        if (selectedElement) {
          selectedElement.classList.add("styleOfSelectedOdd");
        }
      }
    }
  }, [selectedBets, competitions]);

  return (
    <div>
      {competitionsData?.map((row, index) => {
        return (
          <div key={row.id} className={classNames("bordered-match", {"mx-3": !isTablet})}>
            <MatchAccordion
              marketOptions={marketOptions}
              row={row}
              type={type}
              inPlay={inPlay}
              number={index + 1}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Matches;
