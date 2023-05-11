import { Skeleton } from "@mui/material";
import React, { Fragment } from "react";
import { Accordion } from "react-bootstrap";
import { useSelector } from "react-redux";
import { betGroupLinks, eventAtSlider, liveGamesData } from "./constants";

const sports = [
  "Football",
  "Tennis",
  "American Football",
  "Basketball",
  "Boxing",
  "Ice Hockey",
  "Cricket",
  "Darts",
  "Horse Racing",
];

const HomeSkeletonComponent = ({ isLoading }) => {
  const isMobile = useSelector((state) => state.setMobile);

  let counter = 0;
  const maxCounter = betGroupLinks.length - 1;

  return (
    <div className="home-container-skeleton">
      <div className="mainArticle mainArticle-skeleton">
        <div className="home-slider-container home-slider-container-skeleton">
          {Array.from({ length: isMobile ? 2 : 3 }).map((_, index) => {
            return (
              <Fragment key={index}>
                {isMobile ? (
                  <div className="slick-flick-for-skeleton" key={index}>
                    <div key={index} className="slider-image-container">
                      <Skeleton
                        variant="rectangular"
                        width={210}
                        height={118}
                      />
                      <div className="slider-text">
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1.2rem" }}
                          className="my-2"
                          animation="wave"
                          key={Math.random()}
                        />
                        <p className="sliderTextContent">
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: "1.2rem" }}
                            className="my-2"
                            animation="wave"
                            key={Math.random()}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div key={index} className="slider-image-container">
                      <Skeleton
                        variant="rectangular"
                        width={210}
                        height={155}
                      />
                      <div className="slider-text">
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1.2rem" }}
                          className="my-2"
                          animation="wave"
                          key={Math.random()}
                        />
                        <p className="sliderTextContent">
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: "1.2rem" }}
                            className="my-2"
                            animation="wave"
                            key={Math.random()}
                          />
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </Fragment>
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
                    {" "}
                    <Skeleton
                      variant="text"
                      sx={
                        !isMobile
                          ? { fontSize: "1.2rem", width: "150px" }
                          : { fontSize: "rem", width: "50px" }
                      }
                      className="my-2"
                      animation="wave"
                      key={Math.random()}
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
          <Skeleton
            variant="rectangular"
            sx={{
              fontSize: "1.2rem",
              marginTop: "0rem !important",
              marginBottom: "0rem !important",
            }}
            height={155}
            className="my-2"
            animation="wave"
            key={Math.random()}
          />
          <p className="slider-title-in-homepage">
            <Skeleton
              variant="rectangular"
              sx={{ fontSize: "1rem", width: "12rem" }}
              className="my-2"
              animation="wave"
              key={Math.random()}
            />
          </p>
          <p className="slider-title-in-homepage-description slider-title-in-homepage-description-skeleton">
            <Skeleton
              variant="rectangular"
              sx={{ fontSize: "1rem", width: "17rem" }}
              className="my-2"
              animation="wave"
              key={Math.random()}
            />
          </p>
          <div className="container-of-bets-in-slider">
            {eventAtSlider &&
              eventAtSlider.length > 0 &&
              eventAtSlider.map((row, index) => {
                return (
                  <div className="container-of-bets-in-row" key={index}>
                    <span className="markets-slider-page">
                      <Skeleton
                        variant="rectangular"
                        sx={{ fontSize: "1rem", width: "3rem" }}
                        className="my-2"
                        animation="wave"
                        key={Math.random()}
                      />
                    </span>
                    <span className="bets-of-markets-slider">
                      <Skeleton
                        variant="rectangular"
                        sx={{ fontSize: "1rem", width: "3rem" }}
                        className="my-2"
                        animation="wave"
                        key={Math.random()}
                      />
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="row w-100 sports-matches-container m-0">
          <div className="home-live-matches">
            {sports.map((row, index) => {
              return (
                <Accordion defaultActiveKey={0} alwaysOpen key={index}>
                  <Accordion.Item
                    eventKey={index}
                    style={{ borderWidth: "0", backgroundColor: "#25292d" }}
                  ></Accordion.Item>
                  <Skeleton
                    variant="rectangular"
                    sx={{ fontSize: "2rem" }}
                    className="my-2"
                    animation="wave"
                    key={Math.random()}
                  />
                </Accordion>
              );
            })}
          </div>
        </div>
        <p className="descriptionStyleOfPlay">
          <span className="descriptionStyleOfPlayFirst">
            <Skeleton
              variant="text"
              sx={{ fontSize: "1.75rem", width: "20%" }}
              animation="wave"
            />
          </span>
        </p>
        <div className="home-live-matches-footer">
          {isLoading &&
            liveGamesData.map((row, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="containerOfLiveGamesFooter">
                    <Skeleton variant="circular" width={30} height={30} />
                    <p className="titleOfLiveGames">
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1.25rem", width: "20%" }}
                        animation="wave"
                      />
                    </p>
                    <p className="paragraphOfLiveGame">
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1.75rem", width: "100%" }}
                        animation="wave"
                      />
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1.5rem", width: "100%" }}
                        animation="wave"
                      />
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1.5rem", width: "100%" }}
                        animation="wave"
                      />
                    </p>
                  </div>
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default HomeSkeletonComponent;
