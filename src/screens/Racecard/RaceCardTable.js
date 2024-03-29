"use client";

import { useSelector } from "react-redux";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { phaseStatus } from "@/utils/constants";
import { Button } from "@/components/button/Button";
import { getSelectionOdds } from "@/utils/getSelectionOdds";

export const RacecardTable = ({ headerData, data }) => {
  const t = useTranslations();

  const updatedSelections = useSelector((state) => state.selections);
  const updatedEvents = useSelector((state) => state.updatedEvents);

  const updatedEvent = updatedEvents?.[data?.event_id]?.data;
  const isResulted =
    updatedEvent?.current_status === phaseStatus.FINISHED || data?.resulted;
  const isAbandoned =
    updatedEvent?.current_status === phaseStatus.ABANDONED ||
    data?.event_status === phaseStatus.ABANDONED;
  const handicapRow = data?.handicap == "Y";

  let activeRunners = [];
  const nonRunners = [];

  data?.selections?.forEach((selection) => {
    if (
      selection.status === "active" ||
      selection.status === "pulledup" ||
      selection.status === "fell" ||
      selection.status === "broughtdown" ||
      selection.status === "jocky_change" ||
      selection.status === "reserve_runner"
    ) {
      activeRunners.push(selection);
    }

    if (
      selection.status == "norunner" ||
      selection.status == "withdrawn" ||
      selection.status == "vacant_trap"
    ) {
      nonRunners.push(selection);
    }
  });
  activeRunners = isResulted
    ? activeRunners.sort((a, b) => {
        const numA = parseInt(a.finish_num);
        const numB = parseInt(b.finish_num);

        // If both are numbers, sort by numeric value
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;

        // If one is a number and the other is not, number comes before non-number
        if (!isNaN(numA)) return -1;

        if (!isNaN(numB)) return 1;

        // If both are not numbers, sort "F" before "PU"
        if (a.finish_num === "F" && b.finish_num === "PU") {
          return -1; // "F" comes before "PU"
        } else if (a.finish_num === "PU" && b.finish_num === "F") {
          return 1; // "PU" comes after "F"
        }

        // If both are "F" or both are "PU", maintain their order
        return 0;
      })
    : activeRunners
        .map((selection) => {
          if (updatedSelections?.[selection?.bet_id]) {
            return {
              ...selection,
              ...updatedSelections?.[selection?.bet_id].data,
            };
          }

          return selection;
        })
        .sort((a, b) => {
          if (a.odds_decimal === "SP" && b.odds_decimal !== "SP") {
            return 1;
          } else if (a.odds_decimal !== "SP" && b.odds_decimal === "SP") {
            return -1;
          } else {
            const aPrice = getSelectionOdds(a).odds_decimal;
            const bPrice = getSelectionOdds(b).odds_decimal;

            return +aPrice - +bPrice;
          }
        });

  const renderNonRunners = (headItem, selection) => {
    if (headItem.render) {
      if (headItem.dataKey === "odds_decimal" || headItem.dataKey === "sp") {
        return t("racecard.nr");
      }
      return headItem.render(selection);
    }
    return selection[headItem.dataKey];
  };

  return data ? (
    <div className="race-table">
      <div className="race-table-head">
        <div className="race-table-head-title">
          <div className="race-table-head-title">{data?.event_venue}</div>
          <div className="race-table-head-subtitle">
            <span className="race-table-head-subtitle-event">
              {data?.event_description}
              {data.event_description && data.each_way && " | "}
              {data.each_way}
              {handicapRow ? " | Handicap" : ""}
            </span>
          </div>
        </div>
        {data.abandoned && (
          <Button
            disabled
            className="suspended-button-raceCard"
            text={t("common.suspended").toUpperCase()}
          />
        )}
        {data?.bog && (
          <span className="selected-bet-bog align-self-center">
            {t("common.bog")}
          </span>
        )}
      </div>
      {isResulted && !isAbandoned && (
        <div className="race-status">{t("racecard.race_result")}</div>
      )}
      {!isResulted &&
        (updatedEvent?.current_status === phaseStatus.IN_PLAY ||
          data?.event_status === phaseStatus.IN_PLAY) && (
          <div className="race-status">{t("racecard.race_in_progress")}</div>
        )}
      <div className="race-table-head-items-container">
        <div
          className="race-table-head-items"
          style={{
            gridTemplateColumns: headerData
              .filter((item) => !item?.hide)
              .map((item) => item.width)
              .join(" "),
          }}
        >
          {headerData?.map((item, index) => {
            return !item?.hide ? (
              <div key={index}>
                {item.renderHead ? item.renderHead(item) : item.head}
              </div>
            ) : null;
          })}
        </div>
        {activeRunners?.map((selection) => {
          const innerGridColumns = headerData
            .filter((item) => selection[item.dataKey] && !item?.hide)
            .map((item) => item.width)
            .join(" ");

          return (
            <div
              key={selection.bet_id}
              className="race-table-row"
              style={{ gridTemplateColumns: innerGridColumns }}
            >
              {headerData.map((headItem, index) => {
                return selection[headItem.dataKey] && !headItem?.hide ? (
                  <div
                    key={index}
                    className={classNames(
                      "race-table-row-item",
                      headItem?.className
                    )}
                  >
                    {headItem?.render(selection)}
                  </div>
                ) : null;
              })}
            </div>
          );
        })}
        {nonRunners.length > 0 && (
          <>
            <div className="race-table-non-runner">
              {t("racecard.non_runner")}
            </div>
            {nonRunners?.map((selection) => {
              const innerGridColumns = headerData
                .filter((item) => !item?.hide)
                .map((item) => item.width)
                .join(" ");
              return (
                <div
                  key={selection.bet_id}
                  className="race-table-row disabled"
                  style={{ gridTemplateColumns: innerGridColumns }}
                >
                  {headerData.map((headItem, index) => {
                    return !headItem?.hide ? (
                      <div
                        key={index}
                        className={classNames(
                          "race-table-row-item",
                          headItem?.className
                        )}
                      >
                        {renderNonRunners(headItem, selection)}
                      </div>
                    ) : null;
                  })}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  ) : null;
};
