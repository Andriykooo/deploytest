import { useSelector } from "react-redux";
import { RacingItem } from "../racingWidget/RacingItem";
import Slider from "react-slick";
import { SampleNextArrow } from "@/icons/SampleNextArrow";
import { SamplePrevArrow } from "@/icons/SamplePrevArrow";
import { EmptyState } from "../emptyState/EmptyState";
import { useTranslations } from "@/hooks/useTranslations";
import { useRef, useEffect } from "react";
import { Carousel } from "../carousel/Carousel";
import classNames from "classnames";
import { phaseStatus } from "@/utils/constants";

const hiddenEventStatuses = new Set([
  phaseStatus.FINISHED,
  phaseStatus.IN_PLAY,
  phaseStatus.ABANDONED,
]);

export const RacingComponent = ({
  data,
  slug,
  resetSlider,
  setResetSlider,
}) => {
  const t = useTranslations("common");
  const updatedEvents = useSelector((state) => state.updatedEvents);

  const isTablet = useSelector((state) => state.isTablet);
  const isMobile = useSelector((state) => state.setMobile);

  const sliderRef = useRef(null);

  const events = data?.filter((event) => {
    const updatedEvent = updatedEvents?.[event.event_id]?.data;
    const hide = hiddenEventStatuses.has(
      updatedEvent?.current_status || event.event_status
    );

    return !hide;
  });

  useEffect(() => {
    if (resetSlider) {
      sliderRef.current?.slickGoTo(0);
      setResetSlider?.(false);
    }
  }, [resetSlider]);

  return events?.length > 0 ? (
    <div className="horse-matches">
      {!isMobile ? (
        <Slider
          ref={sliderRef}
          lazyLoad
          waitForAnimate
          arrows={!isTablet}
          slidesToScroll={events?.length > 3 ? 3 : events?.length}
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
                slidesToScroll: events?.length > 2 ? 2 : events?.length,
              },
            },
          ]}
        >
          {events?.map((event) => {
            return (
              <RacingItem event={event} slug={slug} key={event.event_id} />
            );
          })}
        </Slider>
      ) : (
        <Carousel
          arrowClassName="d-none"
          className={classNames({
            "w-100": events.length === 1,
          })}
          itemWidth={254}
          data={events?.map((event) => {
            return {
              id: event.events_id,
              render: (
                <RacingItem
                  event={event}
                  slug={slug}
                  key={event.event_id}
                  className={classNames({
                    "w-100": events.length === 1,
                  })}
                />
              ),
            };
          })}
        />
      )}
    </div>
  ) : (
    <EmptyState message={t("no_more_races_for_the_day")} />
  );
};
