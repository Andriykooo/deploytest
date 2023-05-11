import React, { useState } from "react";

import CasinoCategory from "../casinoCategory/CasinoCategory";
import CasinoMenu from "../casinoMenu/CasinoMenu";

const CasinoGames = ({ data }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);

  return (
    <>
      <CasinoMenu
        data={data}
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />
      {data
        ?.filter(
          (casinoCategory) => !category || category.id === casinoCategory.id
        )
        ?.map((casinoCategory) => ({
          ...casinoCategory,
          games: casinoCategory.games?.filter((game) =>
            game.name.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        ?.filter((casinoCategory) => casinoCategory?.games?.length > 0)
        ?.map((casinoCategory) => {
          return (
            <CasinoCategory key={casinoCategory?.id} data={casinoCategory} />
          );
        })}
    </>
  );
};

export default CasinoGames;
