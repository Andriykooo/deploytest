"use client";

import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/socket";
import SkeletonComponent from "../../utils/SkeletonComponent";
import { HorseRacing } from "../HorseRacing/HorseRacing";
import { Sport } from "../Sport/Sport";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useParams } from "next/navigation";
import { setSportContent } from "@/store/actions";

const Sports = ({ slug }) => {
  const dispatch = useDispatch();
  const { gamingSocket } = useContext(SocketContext);
  const params = useParams();

  const isMobile = useSelector((state) => state.setMobile);
  const data = useSelector((state) => state.sportContent);
  const sportContent = data?.[slug];

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
        dispatch(setSportContent({ ...data, [slug]: response?.data }));
      }
    );
  }, []);

  return !sportContent ? (
    <SkeletonComponent isMobile={isMobile} />
  ) : (
    <div className="mainArticle">
      {slug === "horseracing" || slug === "greyhoundracing" ? (
        <HorseRacing sportContent={sportContent} slug={slug} />
      ) : (
        <Sport
          sportContent={sportContent}
          setSportContent={setSportContent}
          slug={slug}
        />
      )}
    </div>
  );
};

export default Sports;
