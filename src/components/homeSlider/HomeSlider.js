import { Skeleton } from "@mui/material";
import { Fragment, React } from "react";
import Slider from "react-slick";
import "swiper/css";
import { SampleNextArrow, SamplePrevArrow } from "../../utils/icons";
import { Button } from "../button/Button";

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
  };

  return (
    <div
      className={`${subtitle ? "recommendedSubtitle" : ""} ${className || ""}`}
    >
      <div className="d-flex justify-content-between">
        {isLoading ? (
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
        ) : subtitle ? (
          <div className="recommendedTitle recommendedTitleTrending">
            <span className="mx-4">{subtitle}</span>
          </div>
        ) : (
          ""
        )}
      </div>
      <Slider {...settings} className={type ? "casinoTrendingSlider" : ""}>
        {data?.map((row, index) => {
          return (
            <Fragment key={index}>
              <div
                key={index}
                className={
                  casinoSlider
                    ? "slider-image-container slider-image-container-casino"
                    : "slider-image-container"
                }
              >
                {isLoading ? (
                  <Skeleton
                    className="my-2"
                    variant="text"
                    sx={{ width: "209px", height: "190px" }}
                  />
                ) : (
                  <>
                    <img src={row?.details?.image} alt="slider-img" />
                    <div className="slider-text">
                      {row?.details?.title}
                      <p className="sliderTextContent">{row?.subtitle}</p>
                    </div>
                  </>
                )}
                <div className="betNowBtnsContainer">
                  {row?.buttons &&
                    row.buttons.map((row) => {
                      return (
                        <Button
                          className={"btnPrimary betNowButtonOFSlider"}
                          key={row?.name}
                          text={row?.name}
                        />
                      );
                    })}
                </div>
              </div>
            </Fragment>
          );
        })}
      </Slider>
    </div>
  );
};
export default HomeSlider;
