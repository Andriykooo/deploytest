import Image from "next/image";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useSelector } from "react-redux";
import { popularCasinoGames, sportsData } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { InPlayHomeMenu, SwiftySpecialsHomeMenu } from "./HomeSportMenus";

export const InPlaySpecials = () => {
  const isMobile = useSelector((state) => state.setMobile);

  const gamesByLeague = {};

  for (const sport in sportsData) {
    const { leagues, games } = sportsData[sport];
    leagues.forEach((league) => {
      gamesByLeague[league.league] = games.filter(
        (game) => game.league === league.league
      );
    });
  }

  const [showMenu, setShowMenu] = useState(false);

  const handleButtonClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="home-live-matches container-swifty-special mainInPlay">
      <Accordion
        defaultActiveKey={0}
        alwaysOpen
        className="homeSportsMainContainer"
      >
        <Accordion.Item
          style={{ borderWidth: "0", backgroundColor: "#25292d" }}
        ></Accordion.Item>
        <Accordion.Header
          className="homeSportsContainer"
          onClick={handleButtonClick}
        >
          In Play
        </Accordion.Header>

        <Accordion.Body>
          {showMenu && <InPlayHomeMenu />}
          {Object.entries(sportsData).map(([sport, data], index) => {
            return (
              <Accordion
                key={sport}
                className="accordion-special-container inPlayAccordion"
                defaultActiveKey={0}
                alwaysOpen
              >
                <div
                  className={`firstAccordionItem ${
                    index === 0 ? "padding-class" : ""
                  }`}
                >
                  <Accordion.Header className="accordion-of-specials inPlay-specials">
                    <span
                      className="hour-of-special-events"
                      style={{ color: "white" }}
                    >
                      {sport}
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
                        {data.bets &&
                          data.bets.map((row) => {
                            return (
                              <div className="matchOddsContainer" key={row.id}>
                                <div
                                  className={
                                    "matchOdds selectionName firstSelection inPlayPlaceBet"
                                  }
                                >
                                  {row.bet}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  <Accordion.Body>
                    {data.leagues.map((league) => {
                      const test = league.league;
                      return (
                        <Accordion
                          className="accordion-special-container inPlaySectionAccordion"
                          defaultActiveKey={0}
                          alwaysOpen
                          key={league.id}
                        >
                          <Accordion.Header className="leagues-accordion">
                            <span
                              className="hour-of-special-events"
                              style={{ color: "white" }}
                            >
                              {league.league}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body>
                            {Object.entries(gamesByLeague).map(
                              ([leagueIndex, league]) => (
                                <div key={leagueIndex}>
                                  {league.map((game) => {
                                    if (test === game.league) {
                                      return (
                                        <div
                                          key={game.id}
                                          className="matchCard row matchCardRow"
                                        >
                                          <div className="d-flex position-relative col-2 matchCardDate auto-width-container">
                                            <div className="matchCardIcon">
                                              <Image
                                                src={images.notificationOffIcon}
                                                alt=""
                                                className="bellIcon"
                                              />
                                            </div>
                                            <div className="liveGames">
                                              <div>{game.time}</div>
                                            </div>
                                          </div>
                                          <div className="matchesContainer col-9 col-lg-6">
                                            {game.homeTeam && isMobile ? (
                                              <>
                                                <div className="matchTeam matchTeamStyle matchTeamMobile">
                                                  {game.homeTeam}
                                                </div>
                                                <div className="matchResult matchResultMobile match-vs-teams">
                                                  {" "}
                                                  vs
                                                </div>
                                                <div className="matchTeam matchTeamMobile">
                                                  {game.awayTeam}
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                <div className="matchTeam matchTeamStyle">
                                                  {game.homeTeam}
                                                </div>
                                                <div className="matchResult">
                                                  {" "}
                                                  vs
                                                </div>
                                                <div className="matchTeam">
                                                  {game.awayTeam}
                                                </div>
                                              </>
                                            )}
                                          </div>
                                          {!isMobile ? (
                                            <div className="odds col-3 col-lg-4">
                                              {data.odds &&
                                                data.odds.map((rowOdds) => {
                                                  return (
                                                    <div
                                                      className="matchOdds selectionName firstSelection oddsInPlay"
                                                      key={rowOdds.id}
                                                    >
                                                      {rowOdds.odd}
                                                    </div>
                                                  );
                                                })}
                                            </div>
                                          ) : (
                                            <div className="odds col-4 auto-width-container mobileBetsOdds">
                                              <div className="containerOfSelectionsSports containerOfSelectionsOthers">
                                                <span className="selectionTeams">
                                                  Home
                                                </span>
                                                <div className="matchOddsContainer matchOddsContainerFootball">
                                                  <div
                                                    className="matchOdds firstSelection decimalValue valueOfBets valueOddsInBets inActiveOdd "
                                                    data-value="1.60"
                                                    id="bet_odds_310497739-0"
                                                  >
                                                    19/4
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="containerOfSelectionsSports containerOfSelectionsOthers">
                                                <span className="selectionTeams">
                                                  Draw
                                                </span>
                                                <div className="matchOddsContainer matchOddsContainerFootball">
                                                  <div
                                                    className="matchOdds firstSelection decimalValue valueOfBets valueOddsInBets inActiveOdd "
                                                    data-value="2.35"
                                                    id="bet_odds_310497740-0"
                                                  >
                                                    20/4
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="containerOfSelectionsSports containerOfSelectionsOthers">
                                                <span className="selectionTeams">
                                                  Away
                                                </span>
                                                <div className="matchOddsContainer matchOddsContainerFootball">
                                                  <div
                                                    className="matchOdds firstSelection decimalValue valueOfBets valueOddsInBets inActiveOdd "
                                                    data-value="2.35"
                                                    id="bet_odds_310497740-0"
                                                  >
                                                    21/4
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              )
                            )}
                          </Accordion.Body>
                        </Accordion>
                      );
                    })}
                  </Accordion.Body>
                </Accordion.Body>
              </Accordion>
            );
          })}
        </Accordion.Body>
      </Accordion>
    </div>
  );
};

export const PopularCasino = () => {
  return (
    <div className="home-live-matches container-swifty-special mainInPlay">
      <Accordion
        defaultActiveKey={0}
        alwaysOpen
        className="homeSportsMainContainer"
      >
        <Accordion.Item
          style={{ borderWidth: "0", backgroundColor: "#25292d" }}
        ></Accordion.Item>
        <Accordion.Header className="homeSportsContainer popularCasinoContainer">
          Popular In Casino
        </Accordion.Header>
        <Accordion.Body>
          <div className="casino-grid-container">
            {popularCasinoGames.map((row, index) => {
              let itemClass = index === 0 ? "item1" : "item";
              return (
                <div
                  className={itemClass}
                  style={{ backgroundImage: `url(${row})` }}
                  key={index}
                ></div>
              );
            })}
          </div>
        </Accordion.Body>
      </Accordion>
    </div>
  );
};

export const SwiftySpecials = () => {
  const isMobile = useSelector((state) => state.setMobile);

  const gamesByLeague = {};

  for (const sport in sportsData) {
    const { leagues, games } = sportsData[sport];
    leagues.forEach((league) => {
      gamesByLeague[league.league] = games.filter(
        (game) => game.league === league.league
      );
    });
  }

  const [showMenu, setShowMenu] = useState(false);

  const handleButtonClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div className="home-live-matches container-swifty-special mainInPlay">
      <Accordion
        defaultActiveKey={0}
        alwaysOpen
        className="homeSportsMainContainer"
      >
        <Accordion.Item
          style={{ borderWidth: "0", backgroundColor: "#25292d" }}
        ></Accordion.Item>
        <Accordion.Header
          className="homeSportsContainer"
          onClick={handleButtonClick}
        >
          Swifty Specials
        </Accordion.Header>

        <Accordion.Body>
          {showMenu && <SwiftySpecialsHomeMenu />}
          {Object.entries(sportsData).map(([sport, data], index) => {
            return (
              <Accordion
                key={index}
                className="accordion-special-container inPlayAccordion"
                defaultActiveKey={0}
                alwaysOpen
              >
                <div
                  className={`firstAccordionItem ${
                    index === 0 ? "padding-class" : ""
                  }`}
                >
                  <Accordion.Header className="accordion-of-specials inPlay-specials">
                    <span
                      className="hour-of-special-events"
                      style={{ color: "white" }}
                    >
                      {sport}
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
                          <>
                            <div className="eventStyle">Event</div>
                          </>
                        ) : (
                          <>
                            <div className="matchTeam"></div>
                            <div className="eventStyle">Event</div>
                            <div className="matchTeam"></div>
                          </>
                        )}
                      </div>
                      <div className={"odds col-3 col-lg-4"}>
                        {data.bets &&
                          data.bets.map((row, betsIndex) => {
                            return (
                              <div
                                className="matchOddsContainer"
                                key={betsIndex}
                              >
                                <div
                                  className={
                                    "matchOdds selectionName firstSelection inPlayPlaceBet"
                                  }
                                >
                                  {row.bet}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  <Accordion.Body>
                    {data.leagues.map((league) => {
                      const test = league.league;
                      return (
                        <Accordion
                          className="accordion-special-container inPlaySectionAccordion"
                          defaultActiveKey={0}
                          alwaysOpen
                          key={league.league}
                        >
                          <Accordion.Header className="leagues-accordion">
                            <span
                              className="hour-of-special-events"
                              style={{ color: "white" }}
                            >
                              {league.league}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body>
                            {Object.entries(gamesByLeague).map(
                              ([leagueIndex, league]) => (
                                <div key={leagueIndex}>
                                  {league.map((game, secondLeagueIndex) => {
                                    if (test === game.league) {
                                      return (
                                        <div
                                          key={secondLeagueIndex}
                                          className="matchCard row matchCardRow"
                                        >
                                          <div className="d-flex position-relative col-2 matchCardDate auto-width-container">
                                            <div className="matchCardIcon">
                                              <Image
                                                src={images.notificationOffIcon}
                                                alt=""
                                                className="bellIcon"
                                              />
                                            </div>
                                            <div className="liveGames">
                                              <div>{game.time}</div>
                                            </div>
                                          </div>
                                          <div className="matchesContainer col-9 col-lg-6">
                                            {game.homeTeam && isMobile ? (
                                              <>
                                                <div className="matchTeam matchTeamStyle matchTeamMobile">
                                                  {game.homeTeam}
                                                </div>
                                                <div className="matchResult matchResultMobile match-vs-teams">
                                                  {" "}
                                                  vs
                                                </div>
                                                <div className="matchTeam matchTeamMobile">
                                                  {game.awayTeam}
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                <div className="matchTeam matchTeamStyle">
                                                  {game.homeTeam}
                                                </div>
                                                <div className="matchResult">
                                                  {" "}
                                                  vs
                                                </div>
                                                <div className="matchTeam">
                                                  {game.awayTeam}
                                                </div>
                                              </>
                                            )}
                                          </div>
                                          {!isMobile ? (
                                            <div className="odds col-3 col-lg-4">
                                              {data.odds &&
                                                data.odds.map(
                                                  (row, oddsIndex) => {
                                                    return (
                                                      <div
                                                        className="matchOdds selectionName firstSelection oddsInPlay"
                                                        key={oddsIndex}
                                                      >
                                                        {row.odd}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                            </div>
                                          ) : (
                                            <div className="odds col-4 auto-width-container mobileBetsOdds">
                                              <div className="containerOfSelectionsSports containerOfSelectionsOthers">
                                                <span className="selectionTeams">
                                                  Home
                                                </span>
                                                <div className="matchOddsContainer matchOddsContainerFootball">
                                                  <div
                                                    className="matchOdds firstSelection decimalValue valueOfBets valueOddsInBets inActiveOdd "
                                                    data-value="1.60"
                                                    id="bet_odds_310497739-0"
                                                  >
                                                    19/4
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="containerOfSelectionsSports containerOfSelectionsOthers">
                                                <span className="selectionTeams">
                                                  Draw
                                                </span>
                                                <div className="matchOddsContainer matchOddsContainerFootball">
                                                  <div
                                                    className="matchOdds firstSelection decimalValue valueOfBets valueOddsInBets inActiveOdd "
                                                    data-value="2.35"
                                                    id="bet_odds_310497740-0"
                                                  >
                                                    20/4
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="containerOfSelectionsSports containerOfSelectionsOthers">
                                                <span className="selectionTeams">
                                                  Away
                                                </span>
                                                <div className="matchOddsContainer matchOddsContainerFootball">
                                                  <div
                                                    className="matchOdds firstSelection decimalValue valueOfBets valueOddsInBets inActiveOdd "
                                                    data-value="2.35"
                                                    id="bet_odds_310497740-0"
                                                  >
                                                    21/4
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              )
                            )}
                          </Accordion.Body>
                        </Accordion>
                      );
                    })}
                  </Accordion.Body>
                </Accordion.Body>
              </Accordion>
            );
          })}
        </Accordion.Body>
      </Accordion>
    </div>
  );
};
