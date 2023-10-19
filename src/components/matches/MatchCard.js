import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInPlay } from "../../store/actions";
import { SuccesToast, alertToast } from "../../utils/alert";
import { HorizontalDots } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import { MatchOdds } from "./MatchOdds";
import "./Matches.css";
import moment from "moment";

const MatchCard = ({ match, inPlay }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const matchName = `${match.participants[0].name} v ${match.participants[1].name}`;
  const isTablet = useSelector((state) => state.isTablet);
  const activeSport = useSelector((state) => state.activeSport);

  const [showNotification, setShowNotification] = useState("");

  const handleClickRow = () => {
    router.push(`/match/${match?.id || match?.event_id}`);
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
        message: `Notifications for ${matchName} are on!`,
      });
    } else {
      alertToast({
        message: `Notifications for ${matchName} are off!`,
      });
    }
  };

  return (
    <div className="matchCardRowContainer">
      {isTablet && (
        <div className="mb-match-time dateandtimeofmatchinfootball d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <div className="matchCardIcon" onClick={handleNotification}>
              {showNotification ? (
                <Image
                  src={images.notificationOnIcon}
                  alt="bell"
                  className="bellIcon"
                  height={24}
                  width={24}
                />
              ) : (
                <Image
                  src={images.notificationOffIcon}
                  alt="bell"
                  className="bellIcon"
                  height={24}
                  width={24}
                />
              )}
            </div>
            <div>
              {moment.utc(match.start_time).local().format("DD MMM HH:mm")}
            </div>
          </div>
          <div className="more-markets-container" onClick={handleClickRow}>
            <HorizontalDots />
          </div>
        </div>
      )}
      <div className="matchCard row matchCardRow matchCardFootball">
        {!isTablet && (
          <div className="matchCardDate">
            <div className="matchCardIcon" onClick={handleNotification}>
              {showNotification ? (
                <Image
                  src={images.notificationOnIcon}
                  alt="bell"
                  className="bellIcon"
                  height={24}
                  width={24}
                />
              ) : (
                <Image
                  src={images.notificationOffIcon}
                  alt="bell"
                  className="bellIcon"
                  height={24}
                  width={24}
                />
              )}
            </div>
            <div className={inPlay ? "in-play-time" : "starting-soon-games"}>
              {inPlay
                ? match?.start_time
                : moment
                    .utc(match?.start_time)
                    .local()
                    .format("DD MMM HH:mm")}
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
                  {match?.participants[0].name}
                </div>
                <div className="matchResult matchResultMobile match-vs-teams">
                  {match?.participants[0].score &&
                  match?.participants[1].score &&
                  match?.is_live ? (
                    <>
                      {match?.participants[0].score} :{" "}
                      {match?.participants[1].score}
                    </>
                  ) : (
                    " vs "
                  )}
                </div>
                <div className="matchTeam matchTeamMobile">
                  {match?.participants[1].name}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="matchTeam matchTeamStyle">
                {match?.participants[0].name}
              </div>
              <div className="matchResult">
                {match?.is_live ? (
                  <>
                    {match?.participants[0].score} :{" "}
                    {match?.participants[1].score}
                  </>
                ) : (
                  " vs "
                )}
              </div>
              <div className="matchTeam">{match?.participants[1].name}</div>
            </>
          )}
        </div>
        {isTablet && (
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
        )}
        <div className="odds mobileBetsOdds">
          {match.selections.map((row, index) => {
            return (
              <div
                className={
                  activeSport === 10 && match.selections?.length > 2
                    ? "containerOfSelections"
                    : "containerOfSelectionsSports containerOfSelectionsOthers"
                }
                key={index}
              >
                <MatchOdds selection={row} key={index} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
