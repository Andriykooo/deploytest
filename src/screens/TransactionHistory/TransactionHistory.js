"use client";

import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spiner from "../../components/Spiner/Spiner";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import {
  AddCashFreeBet,
  AddCashFreeBetLogo,
  BetCancelled,
  BetPlacedBlack,
  BetPushed,
  BetWon,
  CasinoBetIcon,
  DepositBlack,
  WithdrawalBlack,
} from "../../utils/icons";
import { TRANSACTION_HISTORY_STATUSES } from "@/utils/transactionHistory";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import moment from "moment";
import { TransactionDetails } from "./TransactionsDetails";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import "./TransactionHistory.css";
import "../BonuesesAndPromotions/BonuesesAndPromotions.css";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";

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
    var icon = ``;
    var transactionTitle = ``;
    let row = item?.transaction_type;
    if (
      item?.transaction_type?.includes("deposit") ||
      item?.transaction_type == "depsit"
    ) {
      row = "deposit";
    } else if (item?.transaction_type?.includes("withdrawal")) {
      row = "withdrawal";
    } else if (item?.transaction_type?.includes("bet_pushed")) {
      row = "bet_pushed";
    }

    switch (row) {
      case "bet_cancel":
      case "cancel_bet_payout":
      case "bet_undo":
        icon = <BetCancelled />;
        transactionTitle = `${t("transaction_history.bet_cancelled")} (#${
          item.id
        })`;
        break;
      case "add_cash_free_bet":
        icon = <AddCashFreeBet />;
        transactionTitle = `${t("transaction_history.add_cash_free_Bet")}`;
        break;
      case "cancel_cash_free_bet":
        icon = <AddCashFreeBet />;
        transactionTitle = `${t("transaction_history.cancel_cash_free_Bet")}`;
        break;
      case "bet_place":
        icon = <BetPlacedBlack />;
        transactionTitle = `${t("transaction_history.bet_placed")} (#${
          item.id
        })`;
        break;
      case "bet_pushed":
        icon = <BetPushed />;
        transactionTitle = `${t("transaction_history.bet_pushed")} (#${
          item.id
        })`;
        break;
      case "deposit":
        icon = <DepositBlack />;
        transactionTitle = t("common.deposit");
        break;
      case "withdrawal":
        icon = <WithdrawalBlack />;
        transactionTitle = t("transaction_history.withdrawal");
        break;
      case "user_balance_adjustment":
        icon = <DepositBlack />;
        transactionTitle = t("transaction_history.balance_adjustment");
        break;
      case "casino_bet":
        icon = <CasinoBetIcon />;
        transactionTitle = t("transaction_history.casino");
        break;
      case "casino_result":
        icon = <CasinoBetIcon />;
        transactionTitle = t("transaction_history.casino");
        break;
      default:
        // Place Bet
        if (row?.includes("bet_slip_place")) {
          icon = <BetPlacedBlack />;
          transactionTitle = item.description;
        } else if (row?.includes("bet_win")) {
          icon = <BetWon />;
          transactionTitle = `${t("transaction_history.bet_won")} (#${
            item.id
          })`;
        } else if (row?.includes("cash_out") > -1) {
          icon = <BetPushed />;
          transactionTitle = ` Cash Out (#${item.id})`;
        }
        break;
    }

    var amount = parseFloat(item.amount);

    amount =
      !amount || amount < 0 ? amount.toFixed(2) : "+" + amount.toFixed(2);

    const date = moment(item.transaction_datetime).format("hh:mm:ss A");

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
                                className="transactionCardWrapper col-8 mb-2 d-flex"
                                onClick={() => {
                                  setTransactionDetails({
                                    ...item,
                                    ...txDetails,
                                  });
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
                                        {txDetails.title}
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
                                    <span>
                                      {formatNumberWithDecimal(
                                        txDetails.amount
                                      )}
                                    </span>
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
