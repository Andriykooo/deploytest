import { useEffect, useState, useCallback } from "react";
import { SelectButtons } from "@/components/selectButtons/SelectsButtons";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { RacingComponent } from "@/components/racingComponent/RacingComponent";
import { EmptyState } from "@/components/emptyState/EmptyState";
import { EventTime } from "@/components/EventTime/EventTime";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import { useTranslations } from "@/hooks/useTranslations";
import { CustomLink } from "@/components/Link/Link";
import { EventsFilter } from "@/components/EventsFilter/EventsFilter";
import { SportHeader } from "@/components/SportHeader/SportHeader";
import { useParams } from "next/navigation";
import { MobileSelect } from "@/components/mobileSelect/MobileSelect";
// import { Accordion } from "@/components/Accordion/Accordions";
// import { ArrowIcon } from "@/utils/icons";
import { gamingSocket } from "@/context/socket";
import { v4 as uuidv4 } from "uuid";
import { racingRegionFilters } from "@/utils/constants";
import { setSportFilters } from "@/store/actions";

import "./HorseRacing.css";

const regionFilters = Object.keys(racingRegionFilters).map(
  (key) => racingRegionFilters[key]
);

export const HorseRacing = () => {
  const t = useTranslations("common");
  const params = useParams();
  const dispatch = useDispatch();

  const horseracingMeetingOptions = [
    {
      label: t("today"),
      id: 1,
      value: "today",
    },
    {
      label: t("tomorrow"),
      id: 2,
      value: "tomorrow",
    },
  ];

  const regionsDataFilters = regionFilters.map((region) => ({
    label: t(region),
    value: region,
    id: region,
  }));

  const horseracingFilterOptions = [
    {
      label: t("next_races"),
      id: 1,
      value: "next",
    },
  ];

  const sportFilters = useSelector((state) => state.sportFilters);

  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [selectedDay, setSelectedDay] = useState(horseracingMeetingOptions[0]);
  const [selectedMeet, setSelectedMeet] = useState(
    horseracingMeetingOptions[0]
  );
  const [selectedMarket, setSelectedMarket] = useState(
    horseracingFilterOptions[0]
  );
  const { selectedRegionFilter } = sportFilters?.[params?.slug] || {
    selectedRegionFilter: null,
  };

  const [resetSlider, setResetSlider] = useState(false);

  const isTablet = useSelector((state) => state.isTablet);
  const data = useSelector((state) => state.sportContent);
  const sportContent = data?.[params?.slug];

  const eventsDay = selectedDay.value.toLowerCase();
  const regionsDay = selectedMeet.value.toLowerCase();

  const eventsData = sportContent?.events?.filter((event) => {
    return (
      event?.availabilities?.includes(eventsDay) &&
      (selectedMarket.id === 1
        ? true
        : event.event_venue === selectedMarket.value)
    );
  });

  const getRegions = useCallback(() => {
    const data = [];

    if (sportContent?.regions) {
      for (const region of sportContent.regions) {
        const filteredRegion = {
          name: region.name,
          availabilities: region.availabilities.filter(
            (availability) => availability === regionsDay
          ),
          meetings: [],
        };

        for (const meeting of region.meetings) {
          const filteredMeeting = {
            name: meeting.name,
            availabilities: meeting.availabilities.filter(
              (availability) => availability === regionsDay
            ),
            events: meeting.events.filter((event) =>
              event.availabilities.includes(regionsDay)
            ),
          };

          if (
            filteredMeeting.availabilities.length > 0 ||
            filteredMeeting.events.length > 0
          ) {
            filteredRegion.meetings.push(filteredMeeting);
          }
        }

        const regionSelected = [
          racingRegionFilters.ALL,
          ...(region.name == "UK & Ireland"
            ? [racingRegionFilters?.UK_IRELAND]
            : [racingRegionFilters?.INTERNATIONAL]),
        ]?.includes(selectedRegionFilter?.id);

        if (
          (filteredRegion.availabilities.length > 0 ||
            filteredRegion.meetings.length > 0) &&
          regionSelected
        ) {
          data.push(filteredRegion);
        }
      }
    }

    return data;
  }, [regionsDay, selectedRegionFilter, sportContent]);

  const regionsData = getRegions();

  const changeSportFilters = (newValues) => {
    const prevData = sportFilters?.[params?.slug];
    dispatch(setSportFilters({ [params.slug]: { ...prevData, ...newValues } }));
  };

  useEffect(() => {
    if (!sportFilters?.[params?.slug]) onRegionFilter(regionsDataFilters[0]);
  }, [params?.slug]);

  const marketOptions = sportContent?.market_options?.filter(
    (market) =>
      market.availabilities.includes(eventsDay) &&
      sportContent?.events?.some(
        (event) =>
          event.event_venue === market.market_name &&
          event.availabilities.includes(eventsDay)
      )
  );

  const handleSelectDay = (selectedItem) => {
    setSelectedDay(selectedItem);
    setSelectedMarket(horseracingFilterOptions[0]);
    setResetSlider(true);
  };

  useEffect(() => {
    gamingSocket.on("connection", () => {
      gamingSocket.emit("subscribe_sport", {
        value: params.slug,
      });
    });

    gamingSocket.emit("subscribe_sport", {
      value: params.slug,
    });

    return () => {
      gamingSocket.emit("unsubscribe_sport", {
        value: params.slug,
        action_id: uuidv4(),
      });
    };
  }, []);

  const onRegionFilter = (item) => {
    changeSportFilters({ selectedRegionFilter: item });
  };

  return (
    <>
      <div
        className={classNames("horceRacing-header", {
          "opened-select": isOpenSelect,
        })}
      >
        <SportHeader
          headerContent={
            <>
              <label className="sport-name">
                {params.slug === "horseracing"
                  ? t("horse_racing")
                  : t("greyhound_racing")}
              </label>
              {isTablet ? (
                <SelectButtons
                  data={horseracingMeetingOptions}
                  onSelect={handleSelectDay}
                  fullWidth
                />
              ) : (
                <Dropdown
                  data={horseracingMeetingOptions}
                  onSelect={handleSelectDay}
                />
              )}
            </>
          }
        >
          {marketOptions &&
            (isTablet ? (
              <MobileSelect
                data={[
                  ...horseracingFilterOptions,
                  ...marketOptions.map((market, index) => ({
                    label: market.market_name,
                    value: market.market_name,
                    id: horseracingFilterOptions.length + 1 + index,
                  })),
                ]}
                setIsOpenSelect={setIsOpenSelect}
                selectedItem={selectedMarket}
                placeholder={selectedMarket.label}
                onSelect={(item) => setSelectedMarket(item)}
              />
            ) : (
              <EventsFilter
                options={[
                  ...horseracingFilterOptions,
                  ...marketOptions.map((market, index) => ({
                    label: market.market_name,
                    value: market.market_name,
                    id: horseracingFilterOptions.length + 1 + index,
                  })),
                ]}
                selectedId={selectedMarket.id}
                onSelect={setSelectedMarket}
              />
            ))}
        </SportHeader>
      </div>

      {eventsData && (
        <>
          {eventsData.length > 0 ? (
            <RacingComponent
              data={eventsData}
              slug={params.slug}
              resetSlider={resetSlider}
              setResetSlider={setResetSlider}
            />
          ) : (
            <div className="horse-racing-empty-state mx-3 mb-3">
              <EmptyState message={t("no_more_races_for_the_day")} />
            </div>
          )}

          <div className="region-data-contianer">
            <SportHeader
              headerContent={
                <>
                  {isTablet ? (
                    <>
                      <MobileSelect
                        data={[
                          ...regionsDataFilters.map(({ label, value, id }) => ({
                            label,
                            value,
                            id,
                          })),
                        ]}
                        setIsOpenSelect={setIsOpenSelect}
                        selectedItem={selectedRegionFilter}
                        placeholder={selectedRegionFilter?.label}
                        onSelect={onRegionFilter}
                      />
                      <SelectButtons
                        data={horseracingMeetingOptions}
                        onSelect={setSelectedMeet}
                        fullWidth
                      />
                    </>
                  ) : (
                    <>
                      <EventsFilter
                        options={[
                          ...regionsDataFilters.map(({ label, value, id }) => ({
                            label,
                            value,
                            id,
                          })),
                        ]}
                        selectedId={selectedRegionFilter?.id}
                        onSelect={onRegionFilter}
                        noSpace
                      />

                      <Dropdown
                        data={horseracingMeetingOptions}
                        onSelect={setSelectedMeet}
                      />
                    </>
                  )}
                </>
              }
            >
              {regionsData?.length > 0 ? (
                regionsData.map((region, i) => {
                  return (
                    <div className="matchCardRowContainer" key={i}>
                      {region.meetings.map((meeting, index) => {
                        const isFullList = meeting.events.length > 8;
                        return (
                          <div
                            key={i + "-" + index}
                            className="matchCardRow2 matchCardRowWidth"
                          >
                            <CustomLink
                              className="matchTeam matchTeam2"
                              href={`/racecard/${
                                params.slug
                              }/${meeting.name?.toLowerCase()}?id=${
                                meeting.events[0].event_id
                              }&filter=${selectedMeet.value.toLowerCase()}$regionFilter=${
                                selectedRegionFilter?.id
                              }`}
                            >
                              {meeting.name}
                              {/* <ArrowIcon color="var(--global-color-table-text-odds-secondary" /> */}
                            </CustomLink>
                            <div
                              className="meeting-events"
                              style={{
                                gridTemplateColumns: `repeat(${
                                  isTablet && 4
                                }, 1fr)`,
                              }}
                            >
                              {meeting.events && meeting.events.length > 0 ? (
                                (isFullList
                                  ? meeting.events
                                  : [...meeting.events].concat(
                                      new Array(8 - meeting.events.length).fill(
                                        ""
                                      )
                                    )
                                ).map((currentEvent, index) => {
                                  return (
                                    <CustomLink
                                      key={index}
                                      className={classNames("countriesItem", {
                                        "pe-none": !currentEvent?.event_id,
                                      })}
                                      href={
                                        currentEvent?.event_id
                                          ? `/racecard/${
                                              params.slug
                                            }/${meeting.name?.toLowerCase()}?id=${
                                              currentEvent.event_id
                                            }&filter=${selectedMeet.value.toLowerCase()}&regionFilter=${
                                              selectedRegionFilter?.id
                                            }`
                                          : ""
                                      }
                                    >
                                      <EventTime data={currentEvent} />
                                    </CustomLink>
                                  );
                                })
                              ) : (
                                <div className="countriesItem">
                                  {t("no_time_available")}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              ) : (
                <div className="horse-racing-empty-state">
                  <EmptyState message={t("no_more_races_for_the_day")} />
                </div>
              )}
            </SportHeader>
          </div>
        </>
      )}
    </>
  );
};
