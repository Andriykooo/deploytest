import React, { useState } from "react";
import numberEightTrending from "../../assets/images/numberEightTrending.png";
import numberFiveTrending from "../../assets/images/numberFiveTrending.png";
import numberFourTrending from "../../assets/images/numberFourTrending.png";
import numberNineTrending from "../../assets/images/numberNineTrending.png";
import numberOneTrending from "../../assets/images/numberOneTrending.png";
import numberSevenTrending from "../../assets/images/numberSevenTrending.png";
import numberSixTrending from "../../assets/images/numberSixTrending.png";
import numberThreeTrending from "../../assets/images/numberThreeTRending.png";
import numberTwoTrending from "../../assets/images/numberTwoTrending.png";
import numberZeroTrending from "../../assets/images/numberZeroTrending.png";
import { ArrowDownIcon, LikeIcon } from "../../utils/icons";
import { Carousel } from "../carousel/Carousel";
import { CasinoPlayNow } from "../modal/CasinoPlayNow";
import Image from "next/image";

const trendingNumbers = {
  0: numberZeroTrending,
  1: numberOneTrending,
  2: numberTwoTrending,
  3: numberThreeTrending,
  4: numberFourTrending,
  5: numberFiveTrending,
  6: numberSixTrending,
  7: numberSevenTrending,
  8: numberEightTrending,
  9: numberNineTrending,
};

const TrendingNumber = ({ number }) => {
  return (
    <div className="numbering">
      {number
        .toString()
        .split("")
        .map((element, index) => {
          return (
            <Image key={index} src={trendingNumbers[element]} alt="number" />
          );
        })}
    </div>
  );
};

const CasinoCategory = ({ data }) => {
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [game, setGame] = useState(null);

  const openGame = (game) => {
    setGame(game);
  };

  const handleFavoriteGame = (id) => {
    setFavoriteGames(
      favoriteGames.includes(id)
        ? favoriteGames.filter((gameId) => gameId !== id)
        : [...favoriteGames, id]
    );
  };

  return data ? (
    <>
      <div className="mainGames">
        <div className="mainGamesContainer">
          <div className="mainGamesBox">
            <div className="d-flex justify-content-between w-100">
              <div className="recommendedTitle">{data.title}</div>
              {data.view_style !== "trending" && (
                <div className="recommendedTitle recommendedViewAll">
                  <span className="me-2">View all</span>
                  <ArrowDownIcon viewAll />
                </div>
              )}
            </div>

            {data.view_style === "trending" && (
              <Carousel>
                {data?.games?.map((game, index) => (
                  <div className="casino-item trending" key={game?.game_id}>
                    <TrendingNumber number={index + 1} />
                    <div className="gameImageWrapper">
                      <LikeIcon
                        className="likeGame"
                        active={favoriteGames.includes(game?.game_id)}
                        onClick={() => {
                          handleFavoriteGame(game?.game_id);
                        }}
                      />
                      <Image
                        className="casinoGame"
                        src={game?.image_url}
                        alt={game?.name}
                        onClick={() => openGame(game)}
                      />
                      <button
                        className="btnPrimary btnPlayNow"
                        onClick={() => openGame(game)}
                      >
                        Play Now
                      </button>
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
            {data.view_style === "single_line" && (
              <Carousel>
                {data?.games?.map((game) => (
                  <div className="casino-item" key={game?.game_id}>
                    <div className="gameImageWrapper">
                      <LikeIcon
                        className="likeGame"
                        active={favoriteGames.includes(game?.game_id)}
                        onClick={() => {
                          handleFavoriteGame(game?.game_id);
                        }}
                      />
                      <Image
                        className="casinoGame"
                        src={game?.image_url}
                        alt={game?.name}
                        onClick={() => openGame(game)}
                      />
                      <button
                        className="btnPrimary btnPlayNow"
                        onClick={() => openGame(game)}
                      >
                        Play Now
                      </button>
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
            {data.view_style === "hero_multi_line" && (
              <Carousel>
                <div className="casino-item hero-multi-line">
                  <LikeIcon
                    className="likeGame"
                    active={favoriteGames.includes(data.games[0]?.game_id)}
                    onClick={() => {
                      handleFavoriteGame(data.games[0]?.game_id);
                    }}
                  />
                  <Image
                    className="casinoGame"
                    src={data.games[0]?.image_url}
                    alt={data.games[0]?.name}
                    onClick={() => openGame(data.games[0])}
                  />
                  <button
                    className="btnPrimary btnPlayNow"
                    onClick={() => openGame(data.games[0])}
                  >
                    Play Now
                  </button>
                </div>
                {data.games
                  .slice(1)
                  .reduce((acc, val, index) => {
                    if (index % 2 === 0) {
                      acc.push([val, data.games[index + 2]]);
                    }
                    return acc;
                  }, [])
                  .map((row, index) => {
                    return (
                      <div key={index} className="hero-multi-line-item">
                        {row.map((game) =>
                          game ? (
                            <div className="casino-item" key={game?.game_id}>
                              <LikeIcon
                                className="likeGame"
                                active={favoriteGames.includes(game?.game_id)}
                                onClick={() => {
                                  handleFavoriteGame(game?.game_id);
                                }}
                              />
                              <Image
                                className="casinoGame"
                                src={game?.image_url}
                                alt={game?.name}
                                onClick={() => openGame(game)}
                              />
                              <button
                                className="btnPrimary btnPlayNow"
                                onClick={() => openGame(game)}
                              >
                                Play Now
                              </button>
                            </div>
                          ) : null
                        )}
                      </div>
                    );
                  })}
              </Carousel>
            )}
          </div>
        </div>
      </div>
      {game && <CasinoPlayNow game={game} setGame={setGame} />}
    </>
  ) : null;
};

export default CasinoCategory;
