"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Line, LineChart, XAxis } from "recharts";
import { MatchOdds } from "../../components/matches/MatchOdds";
import { TabsSelect } from "../../components/tabsSelect/TabsSelect";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { formatOdd } from "@/utils/global";
import { setSelectBet, setUpdatedSelections } from "@/store/actions";
import { images } from "@/utils/imagesConstant";
import { useSearchParams } from "next/navigation";
import { gamingSocket } from "@/context/socket";
import { v4 as uuidv4 } from "uuid";
import { EmptyState } from "@/components/emptyState/EmptyState";
import moment from "moment";

const PriceHistory = ({ item }) => {
  const user = useSelector((state) => state.loggedUser);
  const format = user?.user_data?.settings?.odds_format;

  const data = item?.price_history?.slice(-3)?.map((price) => {
    const odd = formatOdd(price, format);

    return {
      value: +price?.value,
      name: odd,
    };
  });

  return (
    <div className="price-history">
      {item?.price_history && (
        <LineChart
          data={data}
          height={32}
          width={107}
          margin={{
            top: 5,
            right: 12,
            left: 12,
            bottom: -16,
          }}
        >
          <XAxis
            interval={0}
            axisLine={false}
            tickLine={false}
            dataKey={"name"}
            tick={{ fill: "#ffffff", fontSize: 8 }}
          />
          <Line
            isAnimationActive={false}
            type="linear"
            dataKey="value"
            stroke="#BC9239"
            strokeWidth={1}
            r={4}
            fill="#BC9239"
          />
        </LineChart>
      )}
    </div>
  );
};

const RacecardTable = ({ headerData, data }) => {
  const gridColumns = headerData.map((item) => item.width).join(" ");
  const currentTime = useSelector((state) => state.currentTime);
  const resultedEvents = useSelector((state) => state.resultedEvents);
  const isResulted = resultedEvents?.includes(data?.event_id) || data?.resulted;

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
      {isResulted && <div className="race-status">Race result</div>}
      {!isResulted && moment(data.event_start_time).isBefore(currentTime) && (
        <div className="race-status">Race in progress</div>
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
            <div className="race-table-non-runner">Non Runner</div>
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

const places = {
  1: "1st",
  2: "2nd",
  3: "3rd",
  any: "Any",
};

const Price = ({ item, place, onClick, disable, eventId }) => {
  const selectedPlayerBets = useSelector((state) => state.selectedBets);

  let selectionType;
  let eventIdInBetslip;

  const selectedItem = selectedPlayerBets.bets.find((element) => {
    if (!eventIdInBetslip) {
      eventIdInBetslip = element.event_id;
    }

    if (element.place === "any") {
      selectionType = "any";
      return element.bet_id === item.bet_id && element.place === place;
    }

    if (element.place === 1 || element.place === 2 || element.place === 3) {
      selectionType = "place";
      return element.bet_id === item.bet_id || element.place === place;
    }

    selectionType = "place";
    return element.bet_id === item.bet_id;
  });

  const currentPlaceIsSelected =
    selectedItem?.place === place && selectedItem?.bet_id !== item.bet_id;

  const currentRunnerIsSelected =
    selectedItem?.place !== place && selectedItem?.bet_id === item.bet_id;

  const selectionIsAny = selectionType === "place" && place === "any";
  const selectionsIsNotAny = selectionType === "any" && place !== "any";

  return (
    <div
      className={classNames("price", {
        ["pe-none"]: disable,
        disable:
          (eventIdInBetslip ? eventIdInBetslip !== eventId : false) ||
          (selectionType === "place"
            ? currentPlaceIsSelected ||
              currentRunnerIsSelected ||
              selectionIsAny
            : selectionsIsNotAny),
        active:
          selectedItem?.place === place && selectedItem?.bet_id === item.bet_id,
      })}
      onClick={() => onClick(item, place)}
    >
      {places[place]}
    </div>
  );
};

export const Racecard = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const resultedEvents = useSelector((state) => state.resultedEvents);
  const selectedPlayerBets = useSelector((state) => state.selectedBets);
  const raceCard = useSelector((state) => state.raceCard);
  const currentTime = useSelector((state) => state.currentTime);

  const day = searchParams.get("filter");
  const id = searchParams.get("id");

  const [selectedTab, setSelectedTab] = useState({ label: "Win / Ew", id: 1 });

  const event =
    raceCard?.events?.find(
      (event) => event.event_id === +id && event?.availabilities?.includes(day)
    ) || raceCard?.events[0];

  const disablePrice =
    resultedEvents?.includes(event?.event_id) ||
    event?.resulted ||
    moment(event?.event_start_time)?.isBefore(currentTime);

  const hanldeSelect = (item, place) => {
    const { tricast, forecast, ...temp } = { ...selectedPlayerBets };

    let exist = false;
    let racingBetsCounter = 0;

    temp.bets.forEach((bet) => {
      if (bet.place) {
        racingBetsCounter++;
      }

      if (item.bet_id === bet.bet_id) {
        temp.bets = temp.bets.filter((bet) => item.bet_id !== bet.bet_id);
        racingBetsCounter--;
        exist = true;
      }
    });

    const new_bet = {
      bet_id: item?.bet_id,
      stake: 0,
      place,
      trading_status: item.trading_status,
      event_id: event.event_id,
    };

    if (racingBetsCounter === 1) {
      temp.forecast = true;
    }

    if (racingBetsCounter === 2) {
      temp.tricast = true;
    }

    if (!exist) {
      temp.bets.push(new_bet);
    }

    dispatch(setSelectBet(temp));
  };

  const forecastTricast = [
    {
      head: "1st",
      dataKey: "sp",
      width: "70px",
      render: (item) => {
        return (
          <Price
            item={item}
            place={1}
            onClick={hanldeSelect}
            disable={disablePrice}
            eventId={event?.event_id}
          />
        );
      },
    },
    {
      head: "2nd",
      dataKey: "sp",
      width: "70px",
      render: (item) => {
        return (
          <Price
            item={item}
            place={2}
            onClick={hanldeSelect}
            disable={disablePrice}
            eventId={event?.event_id}
          />
        );
      },
    },
  ];

  if (event?.tricast) {
    forecastTricast.push({
      head: "3rd",
      dataKey: "sp",
      width: "70px",
      render: (item) => {
        return (
          <Price
            item={item}
            place={3}
            onClick={hanldeSelect}
            disable={disablePrice}
            eventId={event?.event_id}
          />
        );
      },
    });
  }

  const headerItemsForecast = [
    ...(disablePrice
      ? [
          {
            head: "",
            dataKey: "finish_num",
            width: "40px",
            className: "border-end-0",
            render: (item) => {
              return <div className="finish-num">{item.finish_num}</div>;
            },
          },
        ]
      : []),
    {
      head: "#",
      dataKey: "runner_num",
      width: "40px",
      className: "border-end-0",
      render: (item) => (
        <div>
          <div>{item.runner_num}</div>
          {item.stale_num && <div>({item.stale_num})</div>}
        </div>
      ),
    },
    {
      head: "Silk",
      dataKey: "silk_image",
      width: "50px",
      className: "border-end-0",
      render: (item) => {
        return (
          <Image
            src={item.silk_image}
            alt="silk"
            className="silk"
            height={14}
            width={18}
          />
        );
      },
    },
    {
      head: "Runner",
      renderHead: (headItem) => {
        return <div className="runner">{headItem.head}</div>;
      },
      dataKey: "name",
      width: "1fr",
      render: (item) => {
        return (
          <div className="runner">
            <div className="race-table-head-title row-title">{item.name}</div>
            <div className="race-table-head-subtitle-description">
              {item.description}
            </div>
          </div>
        );
      },
    },
    ...forecastTricast,
    {
      head: "Any Order",
      dataKey: "odds_decimal",
      width: "70px",
      render: (item) => {
        return (
          <Price
            item={item}
            place={"any"}
            onClick={hanldeSelect}
            disable={disablePrice}
            eventId={event?.event_id}
          />
        );
      },
    },
  ];

  const predictionsTabs = [
    {
      label: "Win / Ew",
      id: 1,
    },
  ];

  if (event?.forecast) {
    predictionsTabs.push({
      label: "Forecast / Tricast",
      id: 2,
    });
  }

  const tableData =
    event && !disablePrice
      ? {
          ...event,
          selections: [
            ...event?.selections,
            {
              bet_id: id,
              name: "Unnamed Favorite",
              description: "-",
              odds_decimal: "SP",
              runner_num: "?",
              silk_image: images.unnamedFavorite,
              status: "active",
              trading_status: "unnamed_favorite",
            },
          ],
        }
      : event;

  const showPriceHistory =
    tableData?.selections?.some((item) => !!item.price_history?.length) &&
    !disablePrice;

  const headerItemsWinEw = [
    ...(disablePrice
      ? [
          {
            head: "",
            dataKey: "finish_num",
            width: "40px",
            className: "border-end-0",
            render: (item) => {
              return <div className="finish-num">{item.finish_num}</div>;
            },
          },
        ]
      : []),
    {
      head: "#",
      dataKey: "runner_num",
      width: "40px",
      className: "border-end-0",
      render: (item) => {
        return (
          <div>
            <div>{item.runner_num}</div>
            {item.stale_num && <div>({item.stale_num})</div>}
          </div>
        );
      },
    },
    {
      head: "Silk",
      dataKey: "silk_image",
      width: "50px",
      className: "border-end-0",
      render: (item) => {
        return (
          <Image
            src={item.silk_image}
            alt="silk"
            className="silk"
            height={14}
            width={18}
          />
        );
      },
    },
    {
      head: "Runner",
      renderHead: (headItem) => {
        return <div className="runner">{headItem.head}</div>;
      },
      dataKey: "name",
      width: "1fr",
      render: (item) => {
        return (
          <div className="runner">
            <div className="race-table-head-title row-title">{item.name}</div>
            <div className="race-table-head-subtitle-description">
              {item.description}
            </div>
          </div>
        );
      },
    },
    {
      head: "Weights",
      dataKey: "weights",
      width: "70px",
      render: (item) => {
        return <div className="weights">{item.weights}</div>;
      },
    },
    ...(showPriceHistory
      ? [
          {
            head: "Price History",
            dataKey: "price_history",
            width: "128px",
            render: (item) => {
              return <PriceHistory item={item} />;
            },
          },
        ]
      : []),
    {
      head: "Price",
      dataKey: "odds_decimal",
      width: "70px",
      render: (item) => {
        return (
          <div
            className={classNames("price", {
              ["pe-none"]: disablePrice,
            })}
          >
            <MatchOdds selection={item} disable={disablePrice} />
          </div>
        );
      },
    },
    ...(!disablePrice
      ? [
          {
            head: "SP",
            dataKey: "sp",
            width: "70px",
            render: (item) => {
              return (
                <div
                  className={classNames("price", {
                    ["pe-none"]: disablePrice,
                  })}
                >
                  <MatchOdds
                    disable={disablePrice}
                    selection={{
                      ...item,
                      odds_decimal: "SP",
                    }}
                  />
                </div>
              );
            },
          },
        ]
      : []),
  ];

  useEffect(() => {
    gamingSocket.emit("subscribe_match", {
      value: id,
    });

    gamingSocket.on("selection_updated", (response) => {
      dispatch(setUpdatedSelections(response));
    });

    return () => {
      gamingSocket.off("selection_updated");

      gamingSocket.emit("unsubscribe_match", {
        value: id,
        action_id: uuidv4(),
      });
    };
  }, []);

  return tableData ? (
    <>
      <TabsSelect
        data={predictionsTabs}
        placeholder="Select bet"
        onChange={setSelectedTab}
        variant="fullWidth"
      />
      {selectedTab.id === 1 && (
        <RacecardTable headerData={headerItemsWinEw} data={tableData} />
      )}
      {selectedTab.id === 2 && event?.forecast && (
        <RacecardTable headerData={headerItemsForecast} data={tableData} />
      )}
    </>
  ) : (
    <EmptyState message={`No more races for ${day}!`} />
  );
};
