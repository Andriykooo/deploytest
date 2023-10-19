"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { SocketContext } from "../../context/socket";
import { images } from "../../utils/imagesConstant";
import { BetSelectedTypes } from "../custom/BetSelectedTypes";
import { TabsSelect } from "../tabsSelect/TabsSelect";
import { MatchOdds } from "./MatchOdds";
import { setUpdatedSelections } from "@/store/actions";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { EmptyState } from "../emptyState/EmptyState";
import { GoBackButton } from "../goBackButton/GoBackButton";
import classNames from "classnames";

const MatchDetails = ({ data, id }) => {
  const dispatch = useDispatch();
  const [pushNotificationSettings, setPushNotificationSettings] = useState([
    { key: "key1", label: "Notification 1", status: false },
    { key: "key2", label: "Notification 2", status: true },
  ]);

  const markets = data?.markets?.length >= 1 ? data?.markets : []; // groupObjectsBySameValue(data?.markets) : [];

  const [filteredMarkets, setFilteredMarkets] = useState(markets);

  const marketList = data?.market_list.length ? data?.market_list : [];

  const teams = {
    homeTeam: data?.event_name?.split(" v ")[0],
    awayTeam: data?.event_name?.split(" v ")[1],
  };

  const isTablet = useSelector((state) => state.isTablet);

  const { gamingSocket } = useContext(SocketContext);
  const selectedBets = useSelector((state) => state.selectedBets);
  const router = useRouter();

  useEffect(() => {
    gamingSocket.emit("subscribe_match", {
      value: id,
    });

    gamingSocket.on("selection_updated", (response) => {
      dispatch(setUpdatedSelections(response));
    });

    return () => {
      gamingSocket.off("selection_updated");

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
    <div className="mainArticle matchDetails">
      <div className="col-12 sports-body">
        <div className={"markets-container"}>
          <div>
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
                placeholder="Select bet"
                variant={marketList?.length > 7 ? "scrollable" : "fullWidth"}
                onChange={async (selectedMarketList) => {
                  if (selectedMarketList.id === 0) {
                    setFilteredMarkets(markets);
                  } else {
                    const url = new URL(apiUrl.MATCH_DETAILS);

                    url.searchParams.append("eventId", id);
                    url.searchParams.append("listId", selectedMarketList.id);

                    const { markets: responseMarkets } = await apiServices.get(
                      url
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
            {filteredMarkets.length > 0 ? (
              filteredMarkets.map((row, index) => {
                return (
                  <Accordion
                    defaultActiveKey={["0"]}
                    key={index}
                    alwaysOpen
                    className="accordionContainer "
                  >
                    <Accordion.Item eventKey={String(index)}>
                      <Accordion.Header className="accourdHeader">
                        {row?.market_name}
                      </Accordion.Header>
                      <Accordion.Body
                        className="match-event-accordion-body "
                        style={
                          isTablet
                            ? { gridTemplateColumns: "1fr 1fr" }
                            : row?.selections.length <= 2
                            ? { gridTemplateColumns: "1fr 1fr" }
                            : { gridTemplateColumns: "1fr 1fr 1fr" }
                        }
                      >
                        {row?.selections.map((option, index) => {
                          option.odd = option.odds_decimal;

                          return (
                            <div className="row headerOfGames" key={index}>
                              <div className="d-flex position-relative match-event-selection">
                                {option.name}
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
              })
            ) : (
              <EmptyState message="There are no more events!" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MatchDetails;
