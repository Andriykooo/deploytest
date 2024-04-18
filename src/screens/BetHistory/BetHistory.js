"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { gamingSocket } from "@/context/socket";
import { Button } from "../../components/button/Button";
import { BET_HISTORY_ALL_TAB, BET_HISTORY_TABS } from "@/utils/betHistory";
import classNames from "classnames";
import moment from "moment";
import BetHistorySection from "./BetHistorySection";
import BetHistorySectionRow from "./BetHistorySectionRow";
import { EmptyState } from "@/components/emptyState/EmptyState";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import { useTranslations } from "@/hooks/useTranslations";
import Spiner from "@/components/Spiner/Spiner";
import InfiniteScroll from "react-infinite-scroll-component";
import { alertToast } from "@/utils/alert";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import "../DepositLimit/DepositLimit.css";
import "./BetHistory.css";
import { useSelector } from "react-redux";

const skeletonHeader = new Array(8).fill(0);

const BetHistory = () => {
  const t = useTranslations();
  const isTablet = useSelector((state) => state.isTablet);
  const loggedUser = useSelector((state) => state.loggedUser);

  const symbol = loggedUser?.user_data?.currency?.symbol;

  const [isLoading, setIsLoading] = useState(true);
  const [myBets, setMyBets] = useState([]);
  const [activeTab, setActiveTab] = useState(BET_HISTORY_TABS[0].value);
  const [page, setPage] = useState(1);
  const [showSpinner, setShowSpinner] = useState(false);
  const hasMore = useRef(false);

  const getMyBets = (type) => {
    setShowSpinner(true);
    gamingSocket.emit(
      "my_bets",
      { value: type, page: page, history: 1 },
      (response) => {
        if (response.data?.errorMessage) {
          alertToast({ message: response.data.errorMessage });
        } else if (response.data.length) {
          setMyBets((prev) => [...prev, ...response.data]);
          if (response.data.length < 20) {
            hasMore.current = false;
          } else {
            hasMore.current = true;
            setPage(page + 1);
          }
        } else {
          hasMore.current = false;
        }
        setIsLoading(false);
        setShowSpinner(false);
      }
    );
  };

  const handleChangeTab = (value) => {
    setIsLoading(true);
    setMyBets([]);
    setPage(1);
    hasMore.current = false;
    setActiveTab(value);
  };

  useEffect(() => {
    getMyBets(activeTab);
  }, [activeTab]);

  const tabData = useMemo(
    () =>
      myBets.reduce((acc, val) => {
        const date = moment(val.bet_date).format("dddd, Do MMMM YYYY");
        return {
          ...acc,
          [date]: [...(acc[date] || []), val],
        };
      }, {}),
    [myBets]
  );
  const tabDates = useMemo(() => Object.keys(tabData), [tabData]);

  const renderTab = () => {
    if (!tabDates.length) {
      const text = activeTab === BET_HISTORY_ALL_TAB ? "" : `${activeTab} `;

      return (
        <EmptyState message={t("bet_history.no_bets_message", { text })} />
      );
    }

    return (
      <InfiniteScroll
        dataLength={page}
        next={() => getMyBets(activeTab)}
        loader={
          showSpinner && (
            <span className="spinnerStyle">
              <Spiner sell />
            </span>
          )
        }
        hasMore={hasMore.current && !isLoading}
        scrollableTarget="scrollable"
        className="max-container"
      >
        <div className="mb-4">
          {tabDates.map((date) => {
            const data = tabData[date];
            return (
              <div key={date} className="mt-4">
                <p className="betHistoryDate">{date}</p>
                {data?.map((bet) => (
                  <BetHistorySection
                    key={bet.bet_id}
                    title={bet.bet_name}
                    stake={bet.total_stake}
                    returns={bet.payout}
                    betsCount={bet.bets.length}
                    result={bet.result}
                    betDate={bet.bet_date}
                    betId={bet.bet_id}
                    item={bet}
                  >
                    {bet.bets.map((item) => (
                      <BetHistorySectionRow
                        key={`${bet.bet_id}-${item.event_name}`}
                        title={item.selection_name || item.competitor_name}
                        eventResult={item.event_result}
                        result={item.result}
                        market={item.market_name}
                        eventStartTime={item.event_start_time}
                        name={item.event_name}
                        betsCount={bet.bets.length}
                        betDate={bet.bet_date}
                        bogEnabled={item.bog_enabled}
                        bogAmount={item.bog_amount}
                        symbol={symbol}
                        ewTerms={item.ew_terms}
                        odds={{
                          odds_decimal: item.odds_decimal,
                          odds_fractional: item.odds_fractional,
                          odds_american: item.odds_american,
                        }}
                      />
                    ))}
                  </BetHistorySection>
                ))}
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    );
  };

  return (
    <div className="depositLimit betHistoryBody" id="scrollable">
      <div>
        <PreferencesTitle title={t("common.bet_history")} />
        <div className="betHistoryMenuBar">
          {BET_HISTORY_TABS.map((tab) => (
            <Button
              key={tab.value}
              className={classNames("betHistoryMenu", {
                activeButton: activeTab === tab.value,
              })}
              onClick={() => {
                if (activeTab !== tab.value) {
                  handleChangeTab(tab.value);
                }
              }}
              text={
                <>
                  {tab.icon}
                  &nbsp; {t(`common.${tab.label}`)}
                </>
              }
            />
          ))}
        </div>
      </div>
      <div
        className={classNames("betHistoryContent", {
          "max-width-container": !!tabDates.length,
          betHistoryContentCentered: !tabDates.length,
        })}
      >
        {isLoading ? (
          <>
            <Skeleton height={20} width={200} className={"mb-3"} />
            {skeletonHeader.map((_, index) => {
              return (
                <Skeleton
                  key={index}
                  height={118}
                  width={isTablet ? "100%" : 454}
                  className={"mb-2"}
                />
              );
            })}
          </>
        ) : (
          renderTab()
        )}
      </div>
    </div>
  );
};

export default BetHistory;
