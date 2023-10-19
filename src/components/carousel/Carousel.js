"use client";

import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSnapCarousel } from "react-snap-carousel";
import { SampleNextArrow, SamplePrevArrow } from "../../utils/icons";

export const Carousel = ({ arrowClassName, center, data }) => {
  const {
    scrollRef,
    prev,
    next,
    activePageIndex,
    snapPointIndexes,
    pages,
    refresh,
  } = useSnapCarousel();
  const firstElementRef = useRef(null);
  const lastElementRef = useRef(null);

  const [hidePrevArrow, setHidePrevArrow] = useState(true);
  const [hideNextArrow, setHideNextArrow] = useState(true);

  const handleScroll = (e) => {
    const list = e.target.getBoundingClientRect();
    const firstElement = firstElementRef?.current?.getBoundingClientRect();
    const lastElement = lastElementRef?.current?.getBoundingClientRect();

    const hidePrevArrowByScroll =
      Math.floor(list.left) <= Math.round(firstElement.left);

    const hideNextArrowByScroll =
      Math.floor(lastElement.right) <= Math.round(list.right);

    if (hidePrevArrowByScroll !== hidePrevArrow) {
      setHidePrevArrow(hidePrevArrowByScroll);
    }

    if (hideNextArrowByScroll !== hideNextArrow) {
      setHideNextArrow(hideNextArrowByScroll);
    }
  };

  useEffect(() => {
    if (pages.length) {
      setHidePrevArrow(activePageIndex === 0);
      setHideNextArrow(activePageIndex === pages.length - 1);
    }
  }, [pages.length]);

  useEffect(() => {
    refresh();
  }, [data]);

  return (
    <div className="carousel-wrapper">
      <ul
        className={classNames("carousel-list", {
          "justify-content-center": center && hidePrevArrow && hideNextArrow,
        })}
        ref={scrollRef}
        style={{ scrollSnapType: "x mandatory" }}
        onScroll={handleScroll}
      >
        {data?.map((item, index) => {
          return (
            <li
              key={item.id}
              ref={
                index === 0
                  ? firstElementRef
                  : index === data.length - 1
                  ? lastElementRef
                  : null
              }
              style={
                snapPointIndexes.has(index) ? { scrollSnapAlign: "start" } : {}
              }
            >
              {item.render}
            </li>
          );
        })}
      </ul>
      {!hidePrevArrow && (
        <div className={classNames("arrow-wrapper previous", arrowClassName)}>
          <SamplePrevArrow onClick={prev} />
        </div>
      )}
      {!hideNextArrow && (
        <div className={classNames("arrow-wrapper next", arrowClassName)}>
          <SampleNextArrow onClick={next} />
        </div>
      )}
    </div>
  );
};
