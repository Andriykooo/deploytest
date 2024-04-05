"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { images } from "../../utils/imagesConstant";
import { TabsSelect } from "../tabsSelect/TabsSelect";
import { MatchOdds } from "./MatchOdds";
import { EmptyState } from "../emptyState/EmptyState";
import { GoBackButton } from "../goBackButton/GoBackButton";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { Accordion } from "../Accordion/Accordions";
import { gamingSocket } from "@/context/socket";
import { SuccesToast, alertToast } from "@/utils/alert";
import { NotificationOff, NotificationOn } from "@/utils/icons";
import "../../screens/Sports/Sports.css";
import "./Matches.css";
import { Skeleton } from "../Skeleton/Skeleton";
import SkeletonComponent from "../SkeletonComponent/SkeletonComponent";
import {
  addEventData,
  setUpdatedEvents,
  updateSelections,
} from "@/store/actions";
import { useAxiosData } from "@/hooks/useAxiosData";
import { useParams } from "next/navigation";

const sortTypes = {
  homeDrawAway: ["home", "draw", "away"],
};

const MarketSelectionsLayout = ({ children, name, expanded, gridLength }) => {
  const isMobile = useSelector((state) => state.setMobile);

  return (
    <Accordion
      title={name}
      className="accordionContainer bordered-match"
      active={expanded}
    >
      <div
        className="d-grid"
        style={{
          gridTemplateColumns: isMobile ? "1fr" : `repeat(${gridLength}, 1fr)`,
        }}
      >
        {children}
      </div>
    </Accordion>
  );
};

const MarketSelections = ({ selections }) => {
  return selections.map((selection) => {
    return (
      <div className="headerOfGames" key={selection?.bet_id}>
        <div className="position-relative match-event-selection">
          {selection.name}
        </div>

        <div className={"d-flex position-relative match-event-odds"}>
          <MatchOdds selection={selection} />
        </div>
      </div>
    );
  });
};

const Markets = ({ markets }) => {
  const t = useTranslations();

  return (
    <div
      className={classNames("markets-container-content", {
        "markets-container-content-empty": !markets?.length,
      })}
    >
      {markets?.length > 0 ? (
        markets?.map((market, index) => {
          if (market.market_sort === "outcome-type") {
            const groupedSelectionByOutcomeType = market.selections.reduce(
              (accum, selection) => {
                if (!accum[selection.outcome_type]) {
                  accum[selection.outcome_type] = [];
                }

                accum[selection.outcome_type].push(selection);

                return accum;
              },
              {}
            );

            let selections = Object.values(groupedSelectionByOutcomeType);

            for (let key in sortTypes) {
              if (
                sortTypes[key].every(
                  (type) => groupedSelectionByOutcomeType[type]
                )
              ) {
                selections = [];

                sortTypes[key].forEach((type) => {
                  selections.push(
                    groupedSelectionByOutcomeType[type].sort((a, b) => {
                      return a.name.localeCompare(b.name);
                    })
                  );
                });
              }
            }

            return (
              <MarketSelectionsLayout
                key={index}
                name={market?.market_name}
                expanded={!!market.expanded}
                gridLength={selections.length}
              >
                {selections.map((selectionsType, i) => {
                  return (
                    <div key={index + "-" + i}>
                      <MarketSelections selections={selectionsType} />
                    </div>
                  );
                })}
              </MarketSelectionsLayout>
            );
          }

          return (
            <MarketSelectionsLayout
              key={index}
              name={market?.market_name}
              expanded={!!market.expanded}
              gridLength={
                market.selections?.length > 3 ? 3 : market.selections?.length
              }
            >
              <MarketSelections selections={market.selections} />
            </MarketSelectionsLayout>
          );
        })
      ) : (
        <EmptyState message={t("match.no_more_events")} />
      )}
    </div>
  );
};

const MatchDetails = () => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const params = useParams();

  const updatedEvents = useSelector((state) => state.updatedEvents);
  const eventsData = useSelector((state) => state.eventsData);
  const isTablet = useSelector((state) => state.isTablet);

  const updatesForMatch = updatedEvents?.[params.id];
  let match = eventsData?.[params.id];

  if (updatesForMatch) {
    match = {
      ...match,
      ...updatesForMatch.data,
    };
  }

  const [showNotification, setShowNotification] = useState("");
  const [pushNotificationSettings, setPushNotificationSettings] = useState([
    { key: "key1", label: `${t("common.notification")} 1`, status: false },
    { key: "key2", label: `${t("common.notification")} 2`, status: true },
  ]);
  const [selectedMarket, setSelectedMarket] = useState(
    match?.market_list?.[0]?.list_id
  );
  const [eventNotFound, setEventNotFound] = useState(false);

  const markets = match?.markets?.[selectedMarket];

  const marketList = match?.market_list?.length ? match?.market_list : [];
  const eventHeader = match
    ? `${match?.competition_name ? match?.competition_name + " | " : ""}  ${
        match.current_time || match.current_phase || ""
      }`
    : "";
  const teams = {
    homeTeam: match?.participants?.[0],
    awayTeam: match?.participants?.[1],
  };
  const matchName = match
    ? `${teams?.homeTeam?.name} v ${teams?.awayTeam?.name}`
    : "";

  // eslint-disable-next-line
  function handleToggle(item) {
    setPushNotificationSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.key === item.key
          ? { ...setting, status: !setting.status }
          : setting
      )
    );
  }

  const getData = (listId) => {
    const payload = {
      value: params.id,
      sport_slug: params.sport,
    };

    if (listId) {
      payload.list_id = listId;
      setSelectedMarket(listId);
    }

    setEventNotFound(false);

    gamingSocket.emit("event_content", payload, (response) => {
      if (!response.status) {
        alertToast({
          message: response.data.message,
        });
        setEventNotFound(true);

        return;
      }

      if (!listId) {
        setSelectedMarket(response.data.market_list[0].list_id);
      }

      const selections = {};

      response.data.markets.forEach((market) => {
        market.selections.forEach((selection) => {
          selections[selection.bet_id] = selection;
        });
      });

      dispatch(updateSelections(Object.values(selections)));
      dispatch(setUpdatedEvents({}));
      dispatch(
        addEventData({
          data: response.data,
          marketId: listId || response.data.market_list[0].list_id,
        })
      );
    });
  };

  const handleNotification = () => {
    setShowNotification(!showNotification);
    if (!showNotification) {
      SuccesToast({
        message: t("sports.notifications_for_match_are_on", { matchName }),
      });
    } else {
      alertToast({
        message: t("sports.notifications_for_match_are_off", { matchName }),
      });
    }
  };

  useAxiosData(() => getData(selectedMarket));

  useEffect(() => {
    gamingSocket.on("connection", () => {
      gamingSocket.emit("subscribe_match", {
        value: params.id,
      });
    });

    gamingSocket.emit("subscribe_match", {
      value: params.id,
    });

    return () => {
      gamingSocket.emit("unsubscribe_match", {
        value: params.id,
        action_id: uuidv4(),
      });
    };
  }, []);

  return (
    <div className="mainArticle matchDetails">
      <div className="col-12 sports-body">
        <div className={"markets-container"}>
          <div className={classNames({ "markets-head": isTablet })}>
            {isTablet ? (
              <div>
                <div className="container-match-details-paragraph">
                  <GoBackButton />
                  <span className="match-details-header">{eventHeader}</span>
                  {/* <div className="stream-container ">
                    <Image
                      src={images.playStreamIcon}
                      className="playstreamIcon"
                      alt="play stream icon"
                      height={19}
                      width={13}
                    />
                    <p className="stream-line ">Stream</p>
                    {pushNotificationSettings.map((item, i) => (
                      <ToggleLabel
                        notification={item}
                        key={i}
                        type="push"
                        value={item.status}
                        onToggle={() => handleToggle(item)}
                        isMobile={false}
                        last={i + 1 === pushNotificationSettings?.length}
                      />
                    ))}
                  </div> */}
                </div>
                {pushNotificationSettings[0]?.status && (
                  <div
                    style={{ position: "relative", height: 200, width: "100%" }}
                  >
                    <Image
                      src={images.footbalPitch}
                      className="pitchField"
                      alt="Snow"
                      fill
                    />
                  </div>
                )}
                <div className="container-match-details-header teams-match-details--header">
                  <div className="teams-for-matchdetails-container teams-match-details-container">
                    {match?.current_status == "in_play" && (
                      <div
                        className="matchCard-icon-inPlay-container"
                        onClick={handleNotification}
                      >
                        <div className="matchCard-icon">
                          {showNotification ? (
                            <NotificationOn className="bellIcon" />
                          ) : (
                            <NotificationOff className="bellIcon" />
                          )}
                        </div>

                        <div className="inPlay-time">{match?.current_time}</div>
                      </div>
                    )}
                    <div className="teams-container-details">
                      <div className="team-for-matchdetails-mobile">
                        {teams?.homeTeam?.name}
                      </div>
                      <div className="team-for-matchdetails-mobile">
                        {teams?.awayTeam?.name}
                      </div>
                    </div>
                    <div className="matchResult-soccer">
                      <div className="team-result-soccer">
                        {match?.current_status == "in_play"
                          ? teams?.homeTeam?.score
                          : "-"}
                      </div>
                      <div className="team-result-soccer">
                        {match?.current_status == "in_play"
                          ? teams?.awayTeam?.score
                          : "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-3">
                <div className="container-match-details-paragraph ">
                  <GoBackButton
                    arrowColor="var(--global-color-table-text-primary)"
                    className="matchDetails-goBack"
                  />
                  <span className="match-details-header">{eventHeader}</span>
                  {/* todo: This can be hidden for now until we get the streams added. */}
                  {/* <div className="stream-container d-flex align-items-center">
                          <Image
                            src={images.playStreamIcon}
                            className="playstreamIcon"
                            alt="play stream icon"
                          />
                          <p className="stream-line">Stream</p>
                          {pushNotificationSettings.map((item, i) => (
                            <ToggleLabel
                              notification={item}
                              key={i}
                              type="push"
                              value={item.status}
                              onToggle={() => handleToggle(item)}
                              isMobile={false}
                              last={i + 1 === pushNotificationSettings?.length}
                            />
                          ))}
                        </div> */}
                </div>
                <div className="position-relative">
                  {pushNotificationSettings[0]?.status && (
                    <div className="stream">
                      <Image
                        src={images.footbalPitch}
                        className="pitchField"
                        alt="Snow"
                        fill
                      />

                      <div className="pitch-top">
                        <div className="live-label" data-type="game">
                          {t("match.live_game")}
                        </div>
                        <div className="live-label" data-type="stats">
                          {t("match.live_stats")}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="container-match-details-header ">
                    <div className="teams-for-matchdetails-container d-flex">
                      <div className="team-for-matchdetails-mobile match-details-teams-teams">
                        {teams?.homeTeam?.name}
                      </div>
                      <div className="matchResult match-result-soccer-vs">
                        {match?.current_status == "in_play"
                          ? `${teams?.homeTeam?.score} : ${teams?.awayTeam?.score}`
                          : t("common.vs")}
                      </div>
                      <div className="team-for-matchdetails-mobile match-details-teams-teams">
                        {teams?.awayTeam?.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="tab-select-container">
            {!match ? (
              <Skeleton height={48} width={"100%"} />
            ) : (
              <TabsSelect
                data={[
                  ...marketList.map((currentMarketList) => ({
                    id: currentMarketList.list_id,
                    label: currentMarketList.list_title,
                    marketIds: currentMarketList.markets.map(
                      (currentMarket) => currentMarket.id
                    ),
                  })),
                ]}
                placeholder={t("common.select_market_type")}
                variant={"fullWidth"}
                onChange={(selectedMarketList) => {
                  getData(selectedMarketList.id.toString());
                }}
              />
            )}
          </div>
          {!markets && !eventNotFound ? (
            <SkeletonComponent disableHeader className={"mt-3"} />
          ) : (
            <Markets markets={markets} />
          )}
        </div>
      </div>
    </div>
  );
};
export default MatchDetails;
