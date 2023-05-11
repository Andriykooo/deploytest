import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInPlay } from "../../store/actions";
import { theme } from "../../utils/config";
import {
  calculateMatchDayAndHour,
  calculateMatchTimeOfIceHockeyAndBasketball,
} from "../../utils/global";
import { HorizontalDots } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import Image from "next/image";

const HockeyCard = ({ match, firstRow, id, inPlay }) => {
  const isMobile = useSelector((state) => state.setMobile);
  const dispatch = useDispatch();
  let homeTeam = ``,
    awayTeam = ``;
  if (match?.match_name) {
    if (match?.match_name.indexOf(" v ") > -1) {
      homeTeam = match?.match_name?.split(" v ")[0];
      awayTeam = match?.match_name?.split(" v ")[1];
    }
  }
  let hourOfMatch = calculateMatchDayAndHour(match, "hour");
  let dayOfTheMatch = calculateMatchDayAndHour(match, "day");
  var liveTime = calculateMatchTimeOfIceHockeyAndBasketball(match, id);

  const navigate = useNavigate();
  const handleClickRow = () => {
    navigate(`/match/${match.match_id}`);
    if (inPlay) {
      dispatch(setInPlay(true));
    } else {
      dispatch(setInPlay(false));
    }
  };
  let moreMarket;
  if (id === "15") {
    moreMarket = true;
  }

  return (
    <div className="matchCardRowContainer">
      {firstRow && !isMobile && (
        <div className="matchCard row">
          <div className="d-flex col-2 matchCardDate">
            <div className="matchCardIcon"></div>
            <div className="ps-2">Time</div>
          </div>
          <div className="d-flex col-4 matchCardDate justify-content-center ">
            <div className="matchCardIcon"></div>
            <div className="ps-2">Event</div>
          </div>
          <div className="d-flex col-6 matchCardDate justify-content-end  p-0">
            <div style={{ width: "105px", textAlign: "center" }}>
              Money Line
            </div>
            <div style={{ width: "105px", textAlign: "center" }}>Spread</div>
            <div style={{ width: "105px", textAlign: "center" }}>
              Total Goals
            </div>
            <div style={{ width: "105px", textAlign: "center" }}>
              More Markets
            </div>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="mb-match-time">
          <div className="d-flex">
            <div className="matchCardIcon">
              <Image
                src={images.notificationOffIcon}
                alt=""
                className="bellIcon"
              />
            </div>
            <div className="liveGames">
              {liveTime ? (
                <div>{liveTime}</div>
              ) : (
                <>
                  <div className="matchStartGames">
                    {dayOfTheMatch}
                    {", "}{" "}
                  </div>
                  <div className="matchStartGames mb-match-hour">
                    {hourOfMatch}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="d-flex">
            <div className="d-flex justify-content-center align-items-center MarketMenuContainer tempmarketMenu">
              More Markets
            </div>

            <div className="col-3 more-markets MarketMenuContainer">
              <HorizontalDots />
            </div>
          </div>
        </div>
      )}
      <div className="matchCard  matchCardRow matchIceHockeyRow">
        {/* Desktop match time */}
        {!isMobile && (
          <div
            className="d-flex position-relative col-2 matchCardDate auto-width-container"
            onClick={handleClickRow}
          >
            <div className="matchCardIcon">
              <Image
                src={images.notificationOffIcon}
                alt=""
                className="bellIcon"
              />
            </div>
            <div className="liveGames">
              {liveTime ? (
                <div>{liveTime}</div>
              ) : (
                <>
                  <div className="matchStartGames">{dayOfTheMatch}</div>
                  <div className="matchStartGames mt-1">{hourOfMatch}</div>
                </>
              )}
            </div>
          </div>
        )}
        <div
          className={
            isMobile
              ? "matchesContainer col-4 auto-width-container teamsIceHockey"
              : "matchesContainer col-4 auto-width-container"
          }
          onClick={handleClickRow}
        >
          {isMobile ? (
            <div className="row w-100">
              <div className="matchTeam col-5 justify-content-center">
                {homeTeam}
              </div>
              <div className="matchResult col-2 justify-content-center match-result-ice-hockey">
                vs
              </div>
              <div className="matchTeam col-5 justify-content-center">
                {awayTeam}
              </div>
            </div>
          ) : (
            <>
              <div className="matchTeam matchTeamStyle">{homeTeam}</div>
              <div className="matchResult">
                {match?.match_details?.Scores?.Home &&
                match?.match_details?.Scores?.Away &&
                match?.current_phase !== "PreMatch" ? (
                  <>
                    {match?.match_details?.Scores?.Home} :{" "}
                    {match?.match_details?.Scores?.Away}
                  </>
                ) : (
                  " vs "
                )}
              </div>
              <div className="matchTeam">{awayTeam}</div>
            </>
          )}
        </div>

        <div
          className={
            isMobile
              ? "odds col-6 auto-width-container iceHockeyGames"
              : "odds col-6 auto-width-container "
          }
        >
          {!isMobile ? (
            <>
              <div className="betIceHockeyContainer">
                <div
                  className="ice-hockey-main-container"
                  style={{
                    borderBottom: `1px solid ${theme?.colors?.mainSecondary}`,
                  }}
                >
                  <div className="selectionTeamContainer">Devils</div>
                  <div>20/22</div>
                </div>
                <div className="ice-hockey-main-container">
                  <div className="selectionTeamContainer">Wings</div>
                  <div>20/22</div>
                </div>
              </div>
              <div className="betIceHockeyContainer">
                <div
                  className="ice-hockey-main-container"
                  style={{
                    borderBottom: `1px solid ${theme?.colors?.mainSecondary}`,
                  }}
                >
                  <div className="selectionTeamContainer">-0.5</div>
                  <div>11/8</div>
                </div>
                <div className="ice-hockey-main-container">
                  <div className="selectionTeamContainer">+0.5</div>
                  <div>4/6</div>
                </div>
              </div>
              <div className="betIceHockeyContainer">
                <div
                  className="ice-hockey-main-container"
                  style={{
                    borderBottom: `1px solid ${theme?.colors?.mainSecondary}`,
                  }}
                >
                  <div className="selectionTeamContainer">Over 6.5</div>
                  <div>11/6</div>
                </div>
                <div className="ice-hockey-main-container">
                  <div className="selectionTeamContainer">Under 6.5</div>
                  <div>4/6</div>
                </div>
              </div>
            </>
          ) : (
            <div className="row w-100">
              <div className="col-4 ice-hockey-container ">
                <div className="betAmountIcehockey">Money Line</div>
                <div className="ice-hockey-sub-container">
                  <span className="betAmountIcehockey">Sabres</span>
                  <span className="betAmountsIceHockey">20/22</span>
                </div>
                <div className="ice-hockey-sub-container">
                  <span className="betAmountIcehockey">Horricane</span>
                  <span className="betAmountsIceHockey">21/22</span>
                </div>
              </div>
              <div className="col-4 ice-hockey-container ">
                <div className="betAmountIcehockey">Spread</div>
                <div className="ice-hockey-sub-container">
                  <span className="betAmountIcehockey">Sabres</span>
                  <span className="betAmountsIceHockey">20/22</span>
                </div>
                <div className="ice-hockey-sub-container">
                  <span className="betAmountIcehockey">Horricane</span>
                  <span className="betAmountsIceHockey">21/22</span>
                </div>
              </div>
              <div className="col-4 ice-hockey-container ">
                <div className="betAmountIcehockey">Total Goals</div>
                <div className="ice-hockey-sub-container">
                  <span className="betAmountIcehockey">Sabres</span>
                  <span className="betAmountsIceHockey">20/22</span>
                </div>
                <div className="ice-hockey-sub-container">
                  <span className="betAmountIcehockey">Horricane</span>
                  <span className="betAmountsIceHockey">21/22</span>
                </div>
              </div>
            </div>
          )}
          {moreMarket && !isMobile && (
            <div className="col-3 more-markets MarketMenuContainer">
              <HorizontalDots />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HockeyCard;
