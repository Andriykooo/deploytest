"use client";

import classNames from "classnames";
import Image from "next/image";
import { Fragment } from "react";
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from "../../utils/icons";
import { LinkType } from "../LinkType/LinkType";
import { Button } from "../button/Button";
import { DynamicSelections } from "../dynamicSelections/DynamicSelections";
import { useSelector } from "react-redux";
import "./HomeSlider.css";

const HomeSlider = ({
  data,
  casinoSlider,
  subtitle,
  isLoading,
  className,
}) => {
  const isMobile = useSelector((state) => state.setMobile);
  const isTablet = useSelector((state) => state.isTablet);

  const settings = {
    dots: true,
    appendDots: (dots) => <ul>{dots}</ul>,
    infinite: true,
    speed: 500,
    variableWidth: true,
    slidesToScroll: 1,
    nextArrow: (
      <div>
        <SampleNextArrow />
      </div>
    ),
    prevArrow: (
      <div>
        <SamplePrevArrow />
      </div>
    ),
    arrows: isMobile ? false : !isLoading,
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
      <Slider {...settings}>
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
                  {carouselItem?.image && (
                    <Image
                      src={carouselItem?.image}
                      alt="slider-img"
                      height={152}
                      width={isTablet ? 300 : 380}
                    />
                  )}
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
                          eventId={carouselItem?.button?.event_id}
                          sportSlug={carouselItem?.button?.sport_slug}
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
