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
        gamingSocket.emit("subscribe_sport", {
          value: sport.slug,
        });
      });
    }

    return () => {
      if (data?.sports) {
        data.sports.forEach((sport) => {
          gamingSocket.emit("unsubscribe_sport", {
            value: sport.slug,
            action_id: uuidv4(),
          });
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
