"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SkeletonComponent from "../../utils/SkeletonComponent";
import { HorseRacing } from "../HorseRacing/HorseRacing";
import { Sport } from "../Sport/Sport";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useParams } from "next/navigation";
import { setSportContent } from "@/store/actions";
import { gamingSocket } from "@/context/socket";
import "./Sports.css";

const Sports = ({ slug }) => {
  const dispatch = useDispatch();
  const params = useParams();

  const isMobile = useSelector((state) => state.setMobile);
  const data = useSelector((state) => state.sportContent);
  const firstMarket = Object.values(data?.[slug] || [])?.[0]
    ?.market_options?.[0];

  const [isLoading, setIsLoading] = useState(!data[slug]);
  const [initialMarket, setInitialMarket] = useState(firstMarket);

  const isRacing = slug === "horseracing" || slug === "greyhoundracing";

  useEffect(() => {
    gamingSocket.emit("subscribe_sport", {
      value: slug,
    });

    return () => {
      gamingSocket.emit("unsubscribe_sport", {
        value: slug,
        action_id: uuidv4(),
      });
    };
  }, []);

  useEffect(() => {
    gamingSocket?.emit(
      "sport_content",
      {
        value: slug,
        country: params.lng,
        timezone: moment().utcOffset(),
      },
      (response) => {
        setIsLoading(false);
        const market = response.data.market_options[0];

        setInitialMarket(market);
        dispatch(
          setSportContent({
            ...data,
            [slug]: isRacing
              ? response?.data
              : {
                  ...data[slug],
                  [market.market_id]: response?.data,
                },
          })
        );
      }
    );
  }, []);

  return isLoading ? (
    <SkeletonComponent isMobile={isMobile} />
  ) : (
    <div className="mainArticle">
      {isRacing ? <HorseRacing /> : <Sport initialMarket={initialMarket} />}
    </div>
  );
};

export default Sports;
