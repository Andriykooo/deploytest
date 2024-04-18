"use client";

import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spiner from "../../components/Spiner/Spiner";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { AddCashFreeBet } from "@/icons/AddCashFreeBet";
import { BetCancelled } from "@/icons/BetCancelled";
import { AddCashFreeBetLogo } from "@/icons/AddCashFreeBetLogo";
import { BetPlacedBlack } from "@/icons/BetPlacedBlack";
import { BetPushed } from "@/icons/BetPushed";
import { BetWon } from "@/icons/BetWon";
import { CasinoBetIcon } from "@/icons/CasinoBetIcon";
import { DepositBlack } from "@/icons/DepositBlack";
import { WithdrawalBlack } from "@/icons/WithdrawalBlack";
import { DefaultIcon } from "@/icons/DefaultIcon";
import { TRANSACTION_HISTORY_STATUSES } from "@/utils/transactionHistory";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import moment from "moment";
import { TransactionDetails } from "./TransactionsDetails";
import { useTranslations } from "@/hooks/useTranslations";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import "./TransactionHistory.css";
import "../BonuesesAndPromotions/BonuesesAndPromotions.css";
// import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";

const flattenObjectToArray = (nestedObj) => {
  const result = [];
  for (const key1 in nestedObj) {
    const innerObj = nestedObj[key1];
    for (const key2 in innerObj) {
      const { date, data } = innerObj[key2];
      result.push({ date, data });
    }
  }
  return result;
};

const transactionIcons = {
  bet_cancelled: <BetCancelled />,
  cash_free_bet: <AddCashFreeBet />,
  bet_place: <BetPlacedBlack />,
  bet_pushed: <BetPushed />,
  deposit: <DepositBlack />,
  withdrawal: <WithdrawalBlack />,
  casino: <CasinoBetIcon />,
  bet_win: <BetWon />,
};

const TransactionHistory = () => {
  const t = useTranslations();
  const skeletonHeader = new Array(4).fill(0);
  const isTablet = useSelector((state) => state.isTablet);

  const [transactions, setTransactions] = useState({});
  const [currPage, setCurrPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selected, setSelected] = useState(0);
  const [transactionDetails, setTransactionDetails] = useState(null);

  const groupByMonthYear = (data) => {
    const groupedData = { ...transactions };

    data.forEach((item) => {
      const monthYear = moment(item.date).format("YYYY-MM");

      if (!groupedData[monthYear]) {
        groupedData[monthYear] = {};
      }

      groupedData[monthYear] = {
        ...groupedData[monthYear],
        [item.date]: {
          ...item,
          data: [
            ...(groupedData?.[monthYear]?.[item.date]?.data || []),
            ...item.data,
          ],
        },
      };
    });

    setTransactions(groupedData);
  };

  const getTransactions = () => {
    setShowSpinner(true);
    apiServices
      .get(`${apiUrl.TRANSACTION_HISTORY}${currPage}`)
      .then((data) => {
        const transactionData = data;
        groupByMonthYear(transactionData.data);
        setCurrPage(transactionData.current_page + 1);
        setHasMore(transactionData.current_page < transactionData.total_pages);
        setIsLoading(false);
        setShowSpinner(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setShowSpinner(false);
        alertToast({
          message: error || t("transaction_history.something_went_wrong"),
        });
      });
  };

  const handleClick = (date) => {
    setSelected(selected === date ? null : date);
  };

  const getDate = (date) => {
    const weekday = new Array(7);
    weekday[0] = t("common.sunday");
    weekday[1] = t("common.monday");
    weekday[2] = t("common.tuesday");
    weekday[3] = t("common.wednesday");
    weekday[4] = t("common.thursday");
    weekday[5] = t("common.friday");
    weekday[6] = t("common.saturday");
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
    let title = item.type;
    const depositOrWithdrawal =
      item.transaction_type.includes("deposit") ||
      item.transaction_type.includes("withdrawal");

    if (item.show_id) title += ` (#${item.id})`;

    var icon = transactionIcons[item.icon_slug] || <DefaultIcon />;

    var amount = Number(item.amount.replace(/,/g, ""));

    amount = !amount || amount < 0 ? item.amount : "+" + item.amount;

    const date = moment.utc(item.datetime).local().format("hh:mm:ss A");

    return {
      icon,
      title,
      subtitle: item.description,
      amount,
      date,
      isClickable: depositOrWithdrawal,
    };
  };

  const betTypeIcon = {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    paddingLeft: "0.25rem",
    paddingRight: "16px",
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const transactionsList = selected
    ? Object.values(transactions[selected])
    : flattenObjectToArray(transactions);

  return (
    <div className="depositLimit transactionHistory" id="scrollable">
      <div className="">
        <PreferencesTitle title={t("common.transaction_history")} />
        {!isLoading && (
          <div className="promotion-nav">
            {Object.entries(transactions).map(([date]) => {
              const isSelected = selected === date;

              return (
                <div
                  className={classNames("menu", {
                    ["selected-bonus"]: isSelected,
                  })}
                  key={date}
                  onClick={() => handleClick(date)}
                >
                  <Button
                    className={classNames("menu-link-promotions", {
                      selected: isSelected,
                    })}
                    type="button"
                    text={moment(date).format("MMMM YYYY")}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="mb-3">
          <div className="infiniteScroll">
            <InfiniteScroll
              dataLength={currPage}
              next={getTransactions}
              loader={
                showSpinner && (
                  <span className="spinnerStyle">
                    <Spiner sell />
                  </span>
                )
              }
              hasMore={hasMore && !isLoading}
              scrollableTarget="scrollable"
              className="max-container"
            >
              <div className="mb-4">
                {isLoading ? (
                  <>
                    <div className="d-flex">
                      {skeletonHeader.map((_, index) => {
                        return (
                          <Skeleton
                            key={index}
                            sx={{ borderRadius: "40px" }}
                            width={115}
                            height={40}
                            className="mb-4 me-2"
                          />
                        );
                      })}
                    </div>
                    {skeletonHeader.map((_, index) => {
                      return (
                        <React.Fragment key={index}>
                          <Skeleton
                            width={250}
                            height={25}
                            key={index}
                            className={classNames("mb-4", {
                              "mt-4": index > 0,
                            })}
                          />
                          {skeletonHeader.map((_, index) => (
                            <Skeleton
                              className="mb-2"
                              width={isTablet ? "100%" : 600}
                              height={50}
                              key={index}
                            />
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {transactionsList.map((value, index) => {
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
                              <div
                                key={item.id}
                                className={`transactionCardWrapper col-8 mb-2 d-flex ${
                                  txDetails.isClickable ? "cursor-pointer" : ""
                                }`}
                                onClick={() => {
                                  if (txDetails.isClickable) {
                                    setTransactionDetails({
                                      ...item,
                                      ...txDetails,
                                    });
                                  }
                                }}
                              >
                                <div className="transactionCard">
                                  <div style={betTypeIcon}>
                                    {txDetails.icon}
                                  </div>
                                  <div
                                    className={classNames(
                                      "transaction-item-title",
                                      {
                                        "title-centered":
                                          item.status ==
                                          TRANSACTION_HISTORY_STATUSES.successful,
                                      }
                                    )}
                                  >
                                    <div
                                      className={classNames({
                                        "transaction-item": !isTablet,
                                      })}
                                    >
                                      <span className="placed">
                                        <span>{txDetails.title}</span>
                                        {txDetails?.subtitle && (
                                          <span className="subtitle">
                                            {txDetails.subtitle}
                                          </span>
                                        )}
                                      </span>
                                      {item?.status && (
                                        <div
                                          className={classNames(
                                            "transaction-status",
                                            item.status
                                          )}
                                        >
                                          <span>{item.status}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="amount-wrapper">
                                  <span className="typeDate">
                                    {txDetails.date}
                                  </span>
                                  <div className="placed my_bet_result_container justify-content-end mt-1">
                                    <span>{txDetails.amount}</span>
                                    {item?.is_free_bet == "1" && (
                                      <AddCashFreeBetLogo />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
      {transactionDetails && (
        <TransactionDetails
          data={transactionDetails}
          close={() => {
            setTransactionDetails(null);
          }}
        />
      )}
    </div>
  );
};

export default TransactionHistory;
