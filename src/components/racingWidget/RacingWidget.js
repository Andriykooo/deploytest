import classNames from "classnames";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { horseRacingHomeMenu } from "../../utils/constants";
import { BannerMenu } from "../bannerMenu/BannerMenu";
import moment from 'moment';

import { RacingComponent } from "../racingComponent/RacingComponent";

export const RacingWidget = ({ data }) => {
  const [selectedFilter, setSelectedFilter] = useState(horseRacingHomeMenu[0]);

  const filteredData = data.events.filter((event) => {
    if (selectedFilter.name === "Today") {
      return moment(event.event_start_time).isSame(moment(), "day");
    }

    if (selectedFilter.name === "Tomorrow") {
      return moment(event.event_start_time).isSame(
        moment().add(1, "day"),
        "day"
      );
    }

    return selectedFilter.name === event.event_venue;
  });

  return data ? (
    <div className="home-live-matches container-swifty-special mainInPlay">
      <Accordion
        defaultActiveKey="0"
        alwaysOpen
        className="homeSportsMainContainer"
      >
        <Accordion.Item
          eventKey="0"
          style={{ borderWidth: "0", backgroundColor: "transparent" }}
        >
          {data?.header_banner && (
            <BannerMenu
              title={data?.details?.title}
              subtitle={data?.details?.subtitle}
              image={data?.header_banner}
              options={[
                ...horseRacingHomeMenu,
                ...data?.market_options?.map((option) => ({
                  name: option.market_name,
                })),
              ]}
              selected={selectedFilter}
              setSelected={setSelectedFilter}
            />
          )}
          <Accordion.Body
            className={classNames({ "my-3": data?.header_banner })}
          >
            <RacingComponent data={filteredData} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  ) : null;
};
