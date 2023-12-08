"use client";

import Image from "next/image";
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
import { useTranslations } from "next-intl";
import Spiner from "@/utils/Spiner";
import InfiniteScroll from "react-infinite-scroll-component";
import "../DepositLimit/DepositLimit.css";
import "./BetHistory.css";
import { alertToast } from "@/utils/alert";

const skeletonHeader = new Array(4).fill(0);

const BetHistory = () => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [myBets, setMyBets] = useState([]);
  const [activeTab, setActiveTab] = useState(BET_HISTORY_TABS[0].value);
  const [page, setPage] = useState(1);
  const [showSpinner, setShowSpinner] = useState(false);
  const hasMore = useRef(false);

  const getMyBets = (type) => {
    setShowSpinner(true);
    gamingSocket.emit("my_bets", { value: type, page: page }, (response) => {
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
    });
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
              <div key={date}>
                <p className="betHistoryDate">{date}</p>
                {data?.map((bet) => (
                  <BetHistorySection
                    key={bet.bet_id}
                    title={bet.bet_name}
                    stake={bet.total_stake}
                    returns={bet.payout}
                    betsCount={bet.bets.length}
                    result={bet.result}
                  >
                    {bet.bets.map((item) => (
                      <BetHistorySectionRow
                        key={`${bet.bet_id}-${item.event_name}`}
                        title={item.selection_name || item.competitor_name}
                        eventResult={item.event_result}
                        result={item.result}
                        market={item.market_name}
                        name={item.event_name}
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
                  <Image src={tab.icon} alt="my-bet-tab" />
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
        {isLoading
          ? skeletonHeader.map((_, index) => {
              return null;
            })
          : renderTab()}
      </div>
    </div>
  );
};

export default BetHistory;
