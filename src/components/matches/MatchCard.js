import { useDispatch, useSelector } from "react-redux";
import {
  addToFavouriteGames,
  removeFromFavouriteGames,
  setInPlay,
} from "../../store/actions";
import { SuccesToast, alertToast } from "../../utils/alert";
import { MatchOdds } from "./MatchOdds";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { NotificationOff, NotificationOn } from "@/utils/icons";
import "./Matches.css";
import { apiServices } from "@/utils/apiServices";
import { apiUrl, phaseStatus } from "@/utils/constants";
import { useEffect, useState } from "react";
import { isMatchSuspended } from "@/utils/global";
import classNames from "classnames";

const SecondsIndicator = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow((value) => !value);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return show ? "'" : null;
};

const MatchCard = ({
  match,
  inPlay,
  marketTypes,
  sportSlug,
  selectedMarket,
}) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const router = useCustomRouter();

  const favoriteGames = useSelector((state) => state.favouriteGames);
  const isTablet = useSelector((state) => state.isTablet);
  const activeSport = useSelector((state) => state.activeSport);
  const updatedEvents = useSelector((state) => state.updatedEvents);
  const [currentTime, setCurrentTime] = useState(match?.current_time);
  const [currentPhase, setCurrentPhase] = useState(match?.current_phase);

  const updatesForMatch = updatedEvents?.[match.id];

  let matchData = match;

  if (updatesForMatch) {
    matchData = {
      ...matchData,
      ...updatesForMatch.data,
    };
  }

  const eventId = matchData?.id || matchData?.event_id;
  const matchName = `${matchData?.participants?.[0]?.name} v ${matchData?.participants?.[1]?.name}`;
  const notificationEnabled = favoriteGames?.has(String(eventId));

  const currentStatus =
    updatesForMatch?.data?.current_status || match.current_status;

  const isLive = currentStatus === phaseStatus.IN_PLAY;
  const isPreMatch = currentStatus === phaseStatus.PRE_MATCH;
  const isFinished = currentStatus === phaseStatus.FINISHED;

  const canHaveResult = matchData?.can_have_result;

  const handleClickRow = () => {
    if (!isMatchSuspended(currentStatus)) {
      router.push(
        `/${sportSlug}/event/${matchData?.id || matchData?.event_id}`
      );
      if (inPlay) {
        dispatch(setInPlay(true));
      } else {
        dispatch(setInPlay(false));
      }
    }
  };

  const handleNotification = () => {
    if (!notificationEnabled) {
      dispatch(addToFavouriteGames(String(eventId)));

      apiServices
        .post(apiUrl.ADD_TO_FAVORITE_GAMES, {
          gameId: eventId,
          instance: "event",
        })
        .then(() =>
          SuccesToast({
            message: t("sports.notifications_for_match_are_on", { matchName }),
          })
        );
    } else {
      dispatch(removeFromFavouriteGames(String(eventId)));

      apiServices
        .delete(apiUrl.REMOVE_FROM_FAVORITE_GAMES, {
          gameId: eventId,
        })
        .then(() =>
          alertToast({
            message: t("sports.notifications_for_match_are_off", { matchName }),
          })
        );
    }
  };

  useEffect(() => {
    let intervalId = null;
    let timeoutId = null;

    try {
      if (isLive) {
        clearInterval(intervalId);
        clearTimeout(timeoutId);

        const phaseTime =
          updatesForMatch?.data?.phase_time || match?.phase_time;

        const currentPhase =
          updatesForMatch?.data?.current_phase || match?.current_phase;

        const currentTime = parseInt(
          updatesForMatch?.data?.current_time || match?.current_time
        );

        setCurrentTime(currentTime);
        setCurrentPhase(currentPhase);

        if (currentTime && phaseTime && phaseTime.includes(":")) {
          const [minutes, seconds] = phaseTime.split(":");

          timeoutId = setTimeout(() => {
            setCurrentTime(minutes + 1);

            intervalId = setInterval(() => {
              setCurrentTime((prevValue) => prevValue + 1);
            }, 60 * 1000);
          }, seconds * 1000);

          return;
        }

        if (currentTime) {
          intervalId = setInterval(() => {
            setCurrentTime((prevValue) => prevValue + 1);
          }, 60 * 1000);
        }
      }
    } catch (e) {
      console.log(e);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [updatesForMatch]);

  return (
    <div className="matchCardRowContainer" id={match.id}>
      {isTablet && (
        <div className="mb-match-time dateandtimeofmatchinfootball d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <div className="matchCardIcon" onClick={handleNotification}>
              {notificationEnabled ? (
                <NotificationOn className="bellIcon" />
              ) : (
                <NotificationOff className="bellIcon" />
              )}
            </div>
            <div className={isLive ? "in-play-time" : "starting-soon-games"}>
              {isLive &&
                (currentTime ? (
                  <>
                    {currentTime}
                    <SecondsIndicator />
                  </>
                ) : (
                  currentPhase
                ))}
              {isPreMatch &&
                moment(matchData.start_time).format("DD MMM HH:mm")}
              {!isPreMatch &&
                !isLive &&
                (updatesForMatch?.data?.current_phase || match?.current_phase)}
            </div>
          </div>
          <div className="odds">
            {marketTypes &&
              marketTypes.map((marketType) => {
                const {
                  event_part_id,
                  market_id,
                  market_type_id,
                  outcome_id,
                  outcome_name,
                  participant_role_id,
                } = marketType;

                return (
                  <div
                    className="selectionName"
                    key={`${event_part_id}${market_id}${market_type_id}${outcome_id}${outcome_name}${participant_role_id}`}
                  >
                    {outcome_name}
                  </div>
                );
              })}
          </div>
          {/* <div className="more-markets-container" onClick={handleClickRow}>
            <HorizontalDots />
          </div> */}
        </div>
      )}
      <div
        // className="matchCard row matchCardRow matchCardFootball"
        className={classNames("matchCard row matchCardRow matchCardFootball", {
          ["pe-none"]: isMatchSuspended(currentStatus),
        })}
      >
        {!isTablet && (
          <div className="matchCardDate">
            <div className="matchCardIcon" onClick={handleNotification}>
              {notificationEnabled ? (
                <NotificationOn className="bellIcon" />
              ) : (
                <NotificationOff className="bellIcon" />
              )}
            </div>
            <div className={isLive ? "in-play-time" : "starting-soon-games"}>
              {isLive &&
                (currentTime ? (
                  <>
                    {currentTime}
                    <SecondsIndicator />
                  </>
                ) : (
                  currentPhase
                ))}
              {isPreMatch &&
                moment(matchData.start_time).format("DD MMM HH:mm")}
              {!isPreMatch &&
                !isLive &&
                (updatesForMatch?.data?.current_phase || match?.current_phase)}
            </div>
          </div>
        )}
        <div
          className="matchesContainer mobileMatchContainer"
          onClick={handleClickRow}
        >
          {isTablet ? (
            <>
              <div className="matchAll mobileMatchCard mobileMatchRowForTeams">
                <div className="matchTeam matchTeamStyle matchTeamMobile">
                  <div className="matchTeam-name">
                    {matchData?.participants[0].name}
                  </div>
                  <div className="matchTeam-name">
                    {matchData?.participants[1].name}
                  </div>
                </div>
                <div className="matchTeam-score">
                  <div className="match-score">
                    {isLive || isFinished
                      ? matchData?.participants[0].score
                      : "-"}
                  </div>
                  <div className="match-score">
                    {isLive || isFinished
                      ? matchData?.participants[1].score
                      : "-"}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="matchTeam matchTeamStyle">
                {matchData?.participants[0].name}
              </div>
              <div className="matchResult">
                {(isLive || isFinished) && canHaveResult ? (
                  <>
                    {matchData?.participants[0].score} :{" "}
                    {matchData?.participants[1].score}
                  </>
                ) : (
                  t("common.vs")
                )}
              </div>
              <div className="matchTeam">{matchData?.participants[1].name}</div>
            </>
          )}
        </div>
        {/* {isTablet && (
          <div className="odds">
            {match?.selections?.length > 0 &&
              match?.selections.map((selection, index) => {
                return (
                  <div className="selectionName" key={index}>
                    {selection?.name || selection?.outcome_name}
                  </div>
                );
              })}
          </div>
        )} */}
        <div className="odds mobileBetsOdds rowBetsOdds">
          {match.selections.map((selection, index) => {
            if (selection) {
              selection.description = selectedMarket?.market_name;
              selection.match_name = match?.name;
            }

            return (
              <div
                className={
                  activeSport === 10 && match.selections?.length > 2
                    ? "containerOfSelections"
                    : "containerOfSelectionsSports containerOfSelectionsOthers"
                }
                key={selection?.bet_id || index}
              >
                <MatchOdds
                  selection={selection}
                  currentStatus={currentStatus}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
