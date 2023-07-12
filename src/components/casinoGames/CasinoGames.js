import React, { useMemo, useState } from "react";

import CasinoCategory from "../casinoCategory/CasinoCategory";
import CasinoMenu from "../casinoMenu/CasinoMenu";

const getFavoriteGames = (categories) => {
  const games = {};

  categories.forEach((category) => {
    category.games.forEach((game) => {
      if (!games[game.id] && game.favorite) {
        games[game.id] = game;
      }
    });
  });

  return Object.values(games);
};

const CasinoGames = ({ data, onFavoriteToggle }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);

  const favoriteGames = getFavoriteGames(data);

  const casinoGames = useMemo(() => {
    return [
      {
        id: 0,
        title: "Favorite Games",
        view_style: "single_line",
        games: favoriteGames.filter((game) =>
          game.name.toLowerCase().includes(search.toLowerCase())
        ),
      },
      ...data,
    ];
  }, [data]);

  return (
    <>
      <CasinoMenu
        data={casinoGames}
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />
      <div className="sportsBackground pb-4">
        {casinoGames
          ?.filter(
            (casinoCategory) => !category || category.id === casinoCategory.id
          )
          ?.map((casinoCategory) => {
            const filteredCategory = {
              ...casinoCategory,
              games: casinoCategory.games?.filter((game) =>
                game.name.toLowerCase().includes(search.toLowerCase())
              ),
            };

            return filteredCategory?.games?.length > 0 ? (
              <CasinoCategory
                key={filteredCategory?.id}
                data={filteredCategory}
                onFavoriteToggle={onFavoriteToggle}
              />
            ) : null;
          })}
      </div>
    </>
  );
};

export default CasinoGames;
