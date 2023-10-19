import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { MatchOdds } from "../../components/matches/MatchOdds";
import "../../components/matches/Matches.css";
import { setInPlay } from "../../store/actions";
import { HorizontalDots } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import { useClientTranslation } from "@/app/i18n/client";

const BasketballCard = ({
  match,
  moreMarkets,
  firstRow,
  selectionTypes,
  inPlay,
}) => {
  const { t } = useClientTranslation("common");
  let matchSelectionsData = match?.selections;
  const isMobile = useSelector((state) => state.setMobile);
  const dispatch = useDispatch();
  const router = useRouter();

  let homeTeam = match.participants.home_name,
    awayTeam = match.participants.away_name;

  const handleClickRow = () => {
    router.push(`/match/${match.event_id}`);
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
              <div className="ps-2">{t("time")}</div>
            </div>
          )}
          <div className=" matchesContainer col-9 col-lg-6">
            {isMobile ? (
              <>
                <div className="eventStyle">{t("event")}</div>
              </>
            ) : (
              <>
                <div className="matchTeam"></div>
                <div className="eventStyle">{t("event")}</div>
                <div className="matchTeam"></div>
              </>
            )}
          </div>
          <div
            className={
              moreMarkets ? "odds col-3 col-lg-3" : "odds col-3 col-lg-4"
            }
          >
            {selectionTypes?.map((row) => {
              return (
                <div key={row?.selection_name} className={"selectionName"}>
                  {row.selection_name}
                </div>
              );
            })}
          </div>
          {moreMarkets && <div className="col-1">{t("more_markets")}</div>}
        </div>
      )}
      {/* Mobile match time */}
      {isMobile && (
        <div className="mb-match-time">
          <div className="matchCardIcon">
            <Image
              src={images.notificationOffIcon}
              alt=""
              className="bellIcon"
            />
          </div>
          <div className="liveGames">{match?.current_time}</div>
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
              <div>{match?.current_time}</div>
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
                {match?.is_live ? (
                  <>
                    {match?.participants?.home_score} :{" "}
                    {match?.participants?.away_score}
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
                {match?.is_live ? (
                  <>
                    {match?.participants?.home_score} :{" "}
                    {match?.participants?.away_score}
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
            return (
              <div className="containerOfSelectionsSports" key={index}>
                <MatchOdds selection={row} />
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

export default BasketballCard;
