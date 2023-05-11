import classNames from "classnames";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInPlay } from "../../store/actions";
import { SuccesToast, alertToast } from "../../utils/alert";
import {
  calculateMatchDayAndHour,
  calculateMatchTime,
} from "../../utils/global";
import { HorizontalDots } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import { MatchOdds } from "./MatchOdds";
import Image from "next/image";

const MatchCard = ({
  match,
  moreMarkets,
  firstRow,
  selectionTypes,
  inPlay,
}) => {
  const isMobile = useSelector((state) => state.setMobile);
  let activeSport = useSelector((state) => state.activeSport);
  const [showNotification, setShowNotification] = useState("");
  let matchSelectionsData = match?.selections;
  const navigate = useNavigate();
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
  var liveTime = calculateMatchTime(match);

  const handleClickRow = () => {
    navigate(`/match/${match.match_id}`);
    if (inPlay) {
      dispatch(setInPlay(true));
    } else {
      dispatch(setInPlay(false));
    }
  };
  const handleNotification = () => {
    setShowNotification(!showNotification);
    if (!showNotification) {
      SuccesToast({
        message: `Notifications for ${match?.match_name} are on!`,
      });
    } else {
      alertToast({
        message: `Notifications for ${match?.match_name} are off!`,
      });
    }
  };

  const selectionClassNames = classNames(
    "matchOdds",
    "selectionName",
    "firstSelection",
    {
      singleSelection: selectionTypes.length === 1,
    }
  );
  return (
    <div className="matchCardRowContainer">
      {firstRow && !isMobile && (
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
                <div className="mb-match-time">
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
                          {match?.current_phase === "SecondHalf" &&
                          liveTime > 90
                            ? "90+"
                            : match?.current_phase === "FirstHalf" &&
                              liveTime > 45
                            ? "45+"
                            : liveTime}
                        </div>
                      </>
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
            {selectionTypes &&
              selectionTypes.length > 0 &&
              selectionTypes.map((row, index) => {
                return (
                  <div className="matchOddsContainer " key={index}>
                    <div className={selectionClassNames}>
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
        <div className="mb-match-time dateandtimeofmatchinfootball d-flex justify-content-between">
          <div className="d-flex ">
            <div className="matchCardIcon" onClick={handleNotification}>
              {showNotification ? (
                <Image
                  src={images.notificationOnIcon}
                  alt=""
                  className="bellIcon"
                />
              ) : (
                <Image
                  src={images.notificationOffIcon}
                  alt=""
                  className="bellIcon"
                />
              )}
            </div>
            <div className="liveGames">
              {liveTime ? (
                <>
                  <div>
                    {match?.current_phase === "SecondHalf" && liveTime > 90
                      ? "90+"
                      : match?.current_phase === "FirstHalf" && liveTime > 45
                      ? "45+"
                      : liveTime}
                  </div>
                </>
              ) : (
                <div className="d-flex align-content-center">
                  <>
                    <div className="matchStartGames">
                      {dayOfTheMatch}
                      {", "}{" "}
                    </div>
                    <div className="matchStartGames mb-match-hour">
                      {hourOfMatch}
                    </div>
                  </>
                </div>
              )}
            </div>
          </div>{" "}
          <span className="more-markets-container">
            More markets &nbsp;
            <HorizontalDots />
          </span>
        </div>
      )}
      <div className="matchCard row matchCardRow matchCardFootball">
        {/* Desktop match time */}
        {!isMobile && (
          <div className="d-flex position-relative col-2 matchCardDate auto-width-container">
            <div className="matchCardIcon" onClick={handleNotification}>
              {showNotification ? (
                <Image
                  src={images.notificationOnIcon}
                  alt=""
                  className="bellIcon"
                />
              ) : (
                <Image
                  src={images.notificationOffIcon}
                  alt=""
                  className="bellIcon"
                />
              )}
            </div>
            <div className="liveGames" onClick={handleClickRow}>
              {liveTime ? (
                <>
                  <div>
                    {match?.current_phase === "SecondHalf" && liveTime > 90
                      ? "90'+"
                      : match?.current_phase === "FirstHalf" && liveTime > 45
                      ? "45'+"
                      : liveTime > 0
                      ? liveTime + "'"
                      : liveTime}
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
              ? "matchesContainer col-5 auto-width-container mobileMatchContainer"
              : "matchesContainer col-6 auto-width-container mobileMatchContainer"
          }
          onClick={handleClickRow}
        >
          {isMobile ? (
            <>
              <div className="col-8 matchAll mobileMatchCard mobileMatchRowForTeams">
                <div className="matchTeam matchTeamStyle matchTeamMobile">
                  {homeTeam}
                </div>
                <div className="matchResult matchResultMobile match-vs-teams">
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
                <div className="matchTeam matchTeamMobile">{awayTeam}</div>
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
              ? "odds col-3 auto-width-container mobileBetsOdds"
              : "odds col-4 auto-width-container mobileBetsOdds"
          }
        >
          {matchSelectionsData.slice(0, 3).map((row, index) => {
            let activeClass = `inActiveOdd`;
            return (
              <div
                className={
                  activeSport === 10 && matchSelectionsData?.length > 2
                    ? "containerOfSelections "
                    : "containerOfSelectionsSports containerOfSelectionsOthers"
                }
                key={index}
              >
                {isMobile ? (
                  <span className="selectionTeams">{row?.selection_name}</span>
                ) : (
                  ""
                )}
                <MatchOdds
                  selection={row}
                  key={index}
                  match={match}
                  activeClass={activeClass}
                />
              </div>
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

export default MatchCard;
