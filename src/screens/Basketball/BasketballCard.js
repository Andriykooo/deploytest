import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInPlay } from "../../store/actions";
import {
  calculateMatchDayAndHour,
  calculateMatchTime,
} from "../../utils/global";
import { HorizontalDots } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import { MatchOdds } from "../../components/matches/MatchOdds";
import Image from "next/image";

const BasketballCard = ({
  match,
  moreMarkets,
  firstRow,
  selectionTypes,
  inPlay,
}) => {
  let matchSelectionsData = match?.selections;
  const isMobile = useSelector((state) => state.setMobile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  var liveTime = calculateMatchTime(match);

  const handleClickRow = () => {
    navigate(`/match/${match.match_id}`);
    if (inPlay) {
      dispatch(setInPlay(true));
    } else {
      dispatch(setInPlay(false));
    }
  };
  return (
    <div className="matchCardRowContainer">
      {firstRow && (
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
          <div
            className={
              moreMarkets ? "odds col-3 col-lg-3" : "odds col-3 col-lg-4"
            }
          >
            {selectionTypes.map((row) => {
              return (
                <div className="matchOddsContainer" key={row?.selection_name}>
                  <div
                    className={
                      selectionTypes.length === 1
                        ? "matchOdds selectionName firstSelection singleSelection"
                        : "matchOdds selectionName firstSelection"
                    }
                  >
                    {row.selection_name}
                  </div>
                </div>
              );
            })}
          </div>
          {moreMarkets && <div className="col-1">More Markets</div>}
        </div>
      )}
      {/* Mobile match time */}
      {isMobile && (
        <div className="mb-match-time">
          <div className="matchCardIcon">
            <Image src={images.notificationOffIcon} alt="" className="bellIcon" />
          </div>
          <div className="liveGames">
            {match?.current_phase === "FirstQuarter" ||
            match?.current_phase === "SecondQuarter" ||
            match?.current_phase === "ThirdQuarter" ||
            match?.current_phase === "FourthQuarter" ? (
              <>
                <div>{match?.current_phase}</div>
              </>
            ) : (
              <>
                <div className="matchStartGames">
                  {match?.current_phase !== "FirstQuarter" ||
                  match?.current_phase !== "SecondQuarter" ||
                  match?.current_phase !== "ThirdQuarter" ||
                  match?.current_phase !== "FourthQuarter"
                    ? dayOfTheMatch
                    : liveTime}
                  {", "}{" "}
                </div>
                <div className="matchStartGames mb-match-hour">
                  {hourOfMatch}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="matchCard row matchCardRow ">
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
                <>
                  <div>
                    {match?.current_phase === "FirstQuarter" ||
                    match?.current_phase === "SecondQuarter" ||
                    match?.current_phase === "ThirdQuarter" ||
                    match?.current_phase === "FourthQuarter"
                      ? liveTime
                      : match?.current_phase}
                  </div>
                </>
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
            moreMarkets
              ? "matchesContainer col-5 auto-width-container"
              : "matchesContainer col-6 auto-width-container"
          }
          onClick={handleClickRow}
        >
          {isMobile ? (
            <>
              <div className="col-8 matchAll mobileMatchCard">
                <div className="matchTeam matchTeamStyle">{homeTeam}</div>
                <div className="matchTeam">{awayTeam}</div>
              </div>
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
            </>
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
            moreMarkets
              ? "odds col-3 auto-width-container"
              : "odds col-4 auto-width-container"
          }
        >
          {matchSelectionsData.slice(0, 3).map((row, index) => {
            let activeClass = `inActiveOdd`;
            return (
              <MatchOdds
                selection={row}
                key={index}
                match={match}
                activeClass={activeClass}
              />
            );
          })}
        </div>
        {moreMarkets && (
          <div className="col-1 more-markets">
            <HorizontalDots />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketballCard;
