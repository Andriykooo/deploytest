"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MatchOdds } from "../../components/matches/MatchOdds";
import { TabsSelect } from "../../components/tabsSelect/TabsSelect";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { images } from "@/utils/imagesConstant";
import { useParams, useSearchParams } from "next/navigation";
import { gamingSocket } from "@/context/socket";
import { v4 as uuidv4 } from "uuid";
import { EmptyState } from "@/components/emptyState/EmptyState";
import moment from "moment";
import { useTranslations } from "next-intl";
import { Runner } from "@/components/Runner/Runner";
import { PriceHistory } from "./PriceHistory";
import { Place } from "./Place";
import { RacecardTable } from "./RaceCardTable";
import { useGenerateBetslip } from "@/hooks/useGenerateBetslip";
import { setRaceCard } from "@/store/actions";
import { apiUrl, phaseStatus } from "@/utils/constants";
import { apiServices } from "@/utils/apiServices";
import { useCustomRouter } from "@/hooks/useCustomRouter";

import "./Racecard.css";

export const Racecard = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useCustomRouter();
  const dispatch = useDispatch();

  const [hasForeacastImage, setHasForecastImage] = useState(true);
  const [hasWinEwImage, setHasWinEwImage] = useState(true);

  const betTicker = useSelector((state) => state.betTicker);
  const selectedPlayerBets = useSelector((state) => state.selectedBets);
  const data = useSelector((state) => state.raceCard);
  const isMobile = useSelector((state) => state.setMobile);
  const updatedEvents = useSelector((state) => state.updatedEvents);

  const generateBets = useGenerateBetslip();
  const raceCard = data?.[params.venue];

  const day = searchParams.get("filter") || "today";
  const id = searchParams.get("id");

  const isGreyHoundRacing = params.slug === "greyhoundracing";
  const [selectedTab, setSelectedTab] = useState({
    label: t("racecard.win_ew"),
    id: 1,
  });
  const [enablePriceHistory, setEnablePriceHistory] = useState(false);

  let defaultEvent;

  const event =
    raceCard?.events?.find((event) => {
      if (!defaultEvent && event?.availabilities?.includes(day)) {
        defaultEvent = event;
      }

      return event?.event_id === id && event?.availabilities?.includes(day);
    }) || defaultEvent;
  const updatedEvent = updatedEvents?.[event?.event_id]?.data;
  const isAbandoned =
    (updatedEvent?.current_status || event?.event_status) ===
    phaseStatus.ABANDONED;
  const isResulted =
    (updatedEvent?.current_status || event?.event_status) ===
    phaseStatus.FINISHED;
  const inPlay =
    (updatedEvent?.current_status || event?.event_status) ===
    phaseStatus.IN_PLAY;

  const disablePrice = isResulted || inPlay;

  useEffect(() => {
    if (
      updatedEvent?.current_status === phaseStatus.ABANDONED ||
      updatedEvent?.current_status === phaseStatus.FINISHED
    ) {
      apiServices
        .get(apiUrl.GET_VENUE_EVENTS, {
          value: decodeURI(params.venue),
          sport_slug: params.slug,
        })
        .then((response) => {
          dispatch(setRaceCard({ ...data, [params.venue]: response }));
        });
    }
  }, [updatedEvent]);

  useEffect(() => {
    if (id) {
      const event = raceCard?.events.find(({ event_id }) => event_id === id);

      if (event) {
        const date = event?.event_start_time;
        const day =
          (moment(date)?.isSame(moment(), "day") && "today") ||
          (moment(date)?.isSame(moment().add(1, "days"), "day") && "tomorrow");

        if (day) {
          router.push(
            `/racecard/${params.slug}/${params.venue}?id=${id}&filter=${day}`
          );
        }
      }
    }
  }, [id]);

  const hanldeSelect = (item, place) => {
    // eslint-disable-next-line
    const { tricast, forecast, ...selectedBets } = { ...selectedPlayerBets };
    let temp = { ...selectedBets };

    if (betTicker?.data?.mode === "pending") {
      temp = { singles: [], stakes: [], action: "check" };
    }

    let exist = false;
    let racingBetsCounter = 0;

    temp.singles.forEach((bet) => {
      if (bet.place) {
        racingBetsCounter++;
      }

      if (item.bet_id === bet.bet_id) {
        temp.singles = temp.singles.filter((bet) => item.bet_id !== bet.bet_id);
        racingBetsCounter--;
        exist = true;
      }
    });

    if (temp.singles.length === 0) {
      generateBets({
        singles: [],
        combinations: [],
        total_stakes: 0,
        total_payout: 0,
      });
    }

    const new_bet = {
      ...item,
      stake: 0,
      place,
      event_id: event?.event_id,
      description: "Race Winner",
      match_name: `${moment(event.event_start_time).utc().format("HH:mm")} ${
        event.event_venue
      }`,
    };

    if (racingBetsCounter === 1) {
      temp.forecast = true;
    }

    if (racingBetsCounter === 2) {
      temp.tricast = true;
    }

    if (!exist) {
      temp.singles.push(new_bet);
    }

    generateBets(temp);
  };

  const forecastTricast = [
    {
      head: t("racecard.1st"),
      dataKey: "sp",
      width: isMobile ? "57px" : "70px",
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
      head: t("racecard.2nd"),
      dataKey: "sp",
      width: isMobile ? "57px" : "70px",
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
      head: t("racecard.3rd"),
      dataKey: "sp",
      width: isMobile ? "57px" : "70px",
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
            width: "57px",
            className: "",
            render: (item) => {
              const { finish_num } = item;
              return <div className="finish-num">{finish_num}</div>;
            },
          },
        ]
      : []),
    {
      head: isGreyHoundRacing ? t("racecard.trap") : t("racecard.silk"),
      dataKey: "silk_image",
      width: isMobile ? "44px" : "50px",
      className: "",
      render: (item) => {
        return hasForeacastImage ? (
          <Image
            src={item.silk_image}
            alt="slik"
            onError={() => {
              setHasForecastImage(false);
            }}
            height={20}
            width={20}
          />
        ) : (
          <Image
            src={images.unnamedFavorite}
            alt="slik"
            height={20}
            width={20}
          />
        );
      },
    },
    {
      head: t("racecard.runner"),
      renderHead: (headItem) => {
        return <div className="runner">{headItem.head}</div>;
      },
      dataKey: "name",
      width: "1fr",
      render: (item) => {
        return <Runner data={item} slug={params.slug} />;
      },
    },
    ...forecastTricast,
    ...(!isMobile
      ? [
          {
            head: t("racecard.any_order"),
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
        ]
      : []),
  ];

  const predictionsTabs = [
    {
      label: t("racecard.win_ew"),
      id: 1,
    },
  ];

  if (event?.forecast && !isResulted) {
    predictionsTabs.push({
      label: t("racecard.forecast_tricast"),
      id: 2,
    });
  }

  const tableData =
    event && !disablePrice
      ? {
          ...event,
          abandoned: isAbandoned,
          selections: [
            ...event.selections,
            {
              bet_id: event?.event_id,
              name: t("racecard.unnamed_favorite"),
              description: "-",
              odds_decimal: t("racecard.sp"),
              odds_fractional: t("racecard.sp"),
              runner_num: "?",
              silk_image: images.unnamedFavorite,
              status: "active",
              trading_status: "unnamed_favorite",
            },
          ],
        }
      : { ...event, abandoned: isAbandoned };

  const showPriceHistory =
    tableData?.selections?.some((item) => !!item.price_history?.length) ||
    enablePriceHistory;
  !disablePrice;

  const headerItemsWinEw = [
    {
      head: "",
      dataKey: "finish_num",
      width: "57px",
      render: (item) => {
        const { finish_num } = item;
        return <div className="finish-num">{finish_num}</div>;
      },
      hide: !disablePrice,
    },
    {
      head: isGreyHoundRacing ? t("racecard.trap") : t("racecard.silk"),
      dataKey: "silk_image",
      width: isMobile ? "44px" : "50px",
      render: (item) => {
        return hasWinEwImage ? (
          <Image
            src={item.silk_image}
            alt="slik"
            onError={() => {
              setHasWinEwImage(false);
            }}
            height={20}
            width={20}
          />
        ) : (
          <Image
            src={images.unnamedFavorite}
            alt="slik"
            height={20}
            width={20}
          />
        );
      },
    },
    {
      head: t("racecard.runner"),
      renderHead: (headItem) => {
        return <div className="runner">{headItem.head}</div>;
      },
      dataKey: "name",
      width: "1fr",
      render: (item) => {
        return <Runner data={item} slug={params.slug} />;
      },
    },
    {
      head: t("racecard.weights"),
      dataKey: "weights",
      width: "70px",
      render: (item) => {
        return (
          <div className={classNames({ abandoned: isAbandoned })}>
            <div className="weights">{item.weights}</div>
          </div>
        );
      },
      hide: isMobile || isGreyHoundRacing,
    },
    {
      head: t("racecard.price_history"),
      dataKey: "price_history",
      width: isMobile ? "90px" : "128px",
      render: (item) => {
        return (
          <PriceHistory
            className={classNames({ abandoned: isAbandoned })}
            item={item}
          />
        );
      },
      hide: !showPriceHistory || (isMobile && isResulted),
    },
    {
      head: t("racecard.price"),
      dataKey: "odds_decimal",
      width: isMobile ? "57px" : "70px",
      render: (item) => {
        return (
          <div
            className={classNames("price", {
              ["pe-none"]: disablePrice || isAbandoned,
              abandoned: isAbandoned,
            })}
          >
            <MatchOdds
              onUpdate={() => {
                setEnablePriceHistory(true);
              }}
              disableUpdate={disablePrice}
              disable={disablePrice}
              selection={{
                ...item,
                description: "Race Winner",
                match_name: `${moment(event.event_start_time)
                  .utc()
                  .format("HH:mm")} ${event.event_venue}`,
                trading_status: disablePrice ? "open" : item.trading_status,
                event_id: event?.event_id,
                odds_decimal: item.odds_decimal,
                odds_fractional: item.odds_fractional,
              }}
            />
          </div>
        );
      },
    },
    ...(!isMobile && !disablePrice
      ? [
          {
            head: t("racecard.sp"),
            dataKey: "sp",
            width: isMobile ? "57px" : "70px",
            render: (item) => {
              return (
                <div
                  className={classNames("price", {
                    ["pe-none"]: disablePrice || isAbandoned,
                    abandoned: isAbandoned,
                  })}
                >
                  <MatchOdds
                    disableUpdate
                    disable={disablePrice}
                    selection={{
                      ...item,
                      odds_decimal: t("racecard.sp"),
                      odds_fractional: t("racecard.sp"),
                    }}
                  />
                </div>
              );
            },
          },
        ]
      : []),

    // !disablePrice
    // ? [
    //     {
    //       head: t("racecard.sp"),
    //       dataKey: "sp",
    //       width: isMobile ? "57px" : "70px",
    //       render: (item) => {
    //         return (
    //           <div
    //             className={classNames("price", {
    //               ["pe-none"]: disablePrice,
    //             })}
    //           >
    //             <MatchOdds
    //               disableUpdate
    //               disable={disablePrice}
    //               selection={{
    //                 ...item,
    //                 odds_decimal: t("racecard.sp"),
    //                 odds_fractional: t("racecard.sp"),
    //               }}
    //             />
    //           </div>
    //         );
    //       },
    //     },
    //   ]
    // : []
  ];

  useEffect(() => {
    gamingSocket.on("connection", () => {
      gamingSocket.emit("subscribe_match", {
        value: event?.event_id,
      });
    });
  }, []);

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
  }, [event?.event_id]);

  return tableData ? (
    <>
      {tableData?.selections?.length > 0 ? (
        <>
          <TabsSelect
            data={predictionsTabs}
            placeholder={t("common.select_market_type")}
            onChange={setSelectedTab}
            variant="fullWidth"
            withBtns
          />
          {selectedTab.id === 1 && (
            <RacecardTable headerData={headerItemsWinEw} data={tableData} />
          )}
          {selectedTab.id === 2 && event?.forecast && (
            <RacecardTable headerData={headerItemsForecast} data={tableData} />
          )}
        </>
      ) : (
        <EmptyState
          message={t("racecard.no_more_races_message", { day: day })}
        />
      )}
    </>
  ) : null;
};
