"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { SocketContext } from "../../context/socket";
import { ToggleLabel } from "../../screens/Notifications/ToggleLabel";
import { setActiveSocketSubscribe, setSportData } from "../../store/actions";
import { tempArrayForMarkets } from "../../utils/constants";
import { groupObjectsBySameValue } from "../../utils/global";
import { ArrowDownIcon } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import {
  subscribeToMatch,
  unsubscribeToCompetition,
  unsubscribeToMarket,
  unsubscribeToSport,
} from "../../utils/socketSubscribers";
import { Button } from "../button/Button";
import { BetSelectedTypes } from "../custom/BetSelectedTypes";
import { TabsSelect } from "../tabsSelect/TabsSelect";
import { MatchOdds } from "./MatchOdds";

const MatchDetails = ({ data, id }) => {
  const [pushNotificationSettings, setPushNotificationSettings] = useState([
    { key: "key1", label: "Notification 1", status: false },
    { key: "key2", label: "Notification 2", status: true },
  ]);
  const markets =
    data?.markets.length >= 1 ? groupObjectsBySameValue(data?.markets) : [];

  const teams = {
    homeTeam: data?.match_name?.split(" v ")[0],
    awayTeam: data?.match_name?.split(" v ")[1],
  };

  const inPlay = useSelector((state) => state.inPlay);
  const isTablet = useSelector((state) => state.isTablet);
  const activeSocketSubscribe = useSelector(
    (state) => state.activeSocketSubscribe
  );
  const { subscriptionsSocket } = useContext(SocketContext);
  const sportsData = useSelector((state) => state.sportsData);
  let activeSport = useSelector((state) => state.activeSport);
  const selectedBets = useSelector((state) => state.selectedBets);
  const dispatch = useDispatch();
  const router = useRouter();
  const uuid = uuidv4();

  const handleClick = () => {
    router.back();
  };
  const selectionLength = [
    {
      key: "sports_update_promotions",
      status: false,
      text: " ",
      title: "Push Notifications",
    },
  ];

  useEffect(() => {
    setPushNotificationSettings(selectionLength);
    let payload = {
      type: "match_id",
      value: id,
    };
    dispatch(setSportData(payload));
    if (inPlay) {
      subscriptionsSocket.on("connect", () => {
        console.log("Connection established");
        if (activeSocketSubscribe === "SUBSCRIBE_SPORT") {
          unsubscribeToSport(subscriptionsSocket, activeSport.toString(), uuid);
        }
        subscribeToMatch(subscriptionsSocket, id.toString(), "");
        dispatch(setActiveSocketSubscribe("SUBSCRIBE_MATCH"));
      });
      if (subscriptionsSocket?.connected) {
        if (activeSocketSubscribe === "SUBSCRIBE_SPORT") {
          unsubscribeToSport(subscriptionsSocket, activeSport.toString(), uuid);
        } else if (
          activeSocketSubscribe === "SUBSCRIBE_COMPETITION" &&
          sportsData?.competition_id
        ) {
          unsubscribeToCompetition(
            subscriptionsSocket,
            sportsData?.competition_id.toString(),
            uuid
          );
        } else if (
          activeSocketSubscribe === "SUBSCRIBE_MARKET" &&
          sportsData?.market_id
        ) {
          unsubscribeToMarket(
            subscriptionsSocket,
            sportsData?.market_id.toString(),
            uuid
          );
        }
        subscribeToMatch(subscriptionsSocket, id.toString(), "");
        dispatch(setActiveSocketSubscribe("SUBSCRIBE_MATCH"));
      }
      subscriptionsSocket.on("disconnect", () => {
        console.log("Connection lost");
      });
      subscriptionsSocket.on("pong", () => {
        console.log("Pong received");
      });
      subscriptionsSocket.on("error", (error) => {
        console.log({ error });
      });
      subscriptionsSocket.on("new_selection", (message) => {
        let data = message;
        console.log(data);
      });
    }
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
  function handleToggle(item) {
    setPushNotificationSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.key === item.key
          ? { ...setting, status: !setting.status }
          : setting
      )
    );
  }
  return (
    <div className="mainArticle">
      <div className="col-12 sports-body sportsBackground">
        <div className={"markets-container"}>
          <>
            {isTablet ? (
              <div>
                <div className="container-match-details-paragraph">
                  <Button
                    className={"goBackButton goBackButtonDetails"}
                    onClick={handleClick}
                    text={
                      <>
                        <ArrowDownIcon />
                        <span className="ps-2">Go back</span>
                      </>
                    }
                  />
                  <div className="stream-container ">
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
                  </div>
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
                    <div className="teams-container-details">
                      <div className="team-for-matchdetails-mobile">
                        {teams?.homeTeam}
                      </div>
                      <div className="team-for-matchdetails-mobile">
                        {teams?.awayTeam}
                      </div>
                    </div>{" "}
                    <div className="matchResult match-result-soccer-vs">vs</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <>
                  <div
                    style={{
                      paddingBottom: "10px",
                      borderRadius: "6px",
                    }}
                  >
                    <div className="container-match-details-paragraph ">
                      <Button
                        className={"goBackButton goBackButtonDetails"}
                        onClick={handleClick}
                        text={
                          <>
                            <ArrowDownIcon />
                            <span className="ps-2">Go back</span>
                          </>
                        }
                      />
                      <div className="stream-container d-flex align-items-center">
                        <Image
                          src={images.playStreamIcon}
                          className="playstreamIcon"
                          alt="play stream icon"
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
                      </div>
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
                              Live Game
                            </div>
                            <div className="live-label" data-type="stats">
                              Live Stats
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="container-match-details-header ">
                        <div className="teams-for-matchdetails-container d-flex">
                          <div className="team-for-matchdetails-mobile match-details-teams-teams">
                            {teams?.homeTeam}
                          </div>
                          <div className="matchResult match-result-soccer-vs">
                            vs
                          </div>
                          <div className="team-for-matchdetails-mobile match-details-teams-teams">
                            {teams?.awayTeam}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              </>
            )}
            <div className="mb-3">
              <TabsSelect
                data={tempArrayForMarkets.map((market) => ({
                  label: market.market_name,
                  id: market.market_id,
                }))}
                placeholder="Select bet"
                variant="fullWidth"
              />
            </div>
            {markets.map((row, index) => {
              return (
                <Accordion
                  defaultActiveKey={["0"]}
                  key={index}
                  alwaysOpen
                  className="accordionContainer "
                >
                  <Accordion.Item eventKey={String(index)}>
                    <Accordion.Header className="accourdHeader">
                      {row?.label}
                    </Accordion.Header>
                    <Accordion.Body
                      className="match-event-accordion-body "
                      style={
                        isTablet
                          ? { gridTemplateColumns: "1fr 1fr" }
                          : row?.options.length <= 2
                          ? { gridTemplateColumns: "1fr 1fr" }
                          : { gridTemplateColumns: "1fr 1fr 1fr" }
                      }
                    >
                      {row?.options.map((option, index) => {
                        let selection_name;
                        selection_name = option?.selection_name
                          .replace(
                            new RegExp(`${teams?.homeTeam}`, "gi"),
                            "Home"
                          )
                          .replace(
                            new RegExp(`${teams?.awayTeam}`, "gi"),
                            "Away"
                          );
                        option.odd = option.odds_decimal;

                        return (
                          <div className="row headerOfGames" key={index}>
                            <div className="d-flex position-relative match-event-selection">
                              {selection_name}
                            </div>

                            <div
                              className={
                                "d-flex position-relative match-event-odds"
                              }
                            >
                              <MatchOdds selection={option} />
                            </div>
                          </div>
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              );
            })}
          </>
          <BetSelectedTypes />
        </div>
      </div>
    </div>
  );
};
export default MatchDetails;
