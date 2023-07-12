import React from "react";
import { ArrowDownIcon } from "../../utils/icons";
import { Game } from "../Game/Game";
import { Carousel } from "../carousel/Carousel";
import "./CasinoCategory.css";

const CasinoCategory = ({ data, onFavoriteToggle }) => {
  return data ? (
    <>
      <div className="mainGames">
        <div className="mainGamesContainer">
          <div className="mainGamesBox">
            <div className="d-flex justify-content-between w-100">
              <div className="recommendedTitle">{data.title}</div>
              {data.view_style !== "trending" && (
                <div className="recommendedTitle recommendedViewAll">
                  <span className="me-2">View All</span>
                  <ArrowDownIcon viewAll />
                </div>
              )}
            </div>

            {data.view_style === "trending" && (
              <Carousel arrowClassName="tranding-arrow">
                {data?.games?.map((game, index) => (
                  <Game
                    game={game}
                    key={game.id}
                    number={index + 1}
                    onFavoriteToggle={onFavoriteToggle}
                  />
                ))}
              </Carousel>
            )}
            {data.view_style === "single_line" && (
              <Carousel>
                {data?.games?.map((game) => (
                  <Game
                    game={game}
                    key={game.id}
                    onFavoriteToggle={onFavoriteToggle}
                  />
                ))}
              </Carousel>
            )}
            {data.view_style === "hero_multi_line" && (
              <Carousel>
                <Game
                  game={data.games[0]}
                  key={data.games[0].id}
                  className="hero-multi-line"
                  onFavoriteToggle={onFavoriteToggle}
                />
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
                            <Game
                              game={game}
                              key={game.id}
                              onFavoriteToggle={onFavoriteToggle}
                            />
                          ) : null
                        )}
                      </div>
                    );
                  })}
              </Carousel>
            )}
            {data.view_style === "multi_line" && (
              <Carousel>
                {data.games
                  .reduce((acc, val, index) => {
                    if (index % 2 === 0) {
                      acc.push([val, data.games[index + 1]]);
                    }
                    return acc;
                  }, [])
                  .map((row, index) => {
                    return (
                      <div key={index} className="hero-multi-line-item">
                        {row.map((game) =>
                          game ? (
                            <Game
                              game={game}
                              key={game.id}
                              onFavoriteToggle={onFavoriteToggle}
                            />
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
    </>
  ) : null;
};

export default CasinoCategory;
