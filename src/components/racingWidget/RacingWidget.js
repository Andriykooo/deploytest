import classNames from "classnames";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { horseRacingHomeMenu } from "../../utils/constants";
import { BannerMenu } from "../bannerMenu/BannerMenu";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { RacingComponent } from "../racingComponent/RacingComponent";
import { gamingSocket } from "@/context/socket";
import { useClientTranslation } from "@/app/i18n/client";

export const RacingWidget = ({ data }) => {
  const { t } = useClientTranslation("common");

  const [selectedFilter, setSelectedFilter] = useState(horseRacingHomeMenu[0]);

  const filteredData = data.events.filter((event) => {
    if (t(selectedFilter.name) === t("today")) {
      return moment(event.event_start_time).isSame(moment(), "day");
    }

    if (t(selectedFilter.name) === t("tomorrow")) {
      return moment(event.event_start_time).isSame(
        moment().add(1, "day"),
        "day"
      );
    }

    return t(selectedFilter.name) === event.event_venue;
  });

  useEffect(() => {
    gamingSocket.emit("subscribe_sport", {
      value: data.details.sport,
    });

    return () => {
      gamingSocket.emit("unsubscribe_sport", {
        value: data.details.sport,
        action_id: uuidv4(),
      });
    };
  }, []);

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
                ...horseRacingHomeMenu.map((item) => ({ name: t(item.name) })),
                ...data?.market_options?.map((option) => ({
                  name: option.market_name,
                })),
              ]}
              defaultItem={horseRacingHomeMenu[0]}
              selected={{ name: t(selectedFilter?.name) }}
              setSelected={setSelectedFilter}
              callToActinButton={{
                name: data?.details?.call_to_action,
                type: data?.details?.link_type,
                path: data?.details?.link,
                openType: data?.details?.open_type,
                modalData: {
                  slug: data?.details?.link,
                  name: data?.details?.call_to_actio,
                },
              }}
            />
          )}
          <Accordion.Body
            className={classNames({ "my-3": data?.header_banner })}
          >
            <RacingComponent data={filteredData} slug={data?.details?.sport} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  ) : null;
};
