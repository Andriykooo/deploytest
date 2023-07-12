import { useSelector } from "react-redux";
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from "../../utils/icons";
import Image from "next/image";

const sliderPadding = "0px 30px";

const CasinoTrending = ({ gamesData, title }) => {
  const isMobile = useSelector((state) => state.setMobile);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    centerMode: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    style: {
      paddingLeft: sliderPadding.split(" ")[1],
      paddingRight: sliderPadding.split(" ")[1],
    },
  };

  return (
    <>
      {!isMobile ? (
        <>
          <div className="mainGames">
            <div className="mainGamesContainer">
              <div className="mainGamesBox">
                <div className="recommendedTitle">{title}</div>

                <Slider {...settings}>
                  {gamesData.map((row, index) => (
                    <Image
                      src={row.gameImages}
                      alt={`Img ${index}`}
                      key={index}
                    />
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="recommendedContainer">
          <div style={{ marginTop: "24px" }}>
            <div style={{ position: "relative" }}>
              <div className="recommendedTitle">{title}</div>
              <div className="recommendedImages">
                {gamesData.map((row, index) => (
                  <Image
                    className="gamesImages"
                    src={row.gameImages}
                    alt="Game 1"
                    key={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CasinoTrending;
