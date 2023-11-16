import Image from "next/image";
import { useSelector } from "react-redux";
import { popularCasinoGames } from "../../utils/constants";
import { Button } from "../button/Button";
import { images } from "@/utils/imagesConstant";

const CasinoNewGames = ({ gamesData, title, baseUrl }) => {
  const isMobile = useSelector((state) => state.setMobile);
  const currentSlide = 0;

  return (
    <>
      {!isMobile ? (
        <>
          <div className="mainGames newGamCont">
            <div className="mainGamesContainer">
              <div className="mainGamesBox">
                <div className="recommendedTitle">{title}</div>
                <div className="newGamesImagesContainer">
                  <Button
                    className={
                      currentSlide > 0
                        ? "previousButton show"
                        : "previousButton"
                    }
                    // onClick={previousSlide}
                    text={
                      <>
                        <Image src={images.previousIcon} />
                      </>
                    }
                  ></Button>
                  <div className="newGamesImages">
                    {popularCasinoGames.map((row, index) => {
                      let itemClass = index === 0 ? "item1" : "item";
                      return (
                        <div
                          className={itemClass}
                          style={{ backgroundImage: `url(${row})` }}
                          key={index}
                        ></div>
                      );
                    })}
                  </div>
                  <Button
                    className={
                      currentSlide < 8 - 8
                        ? "nextButton show nextButton2"
                        : "nextButton nextButton2"
                    }
                    // onClick={nextSlide}
                    text={
                      <>
                        <Image src={images.nextIcon} />
                      </>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="recommendedContainer">
            <div className="mainGamesContainer">
              <div className="mainGamesBox">
                <div className="recommendedTitle">{title}</div>
                <div className="recommendedImages">
                  {gamesData.map((row, index) => {
                    let respClass = index === 0 ? "firstNewImg" : "gamesImages";
                    return (
                      <Image
                        key={index}
                        className={respClass}
                        src={`${baseUrl}${row?.url_188}`}
                        alt="Game 1"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CasinoNewGames;
