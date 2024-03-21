import React, { useEffect } from "react";
import { InPlay } from "./inPlay/InPlay";
import { StandartWidget } from "./standart/StandartWidget";
import { StartingSoon } from "./startingSoon/StartingSoon";
import { gamingSocket } from "@/context/socket";
import { v4 as uuidv4 } from "uuid";
import { widgetDisplayRestriction } from "@/hoc/widgetDisplayRestriction";

const SportsWidgetComponent = ({ data }) => {
  useEffect(() => {
    if (data?.sports) {
      data.sports.forEach((sport) => {
        if (sport.competitions.length) {
          gamingSocket.emit("subscribe_market", {
            value: sport.market_options[0].market_id,
          });
        }
      });

      gamingSocket.on("connection", () => {
        data.sports.forEach((sport) => {
          if (sport.competitions.length) {
            gamingSocket.emit("subscribe_market", {
              value: sport.market_options[0].market_id,
            });
          }
        });
      });
    }

    return () => {
      if (data?.sports) {
        data.sports.forEach((sport) => {
          if (sport.competitions.length) {
            gamingSocket.emit("unsubscribe_market", {
              value: sport.market_options[0].market_id,
              action_id: uuidv4(),
            });
          }
        });
      }
    };
  }, []);

  return (
    <>
      {data.widget_type === "sport_widget_starting_soon" && (
        <StartingSoon data={data} />
      )}
      {data.widget_type === "sport_widget_in_play" && <InPlay data={data} />}
      {data.widget_type === "sport_widget_standard" && (
        <StandartWidget data={data} />
      )}
    </>
  );
};

export const SportsWidget = widgetDisplayRestriction(SportsWidgetComponent);
