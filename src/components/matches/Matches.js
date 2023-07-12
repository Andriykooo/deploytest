import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { SocketContext } from "../../context/socket";
import { setActiveSocketSubscribe, setSportData } from "../../store/actions";
import {
  competitionSubscriber,
  marketSubscriber,
  sportSubscriber,
} from "../../utils/global";
import {
  subscribeToCompetition,
  subscribeToMarket,
  subscribeToSport,
  unsubscribeToCompetition,
  unsubscribeToMarket,
  unsubscribeToMatch,
  unsubscribeToSport,
} from "../../utils/socketSubscribers";
import { MatchAccordion } from "../custom/MatchAccordion";
import "./Matches.css";

const Matches = ({ competitionsData, marketOptions, marketId, inPlay, type,  }) => {
  let competitions = competitionsData;

  const sportsData = useSelector((state) => state.sportsData);
  let activeSport = useSelector((state) => state.activeSport);
  const selectedBets = useSelector((state) => state.selectedBets);
  const activeSocketSubscribe = useSelector(
    (state) => state.activeSocketSubscribe
  );
  const { subscriptionsSocket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const uuid = uuidv4();

  // SUBSCRIBE SPORT
  useEffect(() => {
    let payload = {
      type: "sport_id",
      value: activeSport,
    };
    dispatch(setSportData(payload));
    if (inPlay) {
      subscriptionsSocket.on("connect", () => {
        console.log("Connection established");
        if (
          activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
          sportsData?.match_id
        ) {
          unsubscribeToMatch(
            subscriptionsSocket,
            sportsData?.match_id.toString(),
            uuid
          );
        }
        subscribeToSport(subscriptionsSocket, activeSport.toString());
        dispatch(setActiveSocketSubscribe("SUBSCRIBE_SPORT"));
      });

      if (subscriptionsSocket?.connected) {
        if (
          activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
          sportsData?.match_id
        ) {
          unsubscribeToMatch(
            subscriptionsSocket,
            sportsData?.match_id.toString(),
            uuid
          );
        }
        subscribeToSport(subscriptionsSocket, activeSport.toString());
        dispatch(setActiveSocketSubscribe("SUBSCRIBE_SPORT"));
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
        const data = message;
        console.log(data);
        if (data && data.length > 0) {
          sportSubscriber(data);
        }
      });
      return () => {
        subscriptionsSocket.off("connect");
        subscriptionsSocket.off("disconnect");
        subscriptionsSocket.off("pong");
        subscriptionsSocket.off("error");
        subscriptionsSocket.off("new_selection");
      };
    }
  }, []);

  // SUBSCRIBE COMPETITION
  useEffect(() => {
    if (sportsData?.competition_id && inPlay) {
      subscriptionsSocket.on("connect", () => {
        console.log("Connection established");
        if (
          activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
          sportsData?.match_id
        ) {
          unsubscribeToMatch(
            subscriptionsSocket,
            sportsData?.match_id.toString(),
            uuid
          );
        } else if (activeSocketSubscribe === "SUBSCRIBE_SPORT") {
          unsubscribeToSport(subscriptionsSocket, activeSport.toString(), uuid);
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
        subscribeToCompetition(
          subscriptionsSocket,
          sportsData?.competition_id.toString(),
          sportsData?.market_id ? sportsData?.market_id.toString() : ""
        );
        dispatch(setActiveSocketSubscribe("SUBSCRIBE_COMPETITION"));
      });

      if (subscriptionsSocket?.connected) {
        if (
          activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
          sportsData?.match_id
        ) {
          unsubscribeToMatch(
            subscriptionsSocket,
            sportsData?.match_id.toString(),
            uuid
          );
        } else if (activeSocketSubscribe === "SUBSCRIBE_SPORT") {
          unsubscribeToSport(subscriptionsSocket, activeSport.toString(), uuid);
        }
        subscribeToCompetition(
          subscriptionsSocket,
          sportsData?.competition_id.toString(),
          sportsData?.market_id ? sportsData?.market_id.toString() : ""
        );
        dispatch(setActiveSocketSubscribe("SUBSCRIBE_COMPETITION"));
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
        const data = message;
        console.log(data);
        if (data && data.length > 0) {
          competitionSubscriber(data);
        }
      });
      return () => {
        subscriptionsSocket.off("connect");
        subscriptionsSocket.off("disconnect");
        subscriptionsSocket.off("pong");
        subscriptionsSocket.off("error");
        subscriptionsSocket.off("new_selection");
      };
    }
  }, [sportsData?.competition_id]);

  // SUBSCRIBE MARKET
  useEffect(() => {
    if (sportsData?.market_id === marketId && sportsData?.market_id && inPlay) {
      subscriptionsSocket.on("connect", () => {
        console.log("Connection established");
        if (
          activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
          sportsData?.match_id
        ) {
          unsubscribeToMatch(
            subscriptionsSocket,
            sportsData?.match_id.toString(),
            uuid
          );
        } else if (activeSocketSubscribe === "SUBSCRIBE_SPORT") {
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
        }
        subscribeToMarket(
          subscriptionsSocket,
          sportsData?.market_id.toString()
        );
        dispatch(setActiveSocketSubscribe("SUBSCRIBE_MARKET"));
      });

      if (subscriptionsSocket?.connected) {
        if (
          activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
          sportsData?.match_id
        ) {
          unsubscribeToMatch(
            subscriptionsSocket,
            sportsData?.match_id.toString(),
            uuid
          );
        } else if (activeSocketSubscribe === "SUBSCRIBE_SPORT") {
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
        }
        subscribeToMarket(
          subscriptionsSocket,
          sportsData?.market_id.toString()
        );
        dispatch(setActiveSocketSubscribe("SUBSCRIBE_MARKET"));
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
        const data = message;
        console.log(data);
        if (data && data.length > 0) {
          marketSubscriber(data);
        }
      });
      return () => {
        subscriptionsSocket.off("connect");
        subscriptionsSocket.off("disconnect");
        subscriptionsSocket.off("pong");
        subscriptionsSocket.off("error");
        subscriptionsSocket.off("new_selection");
      };
    }
  }, [sportsData?.market_id]);

  useEffect(() => {
    if (inPlay) {
      if (subscriptionsSocket?.connected) {
        if (
          activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
          sportsData?.match_id
        ) {
          unsubscribeToMatch(
            subscriptionsSocket,
            sportsData?.match_id.toString(),
            uuid
          );
        }
        subscribeToSport(subscriptionsSocket, activeSport.toString());
        dispatch(setActiveSocketSubscribe("SUBSCRIBE_SPORT"));
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
        const data = message;
        console.log(data);
        if (data && data.length > 0) {
          sportSubscriber(data, competitions);
        }
      });
      return () => {
        subscriptionsSocket.off("connect");
        subscriptionsSocket.off("disconnect");
        subscriptionsSocket.off("pong");
        subscriptionsSocket.off("error");
        subscriptionsSocket.off("new_selection");
      };
    }
  }, [activeSport]);

  useEffect(() => {
    if (competitions && competitions.length > 0) {
      for (let i = 0; i < selectedBets.length; i++) {
        let selectedBetId = selectedBets[i]?.bet_id;
        let selectedElement = document.querySelector(
          `#bet_odds_${selectedBetId}`
        );
        if (selectedElement) {
          selectedElement.classList.add("styleOfSelectedOdd");
        }
      }
    }
  }, [selectedBets, competitions]);
  return (
    <div
      className={
        activeSport !== 15
          ? "accordionContainer "
          : "accordion-container-without-markets"
      }
    >
      {competitionsData.map((row, index) => {
        return (
          <div key={index} className="mx-3">
            <MatchAccordion
              marketOptions={marketOptions}
              row={row}
              type={type}
              inPlay={inPlay}
              number={index + 1}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Matches;
