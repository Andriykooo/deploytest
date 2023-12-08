import { useSelector } from "react-redux";
import { RacingItem } from "../racingWidget/RacingItem";
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from "@/utils/icons";
import { EmptyState } from "../emptyState/EmptyState";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export const RacingComponent = ({ data, slug }) => {
  const t = useTranslations("common");
  const resultedEvents = useSelector((state) => state.resultedEvents);
  const isTablet = useSelector((state) => state.isTablet);

  const sliderRef = useRef(null);

  const events = data?.filter((event) => {
    return !resultedEvents[event.event_id];
  });

  return events?.length > 0 ? (
    <div className="horse-matches">
      <Slider
        ref={sliderRef}
        lazyLoad="anticipated"
        waitForAnimate
        arrows={!isTablet}
        slidesToScroll={3}
        slidesToShow={events?.length > 3 ? 3 : events?.length}
        nextArrow={<SampleNextArrow />}
        prevArrow={<SamplePrevArrow />}
        accessibility={false}
        infinite={false}
        responsive={[
          {
            breakpoint: 950,
            settings: {
              slidesToShow: events?.length > 2 ? 2 : events?.length,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 650,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ]}
      >
        {events?.map((event) => {
          return <RacingItem data={event} slug={slug} key={event.event_id} />;
        })}
      </Slider>
    </div>
  ) : (
    <EmptyState message={t("no_more_races_for_the_day")} />
  );
};
