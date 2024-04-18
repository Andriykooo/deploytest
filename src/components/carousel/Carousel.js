"use client";

import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSnapCarousel } from "react-snap-carousel";
import { SampleNextArrow } from "@/icons/SampleNextArrow";
import { SamplePrevArrow } from "@/icons/SamplePrevArrow";
import "./Carousel.css";

export const Carousel = ({
  arrowClassName,
  className,
  center,
  data,
  onScroll,
  showGradient,
  itemWidth,
  disableScrollToTab,
}) => {
  const { scrollRef, prev, next, activePageIndex, pages, refresh } =
    useSnapCarousel();
  const firstElementRef = useRef(null);
  const lastElementRef = useRef(null);
  const wrapperRef = useRef(null);

  const [hidePrevArrow, setHidePrevArrow] = useState(true);
  const [hideNextArrow, setHideNextArrow] = useState(true);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);

  const currentVisibleElements = wrapperRef?.current?.clientWidth
    ? Math.ceil(wrapperRef?.current?.clientWidth / itemWidth)
    : 0;

  const visibleElements = {
    from: 0,
    to: currentSnapIndex + currentVisibleElements,
  };

  const handleScroll = (e) => {
    onScroll?.();
    const snapIndex = Math.floor(e.target.scrollLeft / itemWidth);

    if (snapIndex > currentSnapIndex) {
      setCurrentSnapIndex(Math.floor(e.target.scrollLeft / itemWidth));
    }

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
    <div className="carousel-wrapper" ref={wrapperRef}>
      <ul
        className={classNames("carousel-list", {
          "justify-content-center": center && hidePrevArrow && hideNextArrow,
        })}
        ref={scrollRef}
        style={{ scrollSnapType: "x mandatory" }}
        onScroll={handleScroll}
      >
        {data.map((item, index) => {
          return (
            <li
              id={item.id}
              key={item.id}
              ref={
                index === 0
                  ? firstElementRef
                  : index === data.length - 1
                  ? lastElementRef
                  : null
              }
              className={classNames(className)}
              style={{
                width: item?.itemWidth || itemWidth,
                scrollSnapAlign: "start",
              }}
              onClick={(e) => {
                if (!disableScrollToTab) {
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }
              }}
            >
              {itemWidth
                ? visibleElements.from <= index &&
                  visibleElements.to >= index &&
                  item.render
                : item.render}
            </li>
          );
        })}
      </ul>
      {!hidePrevArrow && (
        <div
          onClick={prev}
          className={classNames("arrow-wrapper previous", arrowClassName, {
            showArrowGradient: showGradient,
          })}
        >
          <SamplePrevArrow />
        </div>
      )}
      {!hideNextArrow && (
        <div
          onClick={async () => {
            if (data.length >= currentSnapIndex) {
              await setCurrentSnapIndex(
                currentSnapIndex + currentVisibleElements
              );
            }
            next();
          }}
          className={classNames("arrow-wrapper next", arrowClassName, {
            showArrowGradient: showGradient,
          })}
        >
          <SampleNextArrow />
        </div>
      )}
    </div>
  );
};
