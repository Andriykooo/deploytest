import { useState } from "react";
import { Accordion } from "react-bootstrap";
import Image from "next/image";
import { images } from "@/utils/imagesConstant";
import { SelectButtons } from "@/components/selectButtons/SelectsButtons";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { RacingComponent } from "@/components/racingComponent/RacingComponent";
import Link from "next/link";
import { EmptyState } from "@/components/emptyState/EmptyState";
import "./HorseRacing.css";
import { EventTime } from "@/components/EventTime/EventTime";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { useTranslations } from "next-intl";

export const HorseRacing = ({ sportContent, slug }) => {
  const t = useTranslations("common");

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

  const horseracingFilterOptions = [
    {
      label: t("next_races"),
      id: 1,
      value: "next",
    },
  ];
  const [selectedDay, setSelectedDay] = useState(horseracingMeetingOptions[0]);
  const [selectedMeet, setSelectedMeet] = useState(
    horseracingMeetingOptions[0]
  );
  const [selectedMarket, setSelectedMarket] = useState(
    horseracingFilterOptions[0]
  );

  const isTablet = useSelector((state) => state.isTablet);
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

  const regionsData = [];

  for (const region of sportContent?.regions) {
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

    if (
      filteredRegion.availabilities.length > 0 ||
      filteredRegion.meetings.length > 0
    ) {
      regionsData.push(filteredRegion);
    }
  }

  const marketOptions = sportContent.market_options.filter((market) => {
    return market.availabilities.includes(eventsDay);
  });

  const handleSelectDay = (selectedItem) => {
    setSelectedDay(selectedItem);
    setSelectedMarket(horseracingFilterOptions[0]);
  };

  return (
    <>
      <div className="horse-sport-competitions sport-competitions mx-3 mt-3">
        <div
          className={classNames("sport-competitions-head", {
            mobile: isTablet,
          })}
        >
          <label className="sport-name">
            {slug === "horseracing" ? t("horse_racing") : t("greyhound_racing")}
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
        </div>

        <div className="events-filters">
          <SelectButtons
            data={[
              ...horseracingFilterOptions,
              ...marketOptions?.map((market, index) => ({
                label: market.market_name,
                value: market.market_name,
                id: horseracingFilterOptions.length + 1 + index,
              })),
            ]}
            onSelect={setSelectedMarket}
            selectedId={selectedMarket.id}
            borders
          />
        </div>
      </div>

      {eventsData && (
        <>
          {eventsData.length > 0 ? (
            <RacingComponent data={eventsData} slug={slug} />
          ) : (
            <div className="horse-racing-empty-state mx-3">
              <EmptyState message={t("no_more_races_for_the_day")} />
            </div>
          )}
          <div className="m-3">
            <SelectButtons
              data={horseracingMeetingOptions}
              onSelect={setSelectedMeet}
              fullWidth={isTablet}
            />
          </div>
          {regionsData.map((region, index) => {
            return (
              <Accordion
                alwaysOpen
                className="accordion-wrapper mx-3"
                key={index}
              >
                <Accordion.Item
                  style={{ borderWidth: "0", backgroundColor: "#25292d" }}
                >
                  <Accordion.Header>{region.name}</Accordion.Header>
                  <Accordion.Body>
                    <div className="matchCardRowContainer">
                      {region.meetings.map((meeting, index) => (
                        <div
                          key={index}
                          className="matchCardRow2 matchCardRowWidth"
                        >
                          <Link
                            className="matchTeam matchTeam2"
                            href={`/racecard/${slug}/${meeting.name?.toLowerCase()}?id=${
                              meeting.events[0].event_id
                            }&filter=${selectedMeet.value.toLowerCase()}`}
                          >
                            {meeting.name}
                            <Image src={images.arrowIcon} alt="arrow" />
                          </Link>
                          <div className="meeting-events">
                            {meeting.events && meeting.events.length > 0 ? (
                              (meeting.events.length > 8
                                ? meeting.events.slice(-8)
                                : [...meeting.events].concat(
                                    new Array(8 - meeting.events.length).fill(
                                      ""
                                    )
                                  )
                              ).map((currentEvent, index) => {
                                return (
                                  <Link
                                    key={index}
                                    className={classNames("countriesItem", {
                                      "pe-none": !currentEvent?.event_id,
                                    })}
                                    href={
                                      currentEvent?.event_id
                                        ? `/racecard/${slug}/${meeting.name?.toLowerCase()}?id=${
                                            currentEvent.event_id
                                          }&filter=${selectedMeet.value.toLowerCase()}`
                                        : ""
                                    }
                                  >
                                    <EventTime data={currentEvent} />
                                  </Link>
                                );
                              })
                            ) : (
                              <div className="countriesItem">
                                {t("no_time_available")}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            );
          })}
        </>
      )}
    </>
  );
};
