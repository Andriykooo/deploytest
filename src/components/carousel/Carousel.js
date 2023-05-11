import classNames from "classnames";
import { useSnapCarousel } from "react-snap-carousel";
import { SampleNextArrow, SamplePrevArrow } from "../../utils/icons";
import { useEffect, useState } from "react";

export const Carousel = ({ children, arrowClassName }) => {
  const { scrollRef, prev, next, activePageIndex, pages } = useSnapCarousel();
  const [hidePrevArrow, setHidePrevArrow] = useState(true);
  const [hideNextArrow, setHideNextArrow] = useState(false);

  useEffect(() => {
    setHidePrevArrow(activePageIndex === 0);
    setHideNextArrow(activePageIndex === pages.length - 1);
  }, [activePageIndex, pages.length]);

  return (
    <div className="carousel-wrapper">
      <div className="carousel-list" ref={scrollRef}>
        {children}
      </div>
      {!hidePrevArrow && (
        <SamplePrevArrow
          className={classNames({
            disabled: activePageIndex === 0,
            [arrowClassName]: true,
          })}
          onClick={prev}
        />
      )}
      {!hideNextArrow && (
        <SampleNextArrow
          className={classNames({
            disabled: activePageIndex === pages.length - 1,
            [arrowClassName]: true,
          })}
          onClick={next}
        />
      )}
    </div>
  );
};
