"use client";

import React from "react";
import { useSelector } from "react-redux";
import { eventAtSlider } from "../../utils/constants";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import SkeletonComponent from "../SkeletonComponent/SkeletonComponent";
import "../../screens/Home/Home.css";

const HomeSkeletonComponent = () => {
  const isMobile = useSelector((state) => state.setMobile);
  const isTablet = useSelector((state) => state.isTablet);
  const betGroupLinks = new Array(5).fill("");

  let counter = 0;
  const maxCounter = betGroupLinks.length - 1;

  const carouselImageSize = isTablet ? 300 : 380;

  return (
    <div className="home-container-skeleton">
      <div className="mainArticle mainArticle-skeleton">
        <div className="home-slider-container home-slider-container-skeleton">
          {Array.from({
            length: isMobile
              ? 2
              : Math.floor(window.innerWidth / carouselImageSize + 12) + 1,
          }).map((_, index) => {
            return (
              <div key={index} className="slider-image-container">
                <Skeleton
                  width={carouselImageSize}
                  height={152}
                  sx={{ borderRadius: "10px" }}
                />
                <div className="slider-item-content">
                  <div className="slider-text">
                    <Skeleton className="my-2" width={140} height={20} />
                    <div className="sliderTextContent">
                      <Skeleton className="my-2" width={"100%"} height={20} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bet-group-container">
          {betGroupLinks.map((row, index) => {
            counter++;
            return (
              <React.Fragment key={index}>
                <div className="bet-group" key={row.name}>
                  <span className="bet-group-text">
                    <Skeleton
                      className="my-2"
                      animation="wave"
                      height={15}
                      width={100}
                    />
                  </span>
                </div>
                {counter <= maxCounter && (
                  <span className="borderOfLeftSideOFBetGroup"></span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="betting-in-home-slider">
          <Skeleton height={isTablet ? 240 : 140} className="m-3" />
          <div className="slider-title-in-homepage">
            <Skeleton className="my-2" height={20} width={150} />
          </div>
          <div className="slider-title-in-homepage-description slider-title-in-homepage-description-skeleton">
            <Skeleton height={20} width={240} className="my-2" />
          </div>
          <div className="container-of-bets-in-slider mx-3">
            {eventAtSlider &&
              eventAtSlider.length > 0 &&
              eventAtSlider.map((_, index) => {
                return (
                  <div className="container-of-bets-in-row mb-3" key={index}>
                    <span className="markets-slider-page"></span>
                    <span className="bets-of-markets-slider"></span>
                  </div>
                );
              })}
          </div>
        </div>
        <SkeletonComponent disableHeader className="mx-3" />
      </div>
    </div>
  );
};

export default HomeSkeletonComponent;
