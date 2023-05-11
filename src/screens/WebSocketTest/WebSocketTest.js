import { React, useState, useEffect } from "react";
import io from "socket.io-client";
import OddsChange from "./OddsChange";

const socket = io("https://socket-dev.swifty-api.com/", {
  reconnectionDelayMax: 15000,
});

const WebSocketTest = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [selections, setSelections] = useState([]);
  const [nrOfMessage, setNrOfMessage] = useState(0);

  const subscribeToSport = () => {
    console.log("Subscribing to sport");
    socket.emit("subscribe_sport", {
      value: "10",
    });
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connection established");
      setIsConnected(true);
      subscribeToSport();
    });

    socket.on("disconnect", () => {
      console.log("Connection lost");
      setIsConnected(false);
    });

    socket.on("pong", () => {
      console.log("Pong received");
      setLastPong(new Date().toISOString());
    });

    socket.on("error", (error) => {
      console.log({ error });
    });

    socket.on("new_selection", (message) => {
      const data = message.data;

      // Increment the number of messages received
      setNrOfMessage((nrOfMessage) => nrOfMessage + 1);

      // Check if the selection is already in the array based on the bet_id

      for (let i = 0; i < data.length; i++) {
        const index = selections.findIndex(
          (selection) => selection.bet_id === data[i].bet_id
        );
        // If the selection is already in the array, replace it with the new one
        if (index !== -1) {
          if (selections[index].odds_decimal !== data[i].odds_decimal) {
            data[i].odds_decimal_old = selections[index].odds_decimal;
          }
          selections[index] = data[i];
        } else {
          // If the selection is not in the array, add it
          selections.push(data[i]);
        }
      }
      // If array is over 1000, splice it to 1000
      const limit_rows = 1000;
      if (selections.length > limit_rows) {
        selections.splice(0, selections.length - limit_rows);
      }
      // Order by Sport ID, Competition ID, Match ID, Bet ID
      selections.sort((a, b) => {
        if (a.sport_id < b.sport_id) {
          return -1;
        }
        if (a.sport_id > b.sport_id) {
          return 1;
        }
        if (a.competition_id < b.competition_id) {
          return -1;
        }
        if (a.competition_id > b.competition_id) {
          return 1;
        }
        if (a.match_id < b.match_id) {
          return -1;
        }
        if (a.match_id > b.match_id) {
          return 1;
        }
        if (a.bet_id < b.bet_id) {
          return -1;
        }
        if (a.bet_id > b.bet_id) {
          return 1;
        }
        return 0;
      });
      setSelections([...selections]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
      socket.off("error");
      socket.off("new_selection");
    };
  }, []);

  return (
    <>
      <div style={{ color: "white" }}>
        <h1>WebSocket Test</h1>
        <p>Is connected: {isConnected ? "Yes" : "No"}</p>
        <p>Last pong: {lastPong}</p>
        <p>Number of messages: {nrOfMessage}</p>
        <p> Nr. of Selections : {selections.length}</p>

        <div>
          {selections.map((selection) => {
            let classNames = "";
            if (selection.trading_status === "Suspended") {
              classNames += " bg-warning";
            } else if (selection.trading_status === "Closed") {
              classNames += " bg-danger";
            }
            return (
              <>
                <div key={selection.bet_id}>
                  <div
                    style={{
                      width: "85px",
                      float: "left",
                      padding: "4px",
                      border: "1px solid white",
                      fontSize: "10px",
                    }}
                    className={classNames}
                  >
                    <span>{selection.bet_id} </span>
                    <br></br>
                    <OddsChange
                      new_odds={selection.odds_decimal}
                      old_odds={selection.odds_decimal_old}
                    />
                    <br></br>
                    <span>{selection.trading_status}</span>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default WebSocketTest;
