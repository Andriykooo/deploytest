"use client";

import { Skeleton } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import ProfileBack from "@/components/profileBack/ProfileBack";
import { gamingSocket } from "@/context/socket";
import { Button } from "../../components/button/Button";
import {
  BET_HISTORY_ALL_TAB,
  BET_HISTORY_OPEN_TAB,
  BET_HISTORY_SETTLED_TAB,
  BET_HISTORY_TABS,
} from "@/utils/betHistory";
import classNames from "classnames";
import moment from "moment";
import BetHistorySection from "./BetHistorySection";
import BetHistorySectionRow from "./BetHistorySectionRow";
import { EmptyState } from "@/components/emptyState/EmptyState";

import "../DepositLimit/DepositLimit.css";
import "./BetHistory.css";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";

const skeletonHeader = new Array(4).fill(0);

const BetHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [myBets, setMyBets] = useState([]);
  const [activeTab, setActiveTab] = useState(BET_HISTORY_TABS[0].value);

  const getMyBets = (type) => {
    gamingSocket.emit("my_bets", { value: type }, (response) => {
      if (response?.data) {
        if (response.data?.errorMessage) {
          alertToast({ message: response.data.errorMessage });
        } else {
          setMyBets(response.data);
        }
      }
      setIsLoading(false);
    });
  };

  const handleChangeTab = (value) => {
    setActiveTab(value);
    getMyBets(value);
  };

  useEffect(() => {
    getMyBets("all");
  }, []);

  const tabData = useMemo(
    () =>
      myBets.reduce((acc, val) => {
        // TODO: add date
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

      return <EmptyState message={`There are no ${text}bets !`} />;
    }

    return tabDates.map((date) => {
      const data = tabData[date];

      return (
        <div key={date}>
          <p className="betHistoryDate">{date}</p>
          {data.map((bet) => (
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
    });
  };

  return (
    <div className="depositLimit betHistoryBody">
      <div>
        <PreferencesTitle
          title="Bet History"
        />
        <div className="betHistoryMenuBar">
          {BET_HISTORY_TABS.map((tab) => (
            <Button
              key={tab.value}
              className={classNames("betHistoryMenu", {
                activeButton: activeTab === tab.value,
              })}
              onClick={() => handleChangeTab(tab.value)}
              text={
                <>
                  <Image src={tab.icon} alt="my-bet-tab" />
                  &nbsp; {tab.label}
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
              return (
                <React.Fragment key={index}>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "2rem", bgcolor: "#212536" }}
                    className="mt-2"
                    animation="wave"
                    width={250}
                  />
                  {skeletonHeader.map((__, headerIndex) => (
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1.2rem" }}
                      className="my-2"
                      animation="wave"
                      key={headerIndex}
                    />
                  ))}
                </React.Fragment>
              );
            })
          : renderTab()}
      </div>
    </div>
  );
};

export default BetHistory;
