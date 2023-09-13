"use client";

import { nextWindow } from "@/utils/nextWindow";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "swiper/css";
import { Swiper } from "swiper/react";
import ProfileBack from "@/components/profileBack/ProfileBack";
import Spiner from "../../utils/Spiner";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { CasinoBet, CasinoResult } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import { TRANSACTION_HISTORY_STATUSES } from "@/utils/transactionHistory";
import "../TransactionHistory/TransactionHistory.css";
import "./TransactionModals";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { monthDates } from "../../utils/constants";
import { Button } from "../../components/button/Button";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import moment from "moment";

const TransactionHistory = () => {
  const skeletonHeader = new Array(4).fill(0);
  const [currPage, setCurrPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const isTablet = useSelector((state) => state.isTablet);
  const [selected, setSelected] = useState(0);

  const [initialData, setInitialData] = useState([]);

  const getTransactions = () => {
    setShowSpinner(true);
    apiServices
      .get(`${apiUrl.TRANSACTION_HISTORY}${currPage}`)
      .then((data) => {
        setTransactions(data.data);
        setInitialData(data.data);
        setCurrPage(data.current_page + 1);
        setHasMore(data.current_page < data.total_pages);
        setIsLoading(false);
        setShowSpinner(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setShowSpinner(false);
        alertToast({ message: error || "Something went wrong!" });
      });
  };

  const handleClick = (transaction) => {
    if (transaction.date === selected?.date) {
      setTransactions(initialData);
      setSelected(null);

      return;
    }

    setTransactions(
      initialData.filter((currentTransaction) => {
        return currentTransaction.date === transaction.date;
      })
    );

    setSelected(transaction);
  };

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

  const getTxDetails = (item) => {
    var icon = ``;
    var transactionTitle = ``;
    switch (item?.transaction_type) {
      case "bet_cancel":
        icon = (
          <Image
            alt="img-betCancelled"
            src={images.betCancelled}
            width="40px"
            height="40px"
          />
        );
        transactionTitle = `Bet Cancelled (#${item.id})`;
        break;
      case "bet_place":
        icon = (
          <Image
            alt="img-betPlacedBlack"
            src={images.betPlacedBlack}
            width="40px"
            height="40px"
          />
        );
        transactionTitle = `Bet Placed (#${item.id})`;
        break;
      case "bet_pushed":
        icon = (
          <Image
            alt="img-betPushed"
            src={images.betPushed}
            width="40px"
            height="40px"
          />
        );
        transactionTitle = `Bet Pushed (#${item.id})`;
        break;
      case "bet_undo":
        icon = (
          <Image
            alt="img-betPlacedBlack"
            src={images.betPlacedBlack}
            width="40px"
            height="40px"
          />
        );
        transactionTitle = `Bet Undo (#${item.id})`;
        break;
      case "deposit_bank_transfer":
      case item?.transaction_type.includes("deposit"):
        icon = (
          <Image
            alt="img-depositBlack"
            src={images.depositBlack}
            width="40px"
            height="40px"
          />
        );
        transactionTitle = `Deposit`;
        break;
      case "withdrawal":
      case "withdrawal_nixxe":
      case item?.transaction_type.includes("withdraw"):
        icon = (
          <Image
            alt="img-withdrawalBlack"
            src={images.withdrawalBlack}
            width="40px"
            height="40px"
          />
        );
        transactionTitle = `Withdrawal`;
        break;
      case "user_balance_adjustment":
        icon = (
          <Image
            alt="img-depositBlack"
            src={images.depositBlack}
            width="40px"
            height="40px"
          />
        );
        transactionTitle = `Balance Adjustment`;
        break;
      case "casino_bet":
        icon = <CasinoBet />;
        transactionTitle = "Casino";
        break;
      case "casino_result":
        icon = <CasinoResult />;
        transactionTitle = "Casino";
        break;
      default:
        // Place Bet
        if (item?.transaction_type.indexOf("bet_slip_place") > -1) {
          icon = (
            <Image
              alt="img-betPlacedBlack"
              src={images.betPlacedBlack}
              width="40px"
              height="40px"
            />
          );
          transactionTitle = item.transaction_title;
        } else if (item?.transaction_type.indexOf("bet_win") > -1) {
          icon = (
            <Image
              alt="img-betWon"
              src={images.betWon}
              width="40px"
              height="40px"
            />
          );
          transactionTitle = `Bet Won (#${item.id})`;
        } else {
          console.log("type", item?.transaction_type);
        }

        break;
    }
    var amount = item.amount ? parseFloat(item.amount) : "";
    amount =
      !amount || amount < 0 ? amount.toFixed(2) : "+" + amount.toFixed(2);

    const date = new Date(item.transaction_datetime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return {
      icon,
      title: transactionTitle,
      amount,
      date,
    };
  };

  const betTypeIcon = {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    paddingLeft: "0.25rem",
    paddingRight: "16px",
  };
  const containerStyles = {
    paddingRight: "40px",
    height: "100%",
  };
  useEffect(() => {
    getTransactions();
    const onScroll = () => {};
    if (document.querySelector("#scrollable")) {
      document
        .querySelector("#scrollable")
        .addEventListener("scroll", onScroll);
    }

    return () => nextWindow.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="depositLimit" style={containerStyles} id="scrollable">
      <div className="">
        <ProfileBack />
        <PreferencesTitle title="Transaction History" />
        <div className="promotion-title">
          {initialData.map((transaction) => {
            const isSelected = selected?.date === transaction.date;

            return (
              <div
                className={classNames("menu", {
                  ["selected-bonus"]: isSelected,
                })}
                key={transaction.date}
                onClick={() => handleClick(transaction)}
              >
                <Button
                  className={classNames("menu-link-promotions", {
                    selected: isSelected,
                  })}
                  type="button"
                  text={moment(transaction.date).format("MMMM YYYY")}
                />
              </div>
            );
          })}
        </div>

        <div className="mb-3">
          <Swiper
            id="feed-swiper"
            className="monthsFilter col-12"
            slidesPerView={"auto"}
            spaceBetween={1}
            freeMode={true}
            loop={false}
          ></Swiper>

          <div className="infiniteScroll">
            <InfiniteScroll
              dataLength={transactions?.length}
              next={getTransactions}
              hasMore={hasMore && !isLoading}
              scrollableTarget="scrollable"
              className="max-container"
            >
              <div className="mb-4">
                {isLoading ? (
                  skeletonHeader.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "2rem", bgcolor: "#212536" }}
                          className="mt-2"
                          animation="wave"
                          width={250}
                          key={index}
                        />
                        {skeletonHeader.map((item, index) => (
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: "1.2rem" }}
                            className="my-2"
                            animation="wave"
                            width={600}
                            key={index}
                          />
                        ))}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <>
                    {transactions.map((value, index) => {
                      return (
                        <div key={value.date}>
                          <span
                            className={classNames("predictionDates mb-3", {
                              "mt-4": index !== 0,
                            })}
                          >
                            {getDate(value.date)}
                          </span>
                          {value?.data.map((item) => {
                            const txDetails = getTxDetails(item);
                            return (
                              <div key={item.id}>
                                <div className="mb-2" key={item.date}>
                                  <div>
                                    <div className="transactionCardWrapper col-8 d-flex">
                                      <div className="transactionCard">
                                        <div style={betTypeIcon}>
                                          {txDetails.icon}
                                        </div>
                                        <div
                                          className={classNames(
                                            "transaction-item-title",
                                            {
                                              "title-centered":
                                                !item.row2 &&
                                                item.transaction_status ===
                                                  TRANSACTION_HISTORY_STATUSES.successful,
                                            }
                                          )}
                                        >
                                          <div
                                            className={
                                              !isTablet &&
                                              !item.row2 &&
                                              "transaction-item"
                                            }
                                          >
                                            <span className="placed">
                                              {txDetails.title}
                                            </span>
                                            {!!item.row2 ? (
                                              <span className="typeSubtitle">
                                                {item.row2}
                                              </span>
                                            ) : (
                                              item.transaction_status !==
                                                TRANSACTION_HISTORY_STATUSES.successful && (
                                                <div
                                                  className={`transaction-status ${item.transaction_status}`}
                                                >
                                                  <span>
                                                    {item.transaction_status}
                                                  </span>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="amount-wrapper">
                                        <span className="typeDate">
                                          {txDetails.date}
                                        </span>
                                        <div className="placed">
                                          <span>{txDetails.amount}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                    {showSpinner && (
                      <span className="spinnerStyle">
                        <Spiner sell />
                      </span>
                    )}
                  </>
                )}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
