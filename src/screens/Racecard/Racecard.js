"use client";

import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Line, LineChart, XAxis } from "recharts";
import { Button } from "../../components/button/Button";
import { BetSelectedTypes } from "../../components/custom/BetSelectedTypes";
import { MatchOdds } from "../../components/matches/MatchOdds";
import { TabsSelect } from "../../components/tabsSelect/TabsSelect";
import { images } from "../../utils/imagesConstant";
import { ToggleLabel } from "../Notifications/ToggleLabel";
import "./Racecard.css";

const headerItemsWin = [
  {
    head: "#",
    dataKey: "runner_num",
    width: "40px",
  },
  {
    head: "Silk",
    dataKey: "silk_image",
    width: "50px",
    render: () => {
      return <Image src={images.silkImage} alt="silk" className="silk" />;
    },
  },
  {
    head: "Runner",
    renderHead: (headItem) => {
      return <div className="runner">{headItem.head}</div>;
    },
    dataKey: "runner",
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
  {
    head: "Price History",
    dataKey: "price_history",
    width: "128px",
    render: (item) => {
      return (
        <div className="price-history">
          <LineChart
            data={item.price_history.map((price) => {
              return {
                value: price?.value,
                name: price?.name,
              };
            })}
            height={48}
            width={92}
            margin={{
              right: 6,
              left: 6,
              bottom: 0,
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
        </div>
      );
    },
  },
  {
    head: "Price",
    dataKey: "odds",
    width: "70px",
    render: (item) => {
      item.odd = item.odds;
      return (
        <div className="price">
          <MatchOdds selection={item} />
        </div>
      );
    },
  },
  {
    head: "SP",
    dataKey: "sp",
    width: "70px",
    render: (item) => {
      return <div className="price">{item.sp}</div>;
    },
  },
];

const headerItemsForecast = [
  {
    head: "#",
    dataKey: "runner_num",
    width: "40px",
  },
  {
    head: "Silk",
    dataKey: "silk_image",
    width: "50px",
    render: () => {
      return <Image src={images.silkImage} alt="silk" className="silk" />;
    },
  },
  {
    head: "Runner",
    renderHead: (headItem) => {
      return <div className="runner">{headItem.head}</div>;
    },
    dataKey: "runner",
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
    head: "1st",
    dataKey: "1st",
    width: "70px",
    render: () => {
      return <div className="price">1st</div>;
    },
  },
  {
    head: "2nd",
    dataKey: "2nd",
    width: "70px",
    render: () => {
      return <div className="price">2nd</div>;
    },
  },
  {
    head: "3rd",
    dataKey: "3rd",
    width: "70px",
    render: () => {
      return <div className="price">3rd</div>;
    },
  },
  {
    head: "Any Order",
    dataKey: "any_order",
    width: "70px",
    render: () => {
      return <div className="price">Any</div>;
    },
  },
];

const RacecardTable = ({ headerData, data }) => {
  const router = useRouter();
  const gridColumns = headerData.map((item) => item.width).join(" ");

  useEffect(() => {
    if (!data) {
      router.back();
    }
  }, []);

  return data ? (
    <div className="race-table">
      <div className="race-table-head">
        <div className="race-table-head-title">
          {moment(data?.event_start_time).format("HH:mm")} {data?.event_venue}
        </div>
        <div className="race-table-head-subtitle">
          <span className="race-table-head-subtitle-event">
            {data?.event_name}
          </span>
          <span className="race-table-head-subtitle-description">
            {data?.event_description}
          </span>
        </div>
      </div>
      <div
        className="race-table-head-items"
        style={{ gridTemplateColumns: gridColumns }}
      >
        {headerData.map((item, index) => {
          return (
            <div key={index}>
              {item.renderHead ? item.renderHead(item) : item.head}
            </div>
          );
        })}
      </div>
      {data?.selections?.map((selection) => {
        return (
          <div
            key={selection.bet_id}
            className="race-table-row"
            style={{ gridTemplateColumns: gridColumns }}
          >
            {headerData.map((headItem, index) => {
              return (
                <div key={index} className="race-table-row-item">
                  {headItem.render
                    ? headItem.render(selection)
                    : selection[headItem.dataKey]}
                </div>
              );
            })}
          </div>
        );
      })}
      {/* <div className="race-table-non-runner">Non Runner</div>
          <div className="race-table-row disabled">
          <span className="race-table-row-item"></span>
      </div> */}
    </div>
  ) : null;
};

export const Racecard = () => {
  const router = useRouter();
  const data = useSelector((state) => state.raceCard);

  const [liveStreamIsActive, setLiveStreamIsActive] = useState(false);
  const [selectedTab, setSelectedTab] = useState({ label: "Win / Ew", id: 0 });

  const handleGoBack = () => {
    router.back();
  };

  const handleToggleLiveStream = () => {
    setLiveStreamIsActive(!liveStreamIsActive);
  };

  return (
    <div className="sports-body">
      <div className="racecardHeader">
        <div className="container-match-details-paragraph">
          <Button
            className={"goBackButton goBackButtonDetails"}
            onClick={handleGoBack}
            text={
              <>
                <Image src={images.goBackArrow} alt="" />
                <span className="ps-2">Go back</span>
              </>
            }
          />
          <div className="stream-container d-flex align-items-center">
            <Image
              src={images.playStreamIcon}
              className="playstreamIcon"
              alt="play stream icon"
            />
            <p className="stream-line ">Stream</p>
            <ToggleLabel
              type="push"
              key=""
              value={liveStreamIsActive}
              onToggle={handleToggleLiveStream}
            />
          </div>
        </div>
        {liveStreamIsActive && (
          <Image
            src={images.horseRacingLiveStream}
            alt="horse-racing"
            className="race-live-stream"
          />
        )}
        <div className="teams-for-matchdetails-container d-flex">
          <div className="racecard-type">{data?.event_venue}</div>
        </div>
      </div>
      <TabsSelect
        data={["Win / Ew", "Forecast / Tricast"].map((name, index) => ({
          label: name,
          id: index,
        }))}
        placeholder="Select bet"
        onChange={setSelectedTab}
      />
      {selectedTab.id === 0 && (
        <RacecardTable headerData={headerItemsWin} data={data} />
      )}
      {selectedTab.id === 1 && (
        <RacecardTable headerData={headerItemsForecast} data={data} />
      )}
      <BetSelectedTypes />
    </div>
  );
};
