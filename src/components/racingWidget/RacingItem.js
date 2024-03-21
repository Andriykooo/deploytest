import moment from "moment";
import { ArrowIcon } from "../../utils/icons";
import { MatchOdds } from "../matches/MatchOdds";
import { useTranslations } from "next-intl";
import { Runner } from "../Runner/Runner";
import Image from "next/image";
import { CustomLink } from "../Link/Link";
import "../eventTable/EventTable.css";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { phaseStatus } from "@/utils/constants";
import { images } from "@/utils/imagesConstant";
import { getSelectionOdds } from "@/utils/getSelectionOdds";
import { useMemo, useState } from "react";

const RacingSelection = ({ selection, event }) => {
  const isSuspended = selection.trading_status === "suspended";

  const formatedSelection = useMemo(() => {
    return {
      ...selection,
      description: "Race Winner",
      match_name: `${moment(event.event_start_time).utc().format("HH:mm")} ${
        event.event_venue
      }`,
    };
  }, [event, selection]);

  return (
    <div className="odds-of-horse">
      <MatchOdds selection={formatedSelection} disable={isSuspended} ignoreSP />
    </div>
  );
};

const SilkImageContainer = ({ silkImage }) => {
  const [image, setHasImage] = useState(true);

  return (
    <div className="silk-image">
      {image ? (
        <img
          src={silkImage}
          alt="slik"
          onError={() => {
            setHasImage(false);
          }}
          height={20}
          width={20}
        />
      ) : (
        <Image src={images.unnamedFavorite} alt="slik" height={20} width={20} />
      )}
    </div>
  );
};

const RacingSelections = ({ selections, slug, event }) => {
  const sortedSelections = selections.sort((a, b) => {
    if (a.odds_decimal === "SP" && b.odds_decimal !== "SP") {
      return 1;
    } else if (a.odds_decimal !== "SP" && b.odds_decimal === "SP") {
      return -1;
    } else {
      const aPrice = getSelectionOdds(a).odds_decimal;
      const bPrice = getSelectionOdds(b).odds_decimal;

      return +aPrice - +bPrice;
    }
  });

  return (
    sortedSelections.length > 6
      ? sortedSelections?.slice(0, 6)
      : sortedSelections.concat(new Array(6 - sortedSelections.length).fill(""))
  )?.map((selection, index) => {
    return (
      <div className="events-row-container" key={selection?.bet_id || index}>
        <div className="horse-container">
          {selection ? (
            <>
              <SilkImageContainer silkImage={selection.silk_image} />
              <Runner
                data={selection}
                slug={slug}
                className="racing-item-runner"
              />
              <RacingSelection selection={selection} event={event} />
            </>
          ) : (
            <div className="racing-item-runner w-100" />
          )}
        </div>
      </div>
    );
  });
};

export const RacingItem = ({ event, slug, className }) => {
  const t = useTranslations();
  const updatedEvents = useSelector((state) => state.updatedEvents);
  const updatedEvent = updatedEvents?.[event.event_id]?.data;

  const day =
    moment().day() === moment(event.event_start_time).day()
      ? "today"
      : "tomorrow";
  const handicapRow = event?.handicap == "Y";

  const filteredSelections = event.selections
    .filter((selection) => {
      return (
        selection.status === "active" ||
        selection.status === "jocky_change" ||
        selection.status === "reserve_runner"
      );
    })
    .map((selection) => {
      if (
        updatedEvent?.current_status === phaseStatus.IN_PLAY ||
        event?.event_status === phaseStatus.IN_PLAY
      ) {
        return {
          ...selection,
          trading_status: "suspended",
        };
      }

      return selection;
    });

  return (
    <div className={classNames("slider-itemContainer", className)}>
      <div className="horse-links">
        <div className="racingLink">
          {/* todo: add live streaming link */}
          {/* <Image src={images.streamVideo} alt="#" className="racingHeaderImg" /> */}
          <span className="racingHeaderName">
            <span className="racingHeaderNameVenue">{t(`common.${day}`)}</span>{" "}
            {moment(event.event_start_time).format("HH:mm")} {event.event_venue}
          </span>
        </div>
        <div className="racingUnderTitle">
          {handicapRow ? "Handicap | " : ""}
          {event.event_description}
          {event.event_description && event.each_way && " | "}
          {event.each_way}
        </div>
      </div>
      <div className="events-contents-container horseEvents">
        <RacingSelections
          selections={filteredSelections}
          slug={slug}
          event={event}
        />
        <CustomLink
          href={`/racecard/${slug}/${event.event_venue.toLowerCase()}?id=${
            event?.event_id
          }&filter=${day}`}
        >
          <span className="more-container-in-horse">
            <span className="more-sidebar-in-events">
              {t("sports.view_racecard")}
            </span>
            <ArrowIcon
              color="--global-color-table-text-odds-primary"
              className="more-container-arrow"
            />
          </span>
        </CustomLink>
      </div>
    </div>
  );
};
