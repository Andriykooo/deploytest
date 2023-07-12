import classNames from "classnames";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import { horseRacingHomeMenu } from "../../utils/constants";
import { SampleNextArrow, SamplePrevArrow } from "../../utils/icons";
import { BannerMenu } from "../bannerMenu/BannerMenu";
import { Carousel } from "../carousel/Carousel";
import { EmptyState } from "../emptyState/EmptyState";
import { RacingItem } from "./RacingItem";

export const RacingWidget = ({ data, venue }) => {
  const isMobile = useSelector((state) => state.setMobile);
  const [selectedFilter, setSelectedFilter] = useState({ name: venue });

  const filteredData = data?.events?.filter((event) => {
    if (!selectedFilter?.name || selectedFilter?.name === "Next Races") {
      return true;
    }

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

  useEffect(() => {
    if (venue) {
      setSelectedFilter({ name: venue });
    }
  }, [venue]);

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
              title={data?.title}
              image={data?.header_banner}
              options={[
                ...horseRacingHomeMenu,
                ...data.filter_options.map((option) => ({ name: option })),
              ]}
              selected={selectedFilter}
              setSelected={setSelectedFilter}
            />
          )}
          <Accordion.Body
            className={classNames({ "my-3": data?.header_banner })}
          >
            {filteredData.length ? (
              <div className="horse-matches">
                {isMobile ? (
                  <Carousel arrowClassName="small-arrows">
                    {filteredData.map((event, index) => {
                      return <RacingItem data={event} key={index} />;
                    })}
                  </Carousel>
                ) : (
                  <Slider
                    slidesToScroll={3}
                    slidesToShow={3}
                    nextArrow={<SampleNextArrow />}
                    prevArrow={<SamplePrevArrow />}
                    infinite={false}
                    responsive={[
                      {
                        breakpoint: 800,
                        settings: {
                          slidesToShow: 2,
                          slidesToScroll: 2,
                        },
                      },
                      {
                        breakpoint: 560,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                        },
                      },
                    ]}
                  >
                    {filteredData.map((event, index) => {
                      return <RacingItem data={event} key={index} />;
                    })}
                  </Slider>
                )}
              </div>
            ) : (
              <EmptyState message="There are no more races for the day!" />
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  ) : null;
};
