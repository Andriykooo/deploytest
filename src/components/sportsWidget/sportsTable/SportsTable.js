import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useSelector } from "react-redux";
import { EmptyState } from "../../emptyState/EmptyState";
import { MarketOptions } from "../../matches/MarketOptions";
import MatchCard from "../../matches/MatchCard";
import { SportsBanner } from "../SportsBanner";
import "./SportsTable.css";

export const SportsTable = ({ data, type }) => {
  const isTablet = useSelector((state) => state.isTablet);
  const [sports, setSports] = useState(data.sports);

  return (
    <div className="home-live-matches container-swifty-special mainInPlay">
      {data?.title && (
        <SportsBanner
          title={data?.title}
          subtitle={data?.subtitle}
          setData={setSports}
          data={data}
          image={data?.header_banner}
        />
      )}
      {sports.length > 0 ? (
        <div className="sports-table-sports">
          {sports?.map((sport, index) => {
            return (
              <Accordion
                key={sport.slug}
                defaultActiveKey={["0"]}
                className="accordion-special-container accordion-wrapper"
              >
                <Accordion.Item eventKey={String(index)}>
                  <div className="firstAccordionItem">
                    <Accordion.Header className="accordion-of-specials inPlay-specials">
                      <span
                        className="hour-of-special-events"
                        style={{ color: "white" }}
                      >
                        {sport.name}
                      </span>
                    </Accordion.Header>
                  </div>
                  <Accordion.Body>
                    {!isTablet && (
                      <MarketOptions options={sport?.market_options} />
                    )}
                    {sport?.competitions?.map((competition, index) => {
                      return (
                        <Accordion
                          defaultActiveKey={index === 0 ? "0" : null}
                          className="accordion-special-container inPlaySectionAccordion"
                          key={competition.id}
                        >
                          <Accordion.Header className="leagues-accordion">
                            <span
                              className="match-of-special-events"
                              style={{ color: "white" }}
                            >
                              {competition.name}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body>
                            {competition.events.map((event) => {
                              return (
                                <div key={event.id}>
                                  <MatchCard
                                    match={event}
                                    inPlay={type === "sport_widget_in_play"}
                                  />
                                </div>
                              );
                            })}
                          </Accordion.Body>
                        </Accordion>
                      );
                    })}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            );
          })}
        </div>
      ) : (
        <EmptyState message="There are no more events for the day!" />
      )}
    </div>
  );
};
