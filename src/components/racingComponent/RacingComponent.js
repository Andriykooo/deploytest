import { useSelector } from "react-redux";
import { Carousel } from "../carousel/Carousel";
import { RacingItem } from "../racingWidget/RacingItem";
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from "@/utils/icons";
import { EmptyState } from "../emptyState/EmptyState";
import { useClientTranslation } from "@/app/i18n/client";

export const RacingComponent = ({ data, slug }) => {
  const { t } = useClientTranslation("common");
  const resultedEvents = useSelector((state) => state.resultedEvents);
  const isMobile = useSelector((state) => state.setMobile);

  const events = data.filter((event) => {
    return !resultedEvents.includes(event.event_id);
  });

  const slidesToShow = events?.length > 3 ? 3 : events?.length;

  return events?.length > 0 ? (
    <div className="horse-matches">
      {isMobile ? (
        <Carousel
          arrowClassName="small-arrows"
          data={events?.map((event, index) => {
            return {
              id: event.event_id,
              render: <RacingItem data={event} slug={slug} key={index} />,
            };
          })}
        />
      ) : (
        <Slider
          slidesToScroll={3}
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
          {events?.map((event, index) => {
            return <RacingItem data={event} slug={slug} key={index} />;
          })}
        </Slider>
      )}
    </div>
  ) : (
    <EmptyState message={t("no_more_races_for_the_day")} />
  );
};
