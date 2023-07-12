"use client";

import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSnapCarousel } from "react-snap-carousel";
import { SampleNextArrow, SamplePrevArrow } from "../../utils/icons";

export const Carousel = ({ children, arrowClassName, center }) => {
  const { scrollRef, prev, next, activePageIndex, pages, refresh } =
    useSnapCarousel();
  const [hidePrevArrow, setHidePrevArrow] = useState(true);
  const [hideNextArrow, setHideNextArrow] = useState(true);

  useEffect(() => {
    if (pages.length) {
      setHidePrevArrow(activePageIndex === 0);
      setHideNextArrow(activePageIndex === pages.length - 1);
    }
  }, [activePageIndex, pages.length]);

  useEffect(() => {
    refresh();
  }, [children]);

  return (
    <div className="carousel-wrapper">
      <div
        className={classNames("carousel-list", {
          "justify-content-center": center && hidePrevArrow && hideNextArrow,
        })}
        ref={scrollRef}
      >
        {children}
      </div>
      {!hidePrevArrow && (
        <SamplePrevArrow
          className={classNames(arrowClassName, {
            disabled: activePageIndex === 0,
          })}
          onClick={prev}
        />
      )}
      {!hideNextArrow && (
        <SampleNextArrow
          className={classNames(arrowClassName, {
            disabled: activePageIndex === pages.length - 1,
          })}
          onClick={next}
        />
      )}
    </div>
  );
};
