import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { SocketContext } from "../../context/socket";
import { ToggleLabel } from "../../pages/Notifications/ToggleLabel";
import {
  selectBet,
  setActiveSocketSubscribe,
  setSportData,
} from "../../store/actions";
import SkeletonComponent from "../../utils/SkeletonComponent";
import { alertToast } from "../../utils/alert";
import { apiUrl, tempArrayForMarkets, types } from "../../utils/constants";
import { groupObjectsBySameValue } from "../../utils/global";
import { images } from "../../utils/imagesConstant";
import {
  subscribeToMatch,
  unsubscribeToCompetition,
  unsubscribeToMarket,
  unsubscribeToSport,
} from "../../utils/socketSubscribers";
import { BaseLayout } from "../baseLayout/BaseLayout";
import { BetSlip } from "../betSlip/BetSlip";
import { Button } from "../button/Button";
import Footer from "../footer/Footer";
import { SidebarLayout } from "../sidebarLayout/SidebarLayout";
import { TabsSelect } from "../tabsSelect/TabsSelect";

const MatchDetails = () => {
  const [pushNotificationSettings, setPushNotificationSettings] = useState([
    { key: "key1", label: "Notification 1", status: false },
    { key: "key2", label: "Notification 2", status: true },
  ]);
  const [markets, setMarkets] = useState([]);
  const [matchName, setMatchName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [shortContent, setShortContent] = useState(false);
  const [teams, setTeams] = useState({ homeTeam: null, awayTeam: null });

  const inPlay = useSelector((state) => state.inPlay);
  const isMobile = useSelector((state) => state.setMobile);
  const activeSocketSubscribe = useSelector(
    (state) => state.activeSocketSubscribe
  );
  const { subscriptionsSocket } = useContext(SocketContext);

  const sportsData = useSelector((state) => state.sportsData);
  let activeSport = useSelector((state) => state.activeSport);
  const selectedBets = useSelector((state) => state.selectedBets);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const uuid = uuidv4();

  const handleClick = () => {
    navigate(-1);
  };
  const selectionLength = [
    {
      key: "sports_update_promotions",
      status: false,
      text: " ",
      title: "Push Notifications",
    },
  ];
  const getMatchData = () => {
    setIsLoading(true);
    axios
      .get(`${apiUrl.NEXT_PUBLIC_MATCH_DETAILS}/${id}`)
      .then((result) => {
        let markets = result?.data?.markets;
        setIsLoading(false);
        let grouped = groupObjectsBySameValue(markets);
        let currentMatch = result?.data?.match_name;
        let matchGameName =
          currentMatch.split(" v ")[0] + " vs " + currentMatch.split(" v ")[1];
        setMatchName(matchGameName);
        setTeams({
          homeTeam: currentMatch.split(" v ")[0],
          awayTeam: currentMatch.split(" v ")[1],
        });
        if (result?.data?.markets.lenth < 1) {
          setShortContent(true);
        } else setMarkets(grouped);
      })
      .catch((err) => {
        setIsLoading(false);
        alertToast({ message: err?.message });
      });
  };
  const handleSelectBet = (element) => {
    if (element) {
      if (element.classList.contains("selected")) {
        element.classList.remove("selected");
      } else {
        element.classList.add("selected");
      }
    }
  };
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
    getMatchData();
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
    <BaseLayout title="Match">
      <SidebarLayout left right>
        {isLoading ? (
          <SkeletonComponent />
        ) : (
          <>
            <div className="mainArticle">
              <div className="row w-100 sports-matches-container m-0">
                <div className="col-12 sports-body">
                  <div
                    className={
                      isLoading
                        ? "markets-container d-flex "
                        : "markets-container "
                    }
                  >
                    <>
                      {isMobile ? (
                        <div>
                          {" "}
                          <div className="container-match-details-paragraph">
                            <Button
                              className={"goBackButton goBackButtonDetails"}
                              onClick={handleClick}
                              text={
                                <>
                                  <img src={images.goBackArrow} alt="" />
                                  <span className="ps-2">Go back</span>
                                </>
                              }
                            />
                            <div className="stream-container ">
                              <img
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
                                  last={
                                    i + 1 === pushNotificationSettings?.length
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <div style={{ position: "relative" }}>
                            {pushNotificationSettings[0]?.status && (
                              <img
                                src={images.footbalPitch}
                                className="pitchField"
                                alt="Snow"
                                style={{ width: "100%" }}
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
                              <div className="matchResult matchResultMobile vs-for-matchdetails teams-container-details-vs">
                                vs
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <>
                            <div
                              style={{
                                background: "#373B40",
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
                                      <img src={images.goBackArrow} alt="" />
                                      <span className="ps-2">Go back</span>
                                    </>
                                  }
                                />
                                <div className="stream-container d-flex align-items-center">
                                  <img
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
                                      last={
                                        i + 1 ===
                                        pushNotificationSettings?.length
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                              <div style={{ position: "relative" }}>
                                {pushNotificationSettings[0]?.status && (
                                  <>
                                    <img
                                      src={images.footbalPitch}
                                      className="pitchField"
                                      alt="Snow"
                                      style={{ width: "100%" }}
                                    />

                                    <div className="pitch-top">
                                      <div
                                        className="live-label"
                                        data-type="game"
                                      >
                                        Live Game
                                      </div>
                                      <div
                                        className="live-label"
                                        data-type="stats"
                                      >
                                        Live Stats
                                      </div>
                                    </div>
                                  </>
                                )}
                                <div className="container-match-details-header ">
                                  <div className="teams-for-matchdetails-container d-flex">
                                    <div className="team-for-matchdetails-mobile match-details-teams-teams">
                                      {teams?.homeTeam?.toUpperCase()}
                                    </div>
                                    <div className="matchResult match-result-soccer-vs">
                                      {" "}
                                      vs
                                    </div>
                                    <div className="team-for-matchdetails-mobile match-details-teams-teams">
                                      {teams?.awayTeam?.toUpperCase()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        </>
                      )}
                      <TabsSelect
                        data={tempArrayForMarkets.map((market) => ({
                          label: market.market_name,
                          id: market.market_id,
                        }))}
                        placeholder="Select bet"
                      />
                      {markets.map((row, index) => {
                        return (
                          <Accordion
                            defaultActiveKey={[0, 1, 2]}
                            key={index}
                            alwaysOpen
                            className="accordionContainer "
                          >
                            <Accordion.Item
                              eventKey={index}
                              style={{
                                borderWidth: "0",
                                backgroundColor: "#25292d",
                              }}
                            >
                              <Accordion.Header className="accourdHeader">
                                {" "}
                                {row?.label}
                              </Accordion.Header>
                              <Accordion.Body
                                className="match-event-accordion-body "
                                style={
                                  isMobile
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

                                  return (
                                    <div
                                      className=" row headerOfGames"
                                      key={index}
                                    >
                                      <div className="d-flex position-relative match-event-selection">
                                        {selection_name}
                                      </div>

                                      <div
                                        className={
                                          "d-flex position-relative match-event-odds"
                                        }
                                        id={
                                          "match-events-odd-" + option?.bet_id
                                        }
                                        data-value={option?.odds_decimal}
                                        onClick={(e) => {
                                          handleSelectBet(e.target);
                                          option["market_name"] = row?.label;
                                          let payload = {
                                            selection: option,
                                            match_name: matchName,
                                            match_id: id,
                                            selection_id: option?.selection_id,
                                            bet_id: option?.bet_id,
                                          };
                                          dispatch(selectBet(payload));
                                        }}
                                      >
                                        {option?.odds_decimal?.toFixed(2)}
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
                    <div className="selected-types">
                      {types.map((row, index) => {
                        return (
                          <div className="match-selected-type" key={index}>
                            <span
                              className="match-selected-type-color"
                              style={{ background: row.color }}
                            ></span>
                            <span className="match-selected-type-name">
                              {row.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className={shortContent ? "pageFooter" : "pageFooter"}>
                {!isLoading && <Footer />}
              </div>
            </div>
            <BetSlip />
          </>
        )}
      </SidebarLayout>
    </BaseLayout>
  );
};
export default MatchDetails;
