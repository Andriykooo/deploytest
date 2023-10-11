"use client";

import { useSelector } from "react-redux";
import classNames from "classnames";
import moment from "moment";
import { useClientTranslation } from "@/app/i18n/client";

export const RacecardTable = ({ headerData, data }) => {
  const { t } = useClientTranslation("racecard");
  const gridColumns = headerData.map((item) => item.width).join(" ");
  const currentTime = useSelector((state) => state.currentTime);
  const resultedEvents = useSelector((state) => state.resultedEvents);
  const isResulted = resultedEvents[data?.event_id] || data?.resulted;

  const activeRunners = [];
  const nonRunners = [];

  const selections = isResulted
    ? data.selections.sort((a, b) => {
        if (!a.finish_num && b.finish_num) {
          return 1;
        }

        if (a.finish_num && !b.finish_num) {
          return -1;
        }

        if (!a.finish_num && !b.finish_num) {
          return 0;
        }

        return a.finish_num - b.finish_num;
      })
    : data.selections;

  selections?.forEach((selection) => {
    if (
      selection.status === "active" ||
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

  return data ? (
    <div className="race-table">
      <div className="race-table-head">
        <div className="race-table-head-title">{data?.event_venue}</div>
        <div className="race-table-head-subtitle">
          <span className="race-table-head-subtitle-event">
            {data?.event_name}
          </span>
          <span className="race-table-head-subtitle-description">
            {data?.event_description}
          </span>
        </div>
      </div>
      {isResulted && <div className="race-status">{t("race_result")}</div>}
      {!isResulted && moment(data.event_start_time).isBefore(currentTime) && (
        <div className="race-status">{t("race_in_progress")}</div>
      )}
      <div className="race-table-head-items-container">
        <div
          className="race-table-head-items"
          style={{
            gridTemplateColumns: headerData.map((item) => item.width).join(" "),
          }}
        >
          {headerData?.map((item, index) => {
            return (
              <div key={index}>
                {item.renderHead ? item.renderHead(item) : item.head}
              </div>
            );
          })}
        </div>
        {activeRunners?.map((selection) => {
          const innerGridColumns = headerData
            .filter((item) => selection[item.dataKey])
            .map((item) => item.width)
            .join(" ");

          return (
            <div
              key={selection.bet_id}
              className="race-table-row"
              style={{ gridTemplateColumns: innerGridColumns }}
            >
              {headerData.map((headItem, index) => {
                return selection[headItem.dataKey] ? (
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
            <div className="race-table-non-runner">{t("non_runner")}</div>
            {nonRunners?.map((selection) => {
              return (
                <div
                  key={selection.bet_id}
                  className="race-table-row disabled"
                  style={{ gridTemplateColumns: gridColumns }}
                >
                  {headerData.map((headItem, index) => {
                    return (
                      <div
                        key={index}
                        className={classNames(
                          "race-table-row-item",
                          headItem?.className
                        )}
                      >
                        {headItem.render
                          ? headItem.render(selection)
                          : selection[headItem.dataKey]}
                      </div>
                    );
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
