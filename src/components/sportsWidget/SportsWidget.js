import React from "react";
import { InPlay } from "./inPlay/InPlay";
import { StandartWidget } from "./standart/StandartWidget";
import { StartingSoon } from "./startingSoon/StartingSoon";

export const SportsWidget = ({ data }) => {
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
