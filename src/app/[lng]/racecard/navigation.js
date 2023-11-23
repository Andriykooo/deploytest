"use client";

import { GoBackButton } from "@/components/goBackButton/GoBackButton";
import { SelectButtons } from "@/components/selectButtons/SelectsButtons";
import { setRaceCard } from "@/store/actions";
import { images } from "@/utils/imagesConstant";
import moment from "moment";
import Image from "next/image";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import SkeletonComponent from "@/utils/SkeletonComponent";
import { EventTime } from "@/components/EventTime/EventTime";
import { useTranslations } from "next-intl";
import { useCustomRouter } from "@/hooks/useCustomRouter";

export const RacecardNavigation = ({ children }) => {
  const t = useTranslations("common");
  const dispatch = useDispatch();

  const horseracingMeetingOptions = [
    {
      label: t("today"),
      id: 1,
    },
    {
      label: t("tomorrow"),
      id: 2,
    },
  ];

  const raceCard = useSelector((state) => state.raceCard);
  const params = useParams();
  const router = useCustomRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [liveStreamIsActive, setLiveStreamIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const filter = searchParams.get("filter") || "today";
  const id = searchParams.get("id");

  let defaultEvent = null;

  const event =
    raceCard?.events?.find((event) => {
      const available = event.availabilities.includes(filter);

      if (available && !defaultEvent) {
        defaultEvent = event;
      }

      return event.event_id === id && available;
    }) || defaultEvent;

  const marketOptions = raceCard?.market_options?.filter((market) => {
    return market?.availabilities?.includes(filter);
  });

  const handleToggleLiveStream = () => {
    setLiveStreamIsActive(!liveStreamIsActive);
  };

  const filterByVenue = (venue) => {
    router.push(
      `/racecard/${params.slug}/${venue.label.toLowerCase()}?filter=${filter}`
    );
  };

  const filterByTime = (time) => {
    router.push(
      `/racecard/${params.slug}/${params.venue.toLowerCase()}?id=${
        time.event_id
      }&filter=${filter}`
    );
  };

  useEffect(() => {
    setIsLoading(true);
    apiServices
      .get(apiUrl.GET_VENUE_EVENTS, {
        value: decodeURI(params.venue),
        sport_slug: params.slug,
        timezone: moment().utcOffset(),
      })
      .then((response) => {
        dispatch(setRaceCard(response));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pathname, filter]);

  const day =
    (moment(event?.event_start_time)?.isSame(moment(), "day") && "today") ||
    (moment(event?.event_start_time)?.isSame(moment().add(1, "days"), "day") &&
      "tomorrow");

  return raceCard ? (
    <div className="sports-body">
      <div className="sport-competitions">
        <div className="sport-competitions-head">
          <GoBackButton link="/sport/horseracing" />
          <div className="race-date">
            {t(day)} {moment(event?.event_start_time).format("D MMM, HH:mm")}
          </div>
          {/* todo: This can be hidden for now until we get the streams added. */}
          {/* <div className="stream-container d-flex align-items-center">
            <Image
              src={images.playStreamIcon}
              className="playstreamIcon"
              alt="play stream icon"
            />
            <p className="stream-line ">Stream</p>
            <ToggleLabel
              type="push"
              key=""
              value={liveStreamIsActive}
              onToggle={handleToggleLiveStream}
            />
          </div> */}

          <Dropdown
            data={horseracingMeetingOptions}
            onSelect={(item) => {
              const selectedFilter = item.label.toLowerCase();

              const defaultMarket = raceCard.market_options.find((market) =>
                market?.availabilities?.includes(selectedFilter)
              );

              router.push(
                `/racecard/${params.slug}/${defaultMarket.market_name}?filter=${selectedFilter}`
              );
            }}
            selectedItem={horseracingMeetingOptions.find(
              (item) => item.label.toLowerCase() === filter
            )}
          />
        </div>
        {marketOptions && (
          <div className="events-filters">
            <SelectButtons
              data={marketOptions?.map((market) => {
                return {
                  label: market.market_name,
                  id: market.market_name.toLowerCase(),
                };
              })}
              selectedId={decodeURI(params?.venue).toLowerCase()}
              onSelect={filterByVenue}
              borders
            />
          </div>
        )}

        {liveStreamIsActive && (
          <Image
            src={images.horseRacingLiveStream}
            alt="horse-racing"
            className="race-live-stream"
          />
        )}
      </div>

      {!isLoading ? (
        <>
          {raceCard && (
            <div className="sport-events-filter">
              <SelectButtons
                data={raceCard?.events
                  ?.filter((event) => event?.availabilities?.includes(filter))
                  .map((event) => {
                    return {
                      label: <EventTime data={event} />,
                      id: event?.event_start_time,
                      event_id: event?.event_id,
                    };
                  })}
                selectedId={event?.event_start_time}
                onSelect={filterByTime}
              />
            </div>
          )}
          {children}
        </>
      ) : (
        <SkeletonComponent />
      )}
    </div>
  ) : (
    <SkeletonComponent />
  );
};
