import React from "react";
import { Accordion } from "react-bootstrap";
import { useSelector } from "react-redux";
import BasketballCard from "../../screens/Basketball/BasketballCard";
import HockeyCard from "../../screens/IceHockey/HockeyCard";
import { MarketOptions } from "../matches/MarketOptions";
import MatchCard from "../matches/MatchCard";

const matchTypes = ["basketball", "icehockey"];

export const MatchAccordion = ({ row, type, inPlay, number }) => {
  const isTablet = useSelector((state) => state.isTablet);

  const selectionTypes = [...row.events]
    .sort((current, next) => {
      return next.selections.length - current.selections.length;
    })[0]
    .selections.map((selection) => ({
      name: selection.name,
    }));

  return (
    <Accordion defaultActiveKey={["1"]} className="accordion-wrapper">
      <Accordion.Item eventKey={String(number)}>
        <Accordion.Header>{row.name}</Accordion.Header>
        <Accordion.Body>
          {!isTablet && type !== "icehockey" && (
            <MarketOptions options={selectionTypes} />
          )}
          <div className="matchContainer">
            {row?.events.map((row, index) => {
              let moreMarkets = false;
              let firstRow = false;
              if (row?.selections) {
                if (row?.selections?.length > 3) {
                  moreMarkets = true;
                } else {
                  moreMarkets = false;
                }
              }
              if (index === 0) {
                firstRow = true;
              }

              moreMarkets = false;
              return (
                <React.Fragment key={row.id}>
                  <MatchCard match={row} key={index} inPlay={inPlay} />
                </React.Fragment>
              );
            })}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
