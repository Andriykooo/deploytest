import { Accordion } from "react-bootstrap";
import React from "react";
import BasketballCard from "../../pages/Basketball/BasketballCard";
import HockeyCard from "../../pages/IceHockey/HockeyCard";
import MatchCard from "../matches/MatchCard";
import HorseCard from "../../pages/HorseRacing/HorseCard";

export const MatchAccordion = ({
  competitionName,
  row,
  index,
  selectionTypes,
  id,
  inPlay,
  backgroundColor,
}) => {
  return (
    <Accordion defaultActiveKey={[0, 1, 2]} alwaysOpen key={index}>
      <Accordion.Item
        eventKey={index}
        style={{ borderWidth: "0", backgroundColor: "#25292d" }}
      >
        <Accordion.Header> {row.competition_name}</Accordion.Header>
        <Accordion.Body>
          <div className="matchContainer">
            {row?.matches.map((row, index) => {
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
                <React.Fragment key={index}>
                  {id === "4" ? (
                    <BasketballCard
                      match={row}
                      key={index}
                      moreMarkets={moreMarkets}
                      firstRow={firstRow}
                      selectionTypes={selectionTypes}
                      id={id}
                      inPlay={inPlay}
                      competitionName={competitionName}
                    />
                  ) : id === "15" ? (
                    <HockeyCard
                      match={row}
                      key={index}
                      moreMarkets={moreMarkets}
                      firstRow={firstRow}
                      selectionTypes={selectionTypes}
                      id={id}
                      inPlay={inPlay}
                    />
                  ) : id === "20000001" ? (
                    <HorseCard
                      match={row}
                      key={index}
                      moreMarkets={moreMarkets}
                      firstRow={firstRow}
                      selectionTypes={selectionTypes}
                      id={id}
                      inPlay={inPlay}
                    />
                  ) : (
                    <MatchCard
                      match={row}
                      key={index}
                      moreMarkets={moreMarkets}
                      firstRow={firstRow}
                      selectionTypes={selectionTypes}
                      id={id}
                      inPlay={inPlay}
                      backgroundColor={backgroundColor}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
