"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { images } from "../../utils/imagesConstant";
import { TabsSelect } from "../tabsSelect/TabsSelect";
import { MatchOdds } from "./MatchOdds";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { EmptyState } from "../emptyState/EmptyState";
import { GoBackButton } from "../goBackButton/GoBackButton";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { Accordion } from "../Accordion/Accordions";
import { gamingSocket } from "@/context/socket";
import { SuccesToast, alertToast } from "@/utils/alert";
import "../../screens/Sports/Sports.css";
import "./Matches.css";

const MatchDetails = ({ data, id }) => {
  const t = useTranslations();
  const [showNotification, setShowNotification] = useState("");
  const [pushNotificationSettings, setPushNotificationSettings] = useState([
    { key: "key1", label: `${t("common.notification")} 1`, status: false },
    { key: "key2", label: `${t("common.notification")} 2`, status: true },
  ]);

  const markets = data?.markets?.length >= 1 ? data?.markets : [];

  const [filteredMarkets, setFilteredMarkets] = useState(markets);

  const marketList = data?.market_list.length ? data?.market_list : [];

  const teams = {
    homeTeam: data.participants[0],
    awayTeam: data.participants[1],
  };
  const matchName = `${teams.homeTeam.name} v ${teams.awayTeam.name}`;
  const isTablet = useSelector((state) => state.isTablet);
  const selectedBets = useSelector((state) => state.selectedBets);

  useEffect(() => {
    gamingSocket.emit("subscribe_match", {
      value: id,
    });

    return () => {
      gamingSocket.emit("unsubscribe_match", {
        value: id,
        action_id: uuidv4(),
      });
    };
  }, []);

  useEffect(() => {
    if (markets && markets.length > 0) {
      for (let i = 0; i < selectedBets.length; i++) {
        let selectedBetId = selectedBets[i]?.bet_id;
        let selectedElement = document.querySelector(
          `#match-events-odd-${selectedBetId}`
        );
        if (selectedElement) {
          selectedElement.classList.add("selected");
        }
      }
    }
  }, [selectedBets, markets]);

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

  return (
    <div className="mainArticle matchDetails">
      <div className="col-12 sports-body">
        <div className={"markets-container"}>
          <div className={classNames({ "markets-head": isTablet })}>
            {isTablet ? (
              <div>
                <div className="container-match-details-paragraph">
                  <GoBackButton />
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
                <div style={{ position: "relative" }}>
                  {pushNotificationSettings[0]?.status && (
                    <Image
                      src={images.footbalPitch}
                      className="pitchField"
                      alt="Snow"
                    />
                  )}
                </div>
                <div className="container-match-details-header teams-match-details--header">
                  <div className="teams-for-matchdetails-container teams-match-details-container">
                    {data.is_live && (
                      <div
                        className="matchCard-icon-inPlay-container"
                        onClick={handleNotification}
                      >
                        <div className="matchCard-icon">
                          {showNotification ? (
                            <Image
                              src={images.notificationOnIcon}
                              alt={t("sports.bell")}
                              className="bellIcon"
                              height={24}
                              width={24}
                            />
                          ) : (
                            <Image
                              src={images.notificationOffIcon}
                              alt={t("sports.bell")}
                              className="bellIcon"
                              height={24}
                              width={24}
                            />
                          )}
                        </div>

                        <div className="inPlay-time">{data?.current_time}</div>
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
                        {data?.is_live ? teams?.homeTeam?.score : "-"}
                      </div>
                      <div className="team-result-soccer">
                        {data?.is_live ? teams?.awayTeam?.score : "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  paddingBottom: "10px",
                  borderRadius: "6px",
                }}
              >
                <div className="container-match-details-paragraph ">
                  <GoBackButton />
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
                        {data?.is_live
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
            <div className="mb-3">
              <TabsSelect
                data={[
                  { label: "All", id: 0 },
                  ...marketList.map((currentMarketList) => ({
                    id: currentMarketList.list_id,
                    label: currentMarketList.list_title,
                    marketIds: currentMarketList.markets.map(
                      (currentMarket) => currentMarket.id
                    ),
                  })),
                ]}
                placeholder={t("common.select_bet")}
                variant={marketList?.length > 7 ? "scrollable" : "fullWidth"}
                onChange={async (selectedMarketList) => {
                  if (selectedMarketList.id === 0) {
                    setFilteredMarkets(markets);
                  } else {
                    const { markets: responseMarkets } = await apiServices.get(
                      apiUrl.MATCH_DETAILS,
                      {
                        eventId: id,
                        listId: selectedMarketList.id,
                      }
                    );

                    setFilteredMarkets(responseMarkets);
                  }
                }}
              />
            </div>
          </div>
          <div
            className={classNames("markets-container-content", {
              "markets-container-content-empty": !filteredMarkets.length,
            })}
          >
            <>
              {filteredMarkets.length > 0 ? (
                filteredMarkets.map((row, index) => {
                  return (
                    <Accordion
                      title={row?.market_name}
                      key={`${row?.market_id}-${row?.market_name}`}
                      className="accordionContainer  bordered-match"
                      active={index === 0}
                    >
                      <div
                        className="d-grid"
                        style={{
                          gridTemplateColumns: `repeat(${
                            row?.selections?.length > 3
                              ? 3
                              : row?.selections?.length
                          }, 1fr)`,
                        }}
                      >
                        {row?.selections.map((selection) => {
                          return (
                            <div
                              className="headerOfGames"
                              key={selection?.bet_id}
                            >
                              <div className="d-flex position-relative match-event-selection">
                                {selection.name}
                              </div>

                              <div
                                className={
                                  "d-flex position-relative match-event-odds"
                                }
                              >
                                <MatchOdds selection={selection} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Accordion>
                  );
                })
              ) : (
                <EmptyState message={t("match.no_more_events")} />
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MatchDetails;
