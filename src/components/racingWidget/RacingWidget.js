import React from "react";
import { Accordion } from "react-bootstrap";
import { matchesPerRow } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { Carousel } from "../carousel/Carousel";
import { HorseRacingHomeMenu } from "../custom/HomeSportMenus";

export const RacingWidget = () => {
  return (
    <div className="home-live-matches container-swifty-special mainInPlay">
      <Accordion
        defaultActiveKey="0"
        alwaysOpen
        className="homeSportsMainContainer"
      >
        <Accordion.Item
          eventKey="0"
          style={{ borderWidth: "0", backgroundColor: "#25292d" }}
        >
          <Accordion.Header className="homeSportsContainer horseRacingContainer">
            Next Off - Horse Racing
          </Accordion.Header>
          <Accordion.Body className="racingBody">
            <HorseRacingHomeMenu />
            <div className="horse-matches">
              <Carousel arrowClassName="small-arrows">
                <div className="horse-links">
                  <div className="racingLink">
                    <img
                      src={images.streamVideo}
                      alt="#"
                      className="racingHeaderImg"
                    />
                    Carlise 14:35
                  </div>
                  <div className="racingUnderTitle">2m 1f | EW 1/5 1-2-3</div>
                </div>
                <div className="horse-links">
                  <div className="racingLink">
                    <img
                      src={images.streamVideo}
                      alt="#"
                      className="racingHeaderImg"
                    />
                    Carlise 14:35
                  </div>
                  <div className="racingUnderTitle">2m 1f | EW 1/5 1-2-3</div>
                </div>
                <div className="horse-links">
                  <div className="racingLink">
                    <img
                      src={images.streamVideo}
                      alt="#"
                      className="racingHeaderImg"
                    />
                    Carlise 14:35
                  </div>
                  <div className="racingUnderTitle">2m 1f | EW 1/5 1-2-3</div>
                </div>
                <div className="horse-links">
                  <div className="racingLink">
                    <img
                      src={images.streamVideo}
                      alt="#"
                      className="racingHeaderImg"
                    />
                    Carlise 14:35
                  </div>
                  <div className="racingUnderTitle">2m 1f | EW 1/5 1-2-3</div>
                </div>
                <div className="horse-links">
                  <div className="racingLink">
                    <img
                      src={images.streamVideo}
                      alt="#"
                      className="racingHeaderImg"
                    />
                    Carlise 14:35
                  </div>
                  <div className="racingUnderTitle">2m 1f | EW 1/5 1-2-3</div>
                </div>
                <div className="horse-links">
                  <div className="racingLink">
                    <img
                      src={images.streamVideo}
                      alt="#"
                      className="racingHeaderImg"
                    />
                    Carlise 14:35
                  </div>
                  <div className="racingUnderTitle">2m 1f | EW 1/5 1-2-3</div>
                </div>
                <div className="horse-links">
                  <div className="racingLink">
                    <img
                      src={images.streamVideo}
                      alt="#"
                      className="racingHeaderImg"
                    />
                    Carlise 14:35
                  </div>
                  <div className="racingUnderTitle">2m 1f | EW 1/5 1-2-3</div>
                </div>
              </Carousel>
              <div className="events-contents-container horseEvents">
                {matchesPerRow?.map((row, index) => {
                  return (
                    <div className="events-row-container" key={index}>
                      <div className="events-small-container">
                        <div className="horse-container">
                          <span className="text-of-horse">
                            <img src={images.shirt} alt="#" />
                            {row.matchTitle}
                          </span>
                          <span className="odds-of-horse">{row.bet}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="more-container-in-horse">
                  <span className="more-sidebar-in-events ">
                    View Racecard {">"}
                  </span>
                </div>
                <div className="more-container-in-horse">
                  <span className="more-sidebar-in-events ">
                    View Racecard {">"}
                  </span>
                </div>
                <div className="more-container-in-horse">
                  <span className="more-sidebar-in-events ">
                    View Racecard {">"}
                  </span>
                </div>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
