"use client";

import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { useClientPathname } from "@/hooks/useClientPathname";
import { alertToast } from "@/utils/alert";
import { CasinoPlayNow } from "@/components/modal/CasinoPlayNow";
import { CasinoLogin } from "@/components/modal/CasinoLogin/CasinoLogin";
import "./GamesList.css";

export const GamesList = ({ data }) => {
  const [game, setGame] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOpenGame, setIsOpenGame] = useState(false);
  const [gameUrl, setGameUrl] = useState("");
  const loggedUser = useSelector((state) => state.loggedUser);
  const isMobile = useSelector((state) => state.setMobile);
  const { pathname } = useClientPathname();
  const router = useCustomRouter();
  const playGame = (game) => {
    setGame(game);
    if (!loggedUser) {
      router.push(`${pathname}?redirect=casino`);
      return setIsLoginOpen(true);
    }

    const payload = {
      game_id: game?.id,
      language: "en",
      platform: "WEB",
      minimode: isMobile ? "1" : "0",
      playMode: "LIVE",
    };

    apiServices
      .post(apiUrl.OPEN_CASINO_GAME, payload)
      .then((response) => {
        setGameUrl(response?.data?.gameURL);
        setIsOpenGame(true);
      })
      .catch((e) => {
        alertToast({ message: e.message });
      });
  };

  const closeGame = () => {
    setIsOpenGame(false);
    setGame(null);
  };

  const closeCasinoLogin = () => {
    setIsLoginOpen(false);
    router.push(pathname);
    setGame(null);
  };
  return (
    <div className="games-container">
      <div className="game-list">
        {data?.map((item) => {
          return (
            <div className="game-list-item" key={item.id + item.title}>
              <div className="games-list-title">{item.title}</div>
              <div className="games-list-content">
                {item.games?.map((game) => {
                  return (
                    <div
                      className="game-title"
                      key={game.id + game.title}
                      onClick={() => playGame(game)}
                    >
                      {game.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {isOpenGame && (
        <CasinoPlayNow gameUrl={gameUrl} game={game} setGame={closeGame} />
      )}
      {isLoginOpen && (
        <CasinoLogin onClose={closeCasinoLogin} bgImage={game?.web_image_url} />
      )}
    </div>
  );
};
