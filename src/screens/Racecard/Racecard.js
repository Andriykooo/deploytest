"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MatchOdds } from "../../components/matches/MatchOdds";
import { TabsSelect } from "../../components/tabsSelect/TabsSelect";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { setBetSlipResponse, setSelectBet } from "@/store/actions";
import { images } from "@/utils/imagesConstant";
import { useSearchParams } from "next/navigation";
import { gamingSocket } from "@/context/socket";
import { v4 as uuidv4 } from "uuid";
import { EmptyState } from "@/components/emptyState/EmptyState";
import moment from "moment";
import { useClientTranslation } from "@/app/i18n/client";
import { Runner } from "@/components/racingWidget/Runner";
import { PriceHistory } from "./PriceHistory";
import { Place } from "./Place";
import { RacecardTable } from "./RaceCardTable";

export const Racecard = () => {
  const { t } = useClientTranslation(["racecard", "common"]);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const betTicker = useSelector((state) => state.betTicker);

  const resultedEvents = useSelector((state) => state.resultedEvents);
  const selectedPlayerBets = useSelector((state) => state.selectedBets);
  const raceCard = useSelector((state) => state.raceCard);
  const currentTime = useSelector((state) => state.currentTime);

  const day = searchParams.get("filter") || "today";
  const id = searchParams.get("id");

  const [selectedTab, setSelectedTab] = useState({ label: t("win_ew"), id: 1 });

  let defaultEvent;

  const event =
    raceCard?.events?.find((event) => {
      defaultEvent;
      if (!defaultEvent && event?.availabilities?.includes(day)) {
        defaultEvent = event;
      }

      return event?.event_id === id && event?.availabilities?.includes(day);
    }) || defaultEvent;

  const disablePrice =
    resultedEvents[event?.event_id] ||
    event?.resulted ||
    moment(event?.event_start_time)?.isBefore(currentTime);

  const hanldeSelect = (item, place) => {
    const { tricast, forecast, ...selectedBets } = { ...selectedPlayerBets };
    let temp = { ...selectedBets };

    if (betTicker?.data?.mode === "pending") {
      temp = { bets: [], stakes: [], action: "check" };
    }

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

    if (temp.bets.length === 0) {
      dispatch(
        setBetSlipResponse({
          singles: [],
          combinations: [],
          total_stakes: 0,
          total_payout: 0,
        })
      );
    }

    const new_bet = {
      bet_id: item?.bet_id,
      stake: 0,
      place,
      trading_status: item.trading_status,
      event_id: event?.event_id,
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
      head: t("1st"),
      dataKey: "sp",
      width: "70px",
      render: (item) => {
        return (
          <Place
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
      head: t("2nd"),
      dataKey: "sp",
      width: "70px",
      render: (item) => {
        return (
          <Place
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
      head: t("3rd"),
      dataKey: "sp",
      width: "70px",
      render: (item) => {
        return (
          <Place
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
      ] : []),
    {
      head: t("silk"),
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
      head: t("runner"),
      renderHead: (headItem) => {
        return <div className="runner">{headItem.head}</div>;
      },
      dataKey: "name",
      width: "1fr",
      render: (item) => {
        return <Runner data={item} />;
      },
    },
    ...forecastTricast,
    {
      head: t("any_order"),
      dataKey: "odds_decimal",
      width: "70px",
      render: (item) => {
        return (
          <Place
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
      label: t("win_ew"),
      id: 1,
    },
  ];

  if (event?.forecast) {
    predictionsTabs.push({
      label: t("forecast_tricast"),
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
            bet_id: event?.event_id,
            name: t("unnamed_favorite"),
            description: "-",
            odds_decimal: t("sp"),
            odds_fractional: t("sp"),
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
      head: t("silk"),
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
      head: t("runner"),
      renderHead: (headItem) => {
        return <div className="runner">{headItem.head}</div>;
      },
      dataKey: "name",
      width: "1fr",
      render: (item) => {
        return <Runner data={item} />;
      },
    },
    {
      head: t("weights"),
      dataKey: "weights",
      width: "70px",
      render: (item) => {
        return <div className="weights">{item.weights}</div>;
      },
    },
    ...(showPriceHistory
      ? [
        {
          head: t("price_history"),
          dataKey: "price_history",
          width: "128px",
          render: (item) => {
            return <PriceHistory item={item} />;
          },
        },
      ]
      : []),
    {
      head: t("price"),
      dataKey: "odds_decimal",
      width: "70px",
      render: (item) => {
        return (
          <div
            className={classNames("price", {
              ["pe-none"]: disablePrice,
            })}
          >
            <MatchOdds selection={{ ...item, event_id: event?.event_id }} />
          </div>
        );
      },
    },
    ...(!disablePrice
      ? [
        {
          head: t("sp"),
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
                    odds_decimal: t("sp"),
                    odds_fractional: t("sp"),
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
      value: event?.event_id,
    });

    return () => {
      gamingSocket.emit("unsubscribe_match", {
        value: event?.event_id,
        action_id: uuidv4(),
      });
    };
  }, []);

  return tableData ? (
    <>
      <TabsSelect
        data={predictionsTabs}
        placeholder={t("common:select_bet")}
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
    <EmptyState message={t("no_more_races_message", { day: day })} />
  );
};
