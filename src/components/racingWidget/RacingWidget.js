import { useEffect, useState } from "react";
import { BannerMenu } from "../bannerMenu/BannerMenu";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { RacingComponent } from "../racingComponent/RacingComponent";
import { gamingSocket } from "@/context/socket";
import { useTranslations } from "next-intl";
import { widgetDisplayRestriction } from "@/hoc/widgetDisplayRestriction";
import classNames from "classnames";
import { useSelector } from "react-redux";

const horseRacingHomeMenu = [
  {
    id: 1,
    name: "today",
  },
  {
    id: 2,
    name: "tomorrow",
  },
];

const RacingWidgetComponent = ({ data }) => {
  const t = useTranslations("common");
  const isTablet = useSelector((state) => state.isTablet);

  const [selectedFilter, setSelectedFilter] = useState({
    name: t(horseRacingHomeMenu[0].name),
    slug: horseRacingHomeMenu[0].name,
  });
  const [resetSlider, setResetSlider] = useState(false);

  const filteredData = data.events.filter((event) => {
    if (selectedFilter.slug === "today") {
      return moment(event.event_start_time).isSame(moment(), "day");
    }

    if (selectedFilter.slug === "tomorrow") {
      return moment(event.event_start_time).isSame(
        moment().add(1, "day"),
        "day"
      );
    }

    return selectedFilter.slug === event.event_venue;
  });

  useEffect(() => {
    gamingSocket.on("connection", () => {
      gamingSocket.emit("subscribe_sport", {
        value: data.details.sport,
      });
    });

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

  const availableOptions = horseRacingHomeMenu.map((item) => ({
    name: t(item.name),
    slug: item.name,
  }));

  const marketOptions = data.market_options
    .map((option) => ({ name: option.market_name, slug: option.market_name }))
    .filter((marketItem) =>
      data.events.some((eventItem) => eventItem.event_venue === marketItem.slug)
    );

  const onSelect = (data) => {
    setResetSlider(true);
    setSelectedFilter(data);
  };

  const options = [...availableOptions, ...marketOptions];

  return data ? (
    <div className="home-live-matches container-swifty-special mainInPlay">
      <BannerMenu
        title={data?.details?.title}
        subtitle={data?.details?.subtitle}
        image={data?.header_banner}
        options={options}
        defaultItem={horseRacingHomeMenu[0]}
        selected={selectedFilter}
        setSelected={onSelect}
        className={classNames({ "mb-3": !isTablet })}
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
      <RacingComponent
        data={filteredData}
        slug={data?.details?.sport}
        resetSlider={resetSlider}
        setResetSlider={setResetSlider}
      />
    </div>
  ) : null;
};

export const RacingWidget = widgetDisplayRestriction(RacingWidgetComponent);
