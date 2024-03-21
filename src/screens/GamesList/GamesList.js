"use client";

import { useState, useEffect } from "react";
import "./GamesList.css";
import { GameListModal } from "./GameListModal";
import { CasinoPlayNow } from "@/components/modal/CasinoPlayNow";
import { useSelector } from "react-redux";

export const GamesList = ({ data }) => {
  const [game, setGame] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenGame, setIsOpenGame] = useState(false);
  const [numColumns, setNumColumns] = useState(4);

  const isTablet = useSelector((state) => state.isTablet);
  const isMobile = useSelector((state) => state.setMobile);

  const closeModal = () => {
    setIsOpenModal(false);
    setGame(null);
  };

  const openGameModal = (game) => {
    setGame(game);
    setIsOpenModal(true);
  };

  const closeGame = () => {
    setIsOpenGame(false);
    setGame(null);
  };

  const playGame = () => {
    setIsOpenGame(true);
    setIsOpenModal(false);
  };

  useEffect(() => {
    const calculateColumns = () => {
      let cols = 4;
      if (window.innerWidth <= 1400 && window.innerWidth > 1024) {
        cols = 3;
      } else if (isMobile) {
        cols = 1;
      } else if (isTablet) {
        cols = 2;
      }
      setNumColumns(cols);
    };

    calculateColumns();
    window.addEventListener("resize", calculateColumns);

    return () => window.removeEventListener("resize", calculateColumns);
  }, [isMobile, isTablet]);

  return game ? (
    (isOpenModal && (
      <GameListModal game={game} onClose={closeModal} playGame={playGame} />
    )) ||
      (isOpenGame && <CasinoPlayNow game={game} onClose={closeGame} />)
  ) : (
    <div className="games-container">
      <div className="game-list">
        {data?.map((item) => {
          const numGames = item.games?.length || 0;
          const numEmpty = numColumns - (numGames % numColumns);
          return (
            <div className="game-list-item" key={item.id + item.title}>
              <div className="games-list-title">
                <p>{item.title}</p>
              </div>
              <div className="games-list-content">
                {item.games?.map((game) => (
                  <div
                    className="game-title"
                    key={game.id + game.title}
                    onClick={() => openGameModal(game)}
                  >
                    <p>{game.title}</p>
                  </div>
                ))}
                {numGames &&
                  numColumns !== 1 &&
                  Array.from({ length: numEmpty }, (_, index) => (
                    <div
                      className="game-title empty-item"
                      key={`empty-${index}`}
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
