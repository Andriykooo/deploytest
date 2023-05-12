import React, { useEffect, useState } from "react";

import { Skeleton } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button/Button";
import Header from "../../components/header/Header";
import { Loader } from "../../components/loaders/Loader";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";
import Spiner from "../../utils/Spiner";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import "../DepositLimit/DepositLimit.css";
import "../OpenPredictions/OpenPredictions.css";

const OpenPredictions = () => {
  const isMobile = useSelector((state) => state.setMobile);
  const [hasMore, setHasMore] = useState(false);
  const [activeBet, setActiveBet] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelBetId, setCancelBetId] = useState("");
  const [openedPredictions, setOpenedPredictions] = useState([]);
  const skeletonHeader = new Array(4).fill(0);

  const getDate = (date) => {
    const weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    const currDate = new Date(date);
    let dateNow = currDate.getDate();
    dateNow > 30 ? (dateNow = dateNow + "st") : (dateNow = dateNow + "th");
    dateNow =
      weekday[currDate.getDay()] +
      ", " +
      dateNow +
      " " +
      currDate.toLocaleString("en-US", { month: "long" });
    return dateNow;
  };

  const getTime = (match_time) => {
    const currDate = new Date(match_time);
    const time = currDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return time;
  };
  const containerStyles = {
    height: "100%",
  };

  const getOpenPredictions = () => {
    setIsLoading(true);
    apiServices
      .get(`${apiUrl.NEXT_PUBLIC_PREDICTIONS_HISTORY}?status=open&page=1`)
      .then((result) => {
        setOpenedPredictions(result?.data);
        setHasMore(result.current_page < result.total_page);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleCancelBet = (id) => {
    apiServices
      .put(`${apiUrl.NEXT_PUBLIC_CANCEL_BET}/${id}`, {})
      .then(() => {
        getOpenPredictions();
        setCancelBetId("");
      })
      .catch(() => {
        setCancelBetId("");
      });
  };

  useEffect(() => {
    getOpenPredictions();
  }, []);

  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="backgroundLinear linearOpen">
        <div className="d-none d-lg-block">
          <ProfileMenu
            sideBarMenu
            page={"open_predictions"}
            active={"active"}
            version
          />
        </div>
        <div
          className="depositLimit predictionBody"
          style={containerStyles}
          id="scrollable"
        >
          <div className="infiniteScroll">
            <div className="d-flex d-lg-none">
              <div className="d-flex">
                <img
                  src={images.goBackArrow}
                  alt="Go back"
                  className="goBackArrow ms-0 mb-3"
                  onClick={() => navigate("/profile")}
                />
              </div>
            </div>
            <p className="menuTitle predictionsTitle mb-4">
              Prediction History
            </p>
            {isMobile && (
              <div className="predictionsMobileMenuBar">
                <Button
                  className={"predictionsMobileMenu activeButton"}
                  onClick={() => {
                    navigate("/open_predictions");
                  }}
                  text={
                    <>
                      <img src={images.openPending} />
                      &nbsp; Open
                    </>
                  }
                />

                <Button
                  className={"predictionsMobileMenu"}
                  onClick={() => {
                    navigate("/settled_predictions");
                  }}
                  text={
                    <>
                      <img src={images.settledDone} />
                      &nbsp; Settled
                    </>
                  }
                />
              </div>
            )}
            <div>
              <InfiniteScroll
                dataLength={openedPredictions?.length}
                next={getOpenPredictions}
                hasMore={hasMore && !isLoading}
                scrollableTarget="scrollable"
                className="max-container"
              >
                {isLoading
                  ? skeletonHeader.map((item, index) => {
                      return (
                        <React.Fragment key={index}>
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: "2rem", bgcolor: "#212536" }}
                            className="mt-2"
                            animation="wave"
                            width={250}
                          />
                          {skeletonHeader.map((item, index) => (
                            <Skeleton
                              variant="text"
                              sx={{ fontSize: "1.2rem" }}
                              className="my-2"
                              animation="wave"
                              key={index}
                            />
                          ))}
                        </React.Fragment>
                      );
                    })
                  : openedPredictions?.length > 0
                  ? openedPredictions.map((row, index) => {
                      return (
                        <React.Fragment key={index}>
                          <p className="predictionDates">
                            {getDate(row?.date)}
                          </p>
                          {row?.leagues.map((league, index) => {
                            let matches = league?.matches;
                            return (
                              <React.Fragment key={index}>
                                {matches.map((match) => {
                                  let predictions = match?.types;
                                  return (
                                    <div
                                      className="row d-block mb-3 m-0"
                                      key={match?.match_id}
                                      data-id={match?.match_id}
                                    >
                                      <div
                                        className={
                                          "predictionContainer borderRad" +
                                          (activeBet === match?.match_id
                                            ? " matchClicked"
                                            : "")
                                        }
                                      >
                                        <div
                                          className={
                                            "dropdown " +
                                            (activeBet === match?.match_id
                                              ? "predictionWhite"
                                              : "")
                                          }
                                        >
                                          <div
                                            onClick={() => {
                                              if (
                                                activeBet === match?.match_id
                                              ) {
                                                setActiveBet(-1);
                                              } else {
                                                setActiveBet(match?.match_id);
                                              }
                                            }}
                                            className="prediction-clickable"
                                          >
                                            <p
                                              className={
                                                "sportLeague ps-3 pt-2 mb-0" +
                                                (activeBet === match?.match_id
                                                  ? " fontBlack"
                                                  : "")
                                              }
                                            >
                                              {league.sport_name} •{" "}
                                              {league?.name} •{" "}
                                              {getTime(match?.start_time_utc)}
                                            </p>
                                            <Button
                                              className="btn dropdown-toggle match  col-10 pt-0"
                                              type="button"
                                              id="dropdownMenuButton"
                                              data-bs-toggle="dropdown"
                                              aria-expanded="true"
                                              text={
                                                <>
                                                  {match?.home_name} {"vs"}{" "}
                                                  {match?.away_name}
                                                </>
                                              }
                                            />
                                            <img
                                              src={
                                                activeBet === match?.match_id
                                                  ? images.arrowIconBlack
                                                  : images.arrowIcon
                                              }
                                              alt="arrow"
                                              className={
                                                activeBet === match?.match_id
                                                  ? "arrowPrediction "
                                                  : "arrowPrediction predictionArrow col-1 "
                                              }
                                            />
                                          </div>
                                          <ul
                                            className={
                                              "dropdown-menu " +
                                              (activeBet === match?.match_id
                                                ? " show"
                                                : "")
                                            }
                                            aria-labelledby="dropdownMenuButton"
                                          >
                                            {predictions.map((value, index) => {
                                              return (
                                                <li
                                                  className="d-flex pt-0"
                                                  key={value?.user_bet_id}
                                                  data-id={index}
                                                >
                                                  <div className="dropdown-item underline  betMade ">
                                                    <span>
                                                      {value.match_description}
                                                    </span>
                                                    <div className="row inlineStyleOpenPrediction">
                                                      <div className="col-8 predictionValues">
                                                        <div className="col stakeValue d-flex">
                                                          <span className="stakeReturn ">
                                                            Stake:
                                                          </span>
                                                          {value.stake}
                                                        </div>
                                                        <div className="col stakeValue d-flex">
                                                          <span className="stakeReturn">
                                                            Returns:
                                                          </span>
                                                          &nbsp;{value.returns}
                                                        </div>
                                                        <div className="col stakeValue  d-flex">
                                                          <span className="stakeReturn">
                                                            Odds:
                                                          </span>
                                                          {value.odds}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <Button
                                                      className="cancelButton "
                                                      onClick={() => {
                                                        handleCancelBet(
                                                          value?.user_bet_id
                                                        );
                                                        setCancelBetId(
                                                          value?.user_bet_id
                                                        );
                                                      }}
                                                      text={
                                                        <>
                                                          {cancelBetId ===
                                                          value?.user_bet_id ? (
                                                            <Loader />
                                                          ) : (
                                                            "Cancel"
                                                          )}
                                                        </>
                                                      }
                                                    />
                                                  </div>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      );
                    })
                  : ""}
                {isLoading ? (
                  <div className="spinnerStyle">
                    <Spiner />
                  </div>
                ) : (
                  ""
                )}
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenPredictions;