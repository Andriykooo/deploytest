import React, { useState } from "react";
import CasinoCategory from "../casinoCategory/CasinoCategory";
import CasinoMenu from "../casinoMenu/CasinoMenu";
import { Game } from "@/components/Game/Game";
import { useSelector } from "react-redux";

const CasinoGames = ({ data }) => {
  const [search, setSearch] = useState("");
  const category = useSelector((state) => state.casinoCategory);
  const isTablet = useSelector((state) => state.isTablet);

  const favoriteGames = useSelector((state) => state.favouriteGames);

  const casinoGames = [
    {
      id: 0,
      title: "Favorite Games",
      view_style: "single_line",
      games: Object.values(favoriteGames).filter((game) =>
        game?.title?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    },
    ...data,
  ];

  return (
    <>
      <CasinoMenu
        data={casinoGames}
        search={search}
        setSearch={setSearch}
        category={category}
      />
      <div className="sportsBackground pb-4">
        {category ? (
          <div className="categoryWrapper">
            <div className="categoryTitle">{category?.title}</div>
            <div className="categoryGrid">
              {category.games
                .filter((game) =>
                  game?.title?.toLowerCase()?.includes(search?.toLowerCase())
                )
                .map((game, index) => {
                  if (isTablet) {
                    const nextGame = category.games[index + 1];
                    return (
                      <div
                        key={`${game.id}-${nextGame?.id}`}
                        className="hero-multi-line-item"
                      >
                        <Game game={game} />
                        {nextGame && <Game game={nextGame} />}
                      </div>
                    );
                  }
                  if (index === 0 || (index + 1) % 11 === 0) {
                    return (
                      <Game
                        game={game}
                        key={game.id}
                        width={418}
                        height={390}
                        className="hero-multi-line"
                      />
                    );
                  } else if (index % 2 === 1) {
                    const nextGame = category.games[index + 1];
                    return (
                      <div
                        key={`${game.id}-${nextGame?.id}`}
                        className="hero-multi-line-item"
                      >
                        <Game game={game} />
                        {nextGame && <Game game={nextGame} />}
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          </div>
        ) : (
          casinoGames
            ?.filter(
              (casinoCategory) => !category || category.id === casinoCategory.id
            )
            ?.map((casinoCategory) => {
              const filteredCategory = {
                ...casinoCategory,
                games: casinoCategory?.games?.filter((game) =>
                  game?.title?.toLowerCase()?.includes(search?.toLowerCase())
                ),
              };

              return filteredCategory?.games?.length > 0 ? (
                <CasinoCategory
                  key={filteredCategory?.id}
                  data={filteredCategory}
                />
              ) : null;
            })
        )}
      </div>
    </>
  );
};

export default CasinoGames;
