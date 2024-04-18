"use client";

import { GoBackButton } from "@/components/goBackButton/GoBackButton";
import { SelectButtons } from "@/components/selectButtons/SelectsButtons";
import {
  setRaceCard,
  setUpdatedEvents,
  updateSelections,
} from "@/store/actions";
import moment from "moment";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import SkeletonComponent from "@/components/SkeletonComponent/SkeletonComponent";
import { EventTime } from "@/components/EventTime/EventTime";
import { useTranslations } from "@/hooks/useTranslations";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { EventsFilter } from "@/components/EventsFilter/EventsFilter";
import { SportHeader } from "@/components/SportHeader/SportHeader";
import classNames from "classnames";
import { TabsSelect } from "@/components/tabsSelect/TabsSelect";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { useAxiosData } from "@/hooks/useAxiosData";
import { Button } from "@/components/button/Button";
import { racingRegionFilters } from "@/utils/constants";

import "../../../../../screens/Sports/Sports.css";

const regionFilters = Object.keys(racingRegionFilters).map(
  (key) => racingRegionFilters[key]
);

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

  const regionsDataFilters = regionFilters.map((region) => ({
    label: t(region),
    value: region,
    id: region,
  }));

  const data = useSelector((state) => state.raceCard);
  const isTablet = useSelector((state) => state.isTablet);
  const params = useParams();
  const router = useCustomRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // const [liveStreamIsActive, setLiveStreamIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [marketOptions, setMarketOptions] = useState([]);

  const filter = searchParams.get("filter") || "today";
  const regionFilter =
    searchParams.get("regionFilter") || regionsDataFilters[0]?.id;

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

  const checkByTimeAndRegion = (market, filter, regionFilter) => {
    const filterByDate = market?.availabilities?.includes(filter);

    const filterByRegion = [
      racingRegionFilters.ALL,
      ...(market?.country_code == "UK" || market?.country_code == "IE"
        ? [racingRegionFilters?.UK_IRELAND]
        : [racingRegionFilters?.INTERNATIONAL]),
    ]?.includes(regionFilter);

    return filterByDate && filterByRegion;
  };

  const filterByVenue = (venue) => {
    router.push(
      `/racecard/${
        params.slug
      }/${venue.label.toLowerCase()}?filter=${filter}&regionFilter=${regionFilter}`
    );
  };

  const filterByTime = (time) => {
    router.push(
      `/racecard/${params.slug}/${params.venue.toLowerCase()}?id=${
        time.event_id
      }&filter=${filter}&regionFilter=${regionFilter}`
    );
  };

  const filterByDay = (item) => {
    const selectedFilter = item.label.toLowerCase();

    const defaultMarket = raceCard.market_options.find((market) => {
      return checkByTimeAndRegion(market, selectedFilter, regionFilter);
    });

    if (defaultMarket) {
      router.push(
        `/racecard/${params.slug}/${defaultMarket.market_name}?filter=${selectedFilter}&regionFilter=${regionFilter}`
      );
    } else {
      router.push(
        `/racecard/${params.slug}/${params.slug}?filter=${selectedFilter}&regionFilter=${regionFilter}`
      );
    }
  };

  const filterByRegion = (item) => {
    const region = item?.id;

    const defaultMarket = raceCard.market_options.find((market) => {
      return checkByTimeAndRegion(market, filter, region);
    });

    if (defaultMarket) {
      router.push(
        `/racecard/${params.slug}/${defaultMarket?.market_name}?filter=${filter}&regionFilter=${region}`
      );
    } else {
      router.push(
        `/racecard/${params.slug}/${params.slug}?filter=${filter}&regionFilter=${region}`
      );
    }
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
        setMarketOptions(response.market_options);
        dispatch(setRaceCard({ ...data, [params.venue]: response }));

        const selections = {};

        response.events?.forEach((event) => {
          event.selections.forEach((selection) => {
            selections[selection.bet_id] = selection;
          });
        });

        dispatch(updateSelections(Object.values(selections)));
        dispatch(setUpdatedEvents({}));
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    },
    [pathname]
  );

  const day =
    (moment(event?.event_start_time)?.isSame(moment(), "day") && "today") ||
    (moment(event?.event_start_time)?.isSame(moment().add(1, "days"), "day") &&
      "tomorrow");

  const formatedMarketOptions = useMemo(() => {
    const formatByFilter = marketOptions?.filter((market) => {
      return checkByTimeAndRegion(market, filter, regionFilter);
    });

    return formatByFilter;
  }, [marketOptions, regionFilter, filter]);

  return formatedMarketOptions ? (
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

            {raceCard && (
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
                  filterByDay(item);
                }}
                selectedItem={horseracingMeetingOptions.find(
                  (item) => item.label.toLowerCase() === filter
                )}
              />
            )}
          </>
        }
      >
        {formatedMarketOptions && !isTablet ? (
          <div className="d-flex align-items-center justify-content-start market-filter-container">
            <Button
              text={
                <Dropdown
                  data={regionsDataFilters}
                  onSelect={(item) => {
                    filterByRegion(item);
                  }}
                  selectedItem={regionsDataFilters.find(
                    (item) => item.id === regionFilter
                  )}
                />
              }
              className="btnGray region-select-filter me-2"
            />

            <div className="flex-1 overflow-hidden">
              <EventsFilter
                options={formatedMarketOptions?.map((market) => {
                  return {
                    label: market.market_name,
                    id: market.market_name.toLowerCase(),
                  };
                })}
                onSelect={filterByVenue}
                selectedId={decodeURI(params?.venue).toLowerCase()}
                noSpace
              />
            </div>
          </div>
        ) : (
          <>
            <div className="navigation-selects">
              <TabsSelect
                data={regionsDataFilters}
                selectedItemId={regionFilter}
                placeholder={regionsDataFilters?.[0]?.label}
                onChange={filterByRegion}
              />
              <TabsSelect
                data={formatedMarketOptions?.map((market) => {
                  return {
                    label: market.market_name,
                    id: market.market_name.toLowerCase(),
                  };
                })}
                selectedItemId={decodeURI(params.venue).toLowerCase()}
                placeholder={formatedMarketOptions?.[0]?.market_name}
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
              <TabsSelect
                data={horseracingMeetingOptions}
                selectedItemId={
                  horseracingMeetingOptions.find(
                    (item) => item.label.toLowerCase() === filter
                  )?.id
                }
                placeholder={horseracingMeetingOptions?.[0]?.label}
                onChange={filterByDay}
              />
            </div>
            <div className="dashedDiv smaller" />
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

      {!isLoading && raceCard ? (
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
