"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import ProfileBack from "@/components/profileBack/ProfileBack";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import Spiner from "../../components/Spiner/Spiner";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { useTranslations } from "@/hooks/useTranslations";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import "../DepositLimit/DepositLimit.css";
import "../OpenPredictions/OpenPredictions.css";
import { Skeleton } from "@/components/Skeleton/Skeleton";

const OpenPredictions = () => {
  const t = useTranslations("common");
  const isMobile = useSelector((state) => state.setMobile);
  const [hasMore, setHasMore] = useState(false);
  const [activeBet, setActiveBet] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelBetId, setCancelBetId] = useState("");
  const [openedPredictions, setOpenedPredictions] = useState([]);
  const skeletonHeader = new Array(4).fill(0);

  const getDate = (date) => {
    const weekday = new Array(7);
    weekday[0] = t("sunday");
    weekday[1] = t("monday");
    weekday[2] = t("tuesday");
    weekday[3] = t("wednesday");
    weekday[4] = t("thursday");
    weekday[5] = t("friday");
    weekday[6] = t("saturday");
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
      .get(`${apiUrl.PREDICTIONS_HISTORY}?status=open&page=1`)
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
      .put(`${apiUrl.CANCEL_BET}/${id}`, {})
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

  const router = useCustomRouter();
  return (
    <div
      className="depositLimit predictionBody"
      style={containerStyles}
      id="scrollable"
    >
      <div className="infiniteScroll">
        <ProfileBack />
        <p className="menuTitle predictionsTitle mb-4">{t("bet_history")}</p>
        {isMobile && (
          <div className="predictionsMobileMenuBar">
            <Button
              className={"predictionsMobileMenu activeButton"}
              onClick={() => {
                router.push("/settings/bet_history");
              }}
              text={
                <>
                  <Image src={images.openPending} alt={t("open")} />
                  &nbsp; {t("open")}
                </>
              }
            />

            <Button
              className={"predictionsMobileMenu"}
              onClick={() => {
                router.push("/settled_predictions");
              }}
              text={
                <>
                  <Image src={images.settledDone} alt={t("settled")} />
                  &nbsp; {t("settled")}
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
              ? skeletonHeader.map((_, index) => {
                  return (
                    <React.Fragment key={index}>
                      <Skeleton className="mt-2 mb-4" width={250} height={30} />
                      {skeletonHeader.map((_, index) => (
                        <Skeleton
                          variant="text"
                          height={20}
                          width={600}
                          className="my-3"
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
                      <p className="predictionDates">{getDate(row?.date)}</p>
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
                                          if (activeBet === match?.match_id) {
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
                                          {league.sport_name} • {league?.name} •{" "}
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
                                        <Image
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
                                                        {t("stake")}:
                                                      </span>
                                                      {value.stake}
                                                    </div>
                                                    <div className="col stakeValue d-flex">
                                                      <span className="stakeReturn">
                                                        {t("returns")}:
                                                      </span>
                                                      &nbsp;{value.returns}
                                                    </div>
                                                    <div className="col stakeValue  d-flex">
                                                      <span className="stakeReturn">
                                                        {t("odds")}:
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
                                                        t("cancel")
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
  );
};

export default OpenPredictions;
