"use client";

import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BetSelectedTypes } from "../../components/custom/BetSelectedTypes";
import { EmptyState } from "../../components/emptyState/EmptyState";
import { SocketContext } from "../../context/socket";
import SkeletonComponent from "../../utils/SkeletonComponent";
import { HorseRacing } from "../HorseRacing/HorseRacing";
import { Sport } from "../Sport/Sport";

const Sports = ({ slug }) => {
  const { gamingSocket } = useContext(SocketContext);
  const isMobile = useSelector((state) => state.setMobile);
  const language = useSelector((state) => state.language);

  const [isLoading, setIsLoading] = useState(true);
  const [sportContent, setSportContent] = useState(null);

  useEffect(() => {
    setSportContent(null);

    if (slug) {
      setIsLoading(true);

      gamingSocket?.emit(
        "sport_content",
        {
          value: slug,
          country: language?.code2,
        },
        (response) => {
          setSportContent(response?.data);
          setIsLoading(false);
        }
      );
    }
  }, [slug, language]);

  return (
    <>
      {isLoading ? (
        <SkeletonComponent isMobile={isMobile} />
      ) : (
        <>
          {!sportContent ? (
            <div className="mainArticle">
              <EmptyState
                message={"There are no games available at the moment!"}
              />
            </div>
          ) : (
            <div className="mainArticle">
              {slug === "horseracing" ? (
                <HorseRacing sportContent={sportContent} />
              ) : (
                <Sport
                  sportContent={sportContent}
                  setSportContent={setSportContent}
                  slug={slug}
                />
              )}
              <BetSelectedTypes />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Sports;
