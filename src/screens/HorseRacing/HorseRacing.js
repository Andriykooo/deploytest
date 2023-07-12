import moment from "moment";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import pointer from "../../assets/images/pointer.png";
import { RacingWidget } from "../../components/racingWidget/RacingWidget";
import { TabsSelect } from "../../components/tabsSelect/TabsSelect";
import "./HorseRacing.css";
import Image from "next/image";

const horseracingMeetingOptions = [
  {
    label: "Today",
    id: 1,
  },
  {
    label: "Quick Pick",
    id: 2,
  },
  {
    label: "Build a Racecard",
    id: 3,
  },
  {
    label: "Ante Post",
    id: 4,
  },
];

const horseracingFilterOptions = [
  {
    label: "Next Races",
    id: 1,
  },
  {
    label: "Daily Specials",
    id: 2,
  },
];

export const HorseRacing = ({ sportContent }) => {
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedMeet, setSelectedMeet] = useState(null);

  return (
    <>
      <div className="sport-competitions mx-3">
        <label className="sport-name">HORSE RACING</label>
      </div>

      {sportContent?.events && (
        <div className="my-3">
          <div className="mx-3">
            <TabsSelect
              placeholder="Select Horse Bet"
              variant="fullWidth"
              data={[
                ...horseracingFilterOptions,
                ...sportContent.market_options.map((option, index) => ({
                  label: option,
                  id: horseracingFilterOptions.length + 1 + index,
                })),
              ]}
              selectedItemId={selectedMarket?.id}
              onChange={setSelectedMarket}
            />
          </div>
          <Accordion
            alwaysOpen
            className="accordion-wrapper horseracing-accordion"
          >
            <Accordion.Item
              style={{ borderWidth: "0", backgroundColor: "#25292d" }}
            >
              <Accordion.Header className="mx-3">Next Races</Accordion.Header>
              <Accordion.Body>
                <RacingWidget
                  data={sportContent}
                  venue={selectedMarket?.label}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <div className="mx-3">
            <TabsSelect
              data={horseracingMeetingOptions}
              selectedItemId={selectedMeet?.id}
              onChange={setSelectedMeet}
              variant="fullWidth"
              placeholder="Select Bet"
            />
          </div>
          {sportContent.regions.map((region, index) => {
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
                    <div className="matchCardRowContainer matchCardRowContainer2">
                      {region.meetings.map((meeting, index) => (
                        <div
                          key={index}
                          className="matchCard row matchCardRow2 matchCardRowWidth"
                        >
                          <div className="matchTeam matchTeamStyle matchTeam2">
                            <div className="matchTeam2">{meeting.name}</div>
                          </div>
                          {meeting.events && meeting.events.length > 0 ? (
                            meeting.events.map((date, index) => (
                              <div
                                key={index}
                                className={
                                  date
                                    ? "countriesItem whiteTxt"
                                    : "countriesItem"
                                }
                              >
                                <Image
                                  alt="pointerImg"
                                  src={pointer}
                                  className="pointerImg"
                                />
                                {moment(date).format("HH:mm")}
                              </div>
                            ))
                          ) : (
                            <div className="countriesItem">
                              No time available
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            );
          })}
        </div>
      )}
    </>
  );
};
