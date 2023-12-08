"use client";

import { Skeleton } from "@mui/material";
import classNames from "classnames";
import Image from "next/image";
import { Fragment } from "react";
import Slider from "react-slick";
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
    centerMode: false,
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
        {data?.map((carouselItem) => {
          return (
            <Fragment key={carouselItem.id}>
              <div
                className={
                  casinoSlider
                    ? "slider-image-container slider-image-container-casino"
                    : "slider-image-container"
                }
              >
                <>
                  <Image
                    src={carouselItem?.image}
                    alt="slider-img"
                    priority
                    height={160}
                    width={320}
                  />
                  <div className="slider-item-content">
                    <div className="slider-text">
                      {carouselItem?.title}
                      <p className="sliderTextContent">
                        {carouselItem?.subtitle}
                      </p>
                    </div>
                    <div className="betNowBtnsContainer">
                      {carouselItem?.promo_type === "dynamic" && (
                        <DynamicSelections
                          selections={carouselItem?.button?.selections}
                          eventId={carouselItem?.button.event_id}
                        />
                      )}
                      {carouselItem?.promo_type === "default" &&
                        carouselItem?.button?.name && (
                          <LinkType
                            path={carouselItem.button.link}
                            openType={carouselItem?.open_type}
                            type={carouselItem.link_type}
                            modalData={{
                              slug: carouselItem?.button?.link?.substring(1),
                              title: carouselItem?.title,
                            }}
                          >
                            <Button
                              className={"btnPrimary betNowButtonOFSlider"}
                              text={carouselItem?.button?.name}
                            />
                          </LinkType>
                        )}
                    </div>
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
