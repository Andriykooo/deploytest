import React from "react";
import { useSelector } from "react-redux";
import { MarketOptions } from "../matches/MarketOptions";
import MatchCard from "../matches/MatchCard";
import { Accordion } from "../Accordion/Accordions";

export const MatchAccordion = ({ row, inPlay, number }) => {
  const isTablet = useSelector((state) => state.isTablet);

  const selectionTypes = [...row.events]
    .sort((current, next) => {
      return next.selections.length - current.selections.length;
    })[0]
    .selections.map((selection) => ({
      name: selection.name,
    }));

  return (
    <Accordion
      title={row.name}
      className="accordionContainer"
      active={number === 1}
    >
      {!isTablet && <MarketOptions options={selectionTypes} />}
      <div className="matchContainer">
        {row?.events.map((row) => {
          return (
            <React.Fragment key={row.id}>
              <MatchCard match={row} inPlay={inPlay} />
            </React.Fragment>
          );
        })}
      </div>
    </Accordion>
  );
};
