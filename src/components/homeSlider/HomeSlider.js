"use client";

import { Skeleton } from "@mui/material";
import classNames from "classnames";
import Image from "next/image";
import { Fragment } from "react";
import Slider from "react-slick";
import "swiper/css";
import { SampleNextArrow, SamplePrevArrow } from "../../utils/icons";
import { LinkType } from "../LinkType/LinkType";
import { Button } from "../button/Button";
import { DynamicSelections } from "../dynamicSelections/DynamicSelections";
import "./HomeSlider.css";

const HomeSlider = ({
  data,
  casinoSlider,
  subtitle,
  type,
  isLoading,
  className,
}) => {
  const settings = {
    dots: true,
    appendDots: (dots) => <ul>{dots}</ul>,
    infinite: true,
    speed: 500,
    variableWidth: true,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    arrows: !isLoading,
    centerMode: true,
    responsive: [
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className={classNames({ recommendedSubtitle: subtitle }, className)}>
      <div className="d-flex justify-content-between">
        {isLoading && (
          <Skeleton
            sx={{
              fontSize: "1.5rem",
              bgcolor: "#212536",
              height: "100%",
              width: "95%",
              margin: "0 auto",
            }}
            animation="wave"
            variant="rectangular"
          />
        )}
      </div>
      <Slider {...settings} className={type ? "casinoTrendingSlider" : ""}>
        {data?.map((carouselItem, index) => {
          return (
            <Fragment key={carouselItem.id}>
              <div
                key={index}
                className={
                  casinoSlider
                    ? "slider-image-container slider-image-container-casino"
                    : "slider-image-container"
                }
              >
          
                  <>
                    <Image
                      src={carouselItem?.details?.image}
                      alt="slider-img"
                      priority
                      height={190}
                      width={280}
                    />
                    <div className="slider-text">
                      {carouselItem?.details?.title}
                      <p className="sliderTextContent">
                        {carouselItem?.details?.subtitle}
                      </p>
                    </div>
                    <div className="betNowBtnsContainer">
                      {carouselItem?.details.promo_type === "dynamic" && (
                        <DynamicSelections
                          selections={carouselItem.buttons}
                          eventId={carouselItem?.details.event_id}
                        />
                      )}
                      {carouselItem?.details.promo_type === "default" &&
                        carouselItem?.details?.call_to_action && (
                          <LinkType
                            path={carouselItem.details.link}
                            openType={carouselItem?.details?.open_type}
                            type={carouselItem.details.link_type}
                            modalData={{
                              slug: carouselItem?.details?.link?.substring(1),
                              title: carouselItem?.details?.title,
                            }}
                          >
                            <Button
                              className={"btnPrimary betNowButtonOFSlider"}
                              text={carouselItem?.details?.call_to_action}
                            />
                          </LinkType>
                        )}
                    </div>
                  </>
              </div>
            </Fragment>
          );
        })}
      </Slider>
    </div>
  );
};
export default HomeSlider;
