"use client";

import { GoBackButton } from "@/components/goBackButton/GoBackButton";
import { SelectButtons } from "@/components/selectButtons/SelectsButtons";
import { setRaceCard, setSelections, setUpdatedEvents } from "@/store/actions";
import { images } from "@/utils/imagesConstant";
import moment from "moment";
import Image from "next/image";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import SkeletonComponent from "@/components/SkeletonComponent/SkeletonComponent";
import { EventTime } from "@/components/EventTime/EventTime";
import { useTranslations } from "next-intl";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { EventsFilter } from "@/components/EventsFilter/EventsFilter";
import { SportHeader } from "@/components/SportHeader/SportHeader";
import classNames from "classnames";
import { TabsSelect } from "@/components/tabsSelect/TabsSelect";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { useAxiosData } from "@/hooks/useAxiosData";
import "../../../../../screens/Sports/Sports.css";

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

  const data = useSelector((state) => state.raceCard);
  const isTablet = useSelector((state) => state.isTablet);
  const params = useParams();
  const router = useCustomRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // const [liveStreamIsActive, setLiveStreamIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [marketOptions, setMarketOptions] = useState(null);

  const filter = searchParams.get("filter") || "today";
  const id = searchParams.get("id");
  const raceCard = data?.[params.venue];
  const getEvent = () => {
    let defaultEvent = null;

    return (
      raceCard?.events?.find((event) => {
        const available = event.availabilities.includes(filter);

        if (available && !defaultEvent) {
          defaultEvent = event;
        }

        return event.event_id === id && available;
      }) || defaultEvent
    );
  };

  const event = getEvent();

  // const handleToggleLiveStream = () => {
  //   setLiveStreamIsActive(!liveStreamIsActive);
  // };

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

  const fetchData = async () => {
    if (!raceCard) {
      setIsLoading(true);
    }

    return apiServices.get(apiUrl.GET_VENUE_EVENTS, {
      value: decodeURI(params.venue),
      sport_slug: params.slug,
      timezone: moment().utcOffset(),
    });
  };

  useAxiosData(
    fetchData,
    {
      onSuccess: (response) => {
        setMarketOptions(
          response.market_options?.filter((market) => {
            return market?.availabilities?.includes(filter);
          })
        );
        dispatch(setRaceCard({ ...data, [params.venue]: response }));
        dispatch(setSelections({}));
        dispatch(setUpdatedEvents({}));
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    },
    [pathname, filter]
  );

  const day =
    (moment(event?.event_start_time)?.isSame(moment(), "day") && "today") ||
    (moment(event?.event_start_time)?.isSame(moment().add(1, "days"), "day") &&
      "tomorrow");

  return marketOptions ? (
    <div className={classNames("sportNavigation-header", { "p-3": !isTablet })}>
      <SportHeader
        headerContent={
          <>
            <div className="navigationBack">
              <GoBackButton
                link={`/sport/${params.slug}`}
                fullIcon={isTablet}
              />
            </div>

            {!isTablet && raceCard && (
              <div className="race-date">
                {t(day)}{" "}
                {moment(event?.event_start_time).format("D MMM, HH:mm")}
              </div>
            )}
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
            {!isTablet && (
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
            )}
          </>
        }
      >
        {marketOptions && !isTablet ? (
          <EventsFilter
            options={marketOptions?.map((market) => {
              return {
                label: market.market_name,
                id: market.market_name.toLowerCase(),
              };
            })}
            onSelect={filterByVenue}
            selectedId={decodeURI(params?.venue).toLowerCase()}
          />
        ) : (
          <>
            <div className="navigation-selects">
              <TabsSelect
                data={marketOptions?.map((market) => {
                  return {
                    label: market.market_name,
                    id: market.market_name.toLowerCase(),
                  };
                })}
                selectedItemId={decodeURI(params.venue)}
                placeholder={marketOptions?.[0]?.market_name}
                onChange={filterByVenue}
              />
              <TabsSelect
                data={raceCard?.events
                  ?.filter((event) => event?.availabilities?.includes(filter))
                  .map((event) => {
                    return {
                      label: <EventTime data={event} />,
                      id: event?.event_start_time,
                      event_id: event?.event_id,
                    };
                  })}
                selectedItemId={event?.event_start_time}
                selectedItemLabel={event?.event_id}
                placeholder={moment(event?.event_start_time).format("HH:mm")}
                onChange={filterByTime}
              />
            </div>
            <div className="dashedLine">
              <Image src={images.dashedLine} alt="horse-racing" fill />
            </div>
          </>
        )}

        {/* {liveStreamIsActive && (
          <Image
            src={images.horseRacingLiveStream}
            alt="horse-racing"
            className="race-live-stream"
          />
        )} */}
      </SportHeader>

      {!isLoading ? (
        <>
          {raceCard && !isTablet && (
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
        <SkeletonComponent disableHeader />
      )}
    </div>
  ) : (
    <SkeletonComponent className="px-3" />
  );
};
