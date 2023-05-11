import { React } from "react";
import Slider from "react-slick";
import "swiper/css";
import { SampleNextArrow, SamplePrevArrow } from "../../utils/icons";
import { iconsAtTheSlider } from "../../utils/constants";
import { Skeleton } from "@mui/material";

const MobileHomeSlider = ({ isLoading }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings}>
        {isLoading ? (
          <div className="d-flex justify-content-between">
            <Skeleton
              variant="rectangular"
              height={120}
              width={120}
              className="my-2"
              animation="wave"
            />
          </div>
        ) : (
          iconsAtTheSlider.map((row, index) => {
            return (
              <div className="slider-image-container" key={index}>
                <img src={row?.icon} alt="" />
              </div>
            );
          })
        )}
      </Slider>
    </div>
  );
};
export default MobileHomeSlider;
