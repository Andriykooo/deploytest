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

  const sliderRef = useRef(null);

  const events = data?.filter((event) => {
    return !resultedEvents[event.event_id];
  });

  const slidesToShow = events?.length > 3 ? 3 : events?.length;

  return events?.length > 0 ? (
    <div className="horse-matches">
      <Slider
        ref={sliderRef}
        accessibility={false}
        slidesToScroll={3}
        lazyLoad
        speed={500}
        waitForAnimate
        slidesToShow={slidesToShow}
        nextArrow={<SampleNextArrow />}
        prevArrow={<SamplePrevArrow />}
        infinite={false}
        responsive={[
          {
            breakpoint: 950,
            settings: {
              slidesToShow: 2,
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
