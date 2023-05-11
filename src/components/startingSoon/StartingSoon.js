import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useSelector } from "react-redux";
import { images } from "../../utils/imagesConstant";
import { StartingSoonHomeMenu } from "../custom/HomeSportMenus";
import Image from "next/image";

export const StartingSoon = ({ data }) => {
  const isMobile = useSelector((state) => state.setMobile);

  const [selected, setSelected] = useState(null);

  return (
    <div className="home-live-matches container-swifty-special mainInPlay">
      <Accordion
        defaultActiveKey={"0"}
        alwaysOpen
        className="homeSportsMainContainer"
      >
        <Accordion.Item
          eventKey="0"
          style={{
            borderWidth: "0",
            backgroundColor: "#25292d",
          }}
        >
          <Accordion.Header className="homeSportsContainer">
            Starting Soon
          </Accordion.Header>
          <Accordion.Body>
            <StartingSoonHomeMenu
              data={data}
              setSelected={setSelected}
              selected={selected}
            />
            <div className="starting-soon-sports">
              {data
                ?.filter((item) =>
                  selected ? item.slug === selected.slug : true
                )
                .map((item) => {
                  return (
                    <Accordion
                      key={item.id}
                      className="accordion-special-container"
                      defaultActiveKey={"0"}
                    >
                      <div className="firstAccordionItem">
                        <Accordion.Header className="accordion-of-specials inPlay-specials">
                          <span
                            className="hour-of-special-events"
                            style={{ color: "white" }}
                          >
                            {item.name}
                          </span>
                        </Accordion.Header>
                      </div>
                      <Accordion.Body>
                        <div className="matchCardRowContainer">
                          <div className="matchCard row">
                            {!isMobile && (
                              <div className="d-flex position-relative col-2 matchCardDate">
                                <div className="matchCardIcon"></div>
                                <div className="ps-2">Time</div>
                              </div>
                            )}
                            <div className=" matchesContainer col-9 col-lg-6">
                              {isMobile ? (
                                <div className="eventStyle">Event</div>
                              ) : (
                                <>
                                  <div className="matchTeam"></div>
                                  <div className="eventStyle">Event</div>
                                  <div className="matchTeam"></div>
                                </>
                              )}
                            </div>
                            <div className={"odds col-3 col-lg-4"}>
                              {item.competitions[0].events[0].selections.map(
                                (selection) => {
                                  return (
                                    <div
                                      className="matchOddsContainer"
                                      key={selection.bet_id}
                                    >
                                      <div
                                        className={
                                          "matchOdds selectionName firstSelection inPlayPlaceBet"
                                        }
                                      >
                                        {selection.name}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                        {item.competitions.map((competition) => {
                          return (
                            <Accordion
                              className="accordion-special-container inPlaySectionAccordion"
                              defaultActiveKey={"0"}
                              key={competition.id}
                            >
                              <Accordion.Header className="leagues-accordion">
                                <span
                                  className="hour-of-special-events"
                                  style={{ color: "white" }}
                                >
                                  {competition.name}
                                </span>
                              </Accordion.Header>
                              <Accordion.Body>
                                {competition.events.map((event) => {
                                  return (
                                    <div key={event.event_id}>
                                      <div className="matchCard row matchCardRow">
                                        <div className="d-flex position-relative col-2 matchCardDate auto-width-container">
                                          <div className="matchCardIcon">
                                            <Image
                                              src={images.notificationOffIcon}
                                              alt=""
                                              className="bellIcon"
                                            />
                                          </div>
                                          <div className="liveGames">
                                            <div>
                                              {new Date(event.start_time)
                                                .toLocaleDateString("en-GB", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })
                                                .replace(/,/g, "")
                                                .replace(/PM/g, "")
                                                .replace(/AM/g, "")}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="matchesContainer col-8 col-lg-6">
                                          <div className="matchTeam matchTeamStyle">
                                            {event.participants.home_name}
                                          </div>
                                          <div className="matchResult">
                                            {event.participants.home_score} -{" "}
                                            {event.participants.away_score}
                                          </div>
                                          <div className="matchTeam">
                                            {event.participants.away_name}
                                          </div>
                                        </div>
                                        {!isMobile ? (
                                          <div className="odds col-3 col-lg-4">
                                            {event.selections.map(
                                              (selection) => {
                                                return (
                                                  <div
                                                    className="matchOdds selectionName firstSelection oddsInPlay"
                                                    key={selection.bet_id}
                                                  >
                                                    {selection.odd}
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                        ) : (
                                          <div className="odds col-4 auto-width-container mobileBetsOdds">
                                            {event.selections.map(
                                              (selection) => {
                                                return (
                                                  <div
                                                    key={selection.bet_id}
                                                    className="containerOfSelectionsSports containerOfSelectionsOthers"
                                                  >
                                                    <span className="selectionTeams">
                                                      {selection.name}
                                                    </span>
                                                    <div className="matchOddsContainer matchOddsContainerFootball">
                                                      <div
                                                        className="matchOdds firstSelection decimalValue valueOfBets valueOddsInBets inActiveOdd "
                                                        data-value="1.60"
                                                        id="bet_odds_310497739-0"
                                                      >
                                                        {selection.odd}
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </Accordion.Body>
                            </Accordion>
                          );
                        })}
                      </Accordion.Body>
                    </Accordion>
                  );
                })}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
