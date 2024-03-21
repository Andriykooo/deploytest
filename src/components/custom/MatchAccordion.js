import React from "react";
import { useSelector } from "react-redux";
import { MarketTypes } from "../matches/MarketTypes";
import MatchCard from "../matches/MatchCard";
import { Accordion } from "../Accordion/Accordions";

export const MatchAccordion = ({
  row,
  inPlay,
  active,
  marketTypes,
  selectedMarket,
}) => {
  const isTablet = useSelector((state) => state.isTablet);

  return (
    <Accordion
      title={row.name}
      className="accordionContainer"
      active={!!row?.expanded || active}
    >
      {!isTablet && <MarketTypes options={marketTypes} />}
      <div className="matchContainer">
        {row?.events.map((event) => {
          return (
            <MatchCard
              key={event.id}
              match={event}
              sportSlug={row.sport_slug}
              inPlay={inPlay}
              marketTypes={marketTypes}
              selectedMarket={selectedMarket}
            />
          );
        })}
      </div>
    </Accordion>
  );
};
