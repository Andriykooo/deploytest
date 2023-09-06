"use client";

import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/socket";
import SkeletonComponent from "../../utils/SkeletonComponent";
import { HorseRacing } from "../HorseRacing/HorseRacing";
import { Sport } from "../Sport/Sport";
import { uuid } from "uuidv4";
import { setUpdatedSelections } from "@/store/actions";
import moment from "moment";

const Sports = ({ slug }) => {
  const dispatch = useDispatch();
  const { gamingSocket } = useContext(SocketContext);
  const isMobile = useSelector((state) => state.setMobile);
  const language = useSelector((state) => state.language);
  const sports = useSelector((state) => state.sports);

  const sport = sports.find((currentSport) => currentSport.slug === slug);

  const [isLoading, setIsLoading] = useState(true);
  const [sportContent, setSportContent] = useState(null);

  useEffect(() => {
    if (sport?.id) {
      gamingSocket.emit("subscribe_sport", {
        value: sport?.id,
      });

      gamingSocket.on("selection_updated", (response) => {
        dispatch(setUpdatedSelections(response));
      });

      return () => {
        gamingSocket.off("selection_updated");

        gamingSocket.emit("unsubscribe_sport", {
          value: sport.id,
          action_id: uuid(),
        });
      };
    }
  }, [sport]);

  useEffect(() => {
    setSportContent(null);

    if (slug) {
      setIsLoading(true);

      gamingSocket?.emit(
        "sport_content",
        {
          value: slug,
          country: language?.code2,
          timezone: moment().utcOffset(),
        },
        (response) => {
          setSportContent(response?.data);
          setIsLoading(false);
        }
      );
    }
  }, [slug, language]);

  return isLoading ? (
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
