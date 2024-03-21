import React, { useEffect, useState } from "react";
import CasinoCategory from "../casinoCategory/CasinoCategory";
import CasinoMenu from "../casinoMenu/CasinoMenu";
import { Game } from "@/components/Game/Game";
import { useDispatch, useSelector } from "react-redux";
import { GameInfoModal } from "../Game/GameInfoModal";
import { GameInfoMoadlMobile } from "../Game/GameInfoMoadlMobile";
import { useTranslations } from "next-intl";
import { NoAvailableGamesIcon } from "@/utils/icons";
import { setCasinoCategory } from "@/store/actions";
import { useClientPathname } from "@/hooks/useClientPathname";

const CasinoGames = ({ data }) => {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const category = useSelector((state) => state.casinoCategory);
  const isTablet = useSelector((state) => state.isTablet);
  const favoriteGames = useSelector((state) => state.favouriteGames);
  const isMobile = useSelector((state) => state.setMobile);
  const [modalInfo, setModalInfo] = useState(null);
  const dispatch = useDispatch();
  const { pathname } = useClientPathname();

  const showModalInfo = (info) => {
    setModalInfo(info);
  };

  const closeModalInfo = () => {
    setModalInfo(null);
  };

  const favoriteGamesData = Object.values(
    data.reduce((accum, category) => {
      category.games.forEach((game) => {
        if (favoriteGames.has(String(game.id))) {
          accum[game.id] = game;
        }
      });

      return accum;
    }, {})
  );

  const casinoGames = [
    {
      id: 0,
      title: t("casino.favourite_games"),
      view_style: "single_line",
      games: favoriteGamesData,
    },
    ...data,
  ];

  useEffect(() => {
    if (pathname) dispatch(setCasinoCategory(null));
  }, [pathname]);

  return (
    <>
      <CasinoMenu
        data={casinoGames}
        search={search}
        setSearch={setSearch}
        category={category}
      />
      {isMobile && !casinoGames.length ? (
        <div className="no-available-game">
          <NoAvailableGamesIcon />
          <div className="no-available-game-text">
            {t("casino.there_are_no_games_available")}
          </div>
        </div>
      ) : (
        <div className="sportsBackground">
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
                      return (
                        <div
                          key={`${game.id}-${game.title}`}
                          className="multi-line-container"
                        >
                          <Game
                            game={game}
                            showModalInfo={(info) =>
                              showModalInfo(info, category.title)
                            }
                            modalInfoId={modalInfo?.gameId}
                          />
                        </div>
                      );
                    }
                    if (index === 0) {
                      return (
                        <Game
                          game={game}
                          key={game.id}
                          heroGames
                          showModalInfo={(info) =>
                            showModalInfo(info, category.title)
                          }
                          modalInfoId={modalInfo?.gameId}
                          className="hero-multi-line-items"
                        />
                      );
                    } else if (index % 2 === 1) {
                      const nextGame = category.games[index + 1];
                      return (
                        <div
                          key={`${game.id}-${nextGame?.id}`}
                          className="multi-line-container"
                        >
                          <Game
                            game={game}
                            modalInfoId={modalInfo?.gameId}
                            showModalInfo={(info) =>
                              showModalInfo(info, category.title)
                            }
                          />
                          {nextGame && (
                            <Game
                              game={nextGame}
                              showModalInfo={(info) =>
                                showModalInfo(info, category.title)
                              }
                              modalInfoId={modalInfo?.gameId}
                            />
                          )}
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
                (casinoCategory) =>
                  !category || category.id === casinoCategory.id
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
      )}
      {!!modalInfo && isMobile ? (
        <GameInfoMoadlMobile modalInfo={modalInfo} onClose={closeModalInfo} />
      ) : (
        <GameInfoModal modalInfo={modalInfo} onClose={closeModalInfo} />
      )}
    </>
  );
};

export default CasinoGames;
