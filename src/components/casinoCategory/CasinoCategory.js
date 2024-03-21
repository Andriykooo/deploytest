import { setActivePage, setCasinoCategory } from "@/store/actions";

import { useDispatch, useSelector } from "react-redux";
import { ArrowDownIcon } from "../../utils/icons";
import { Game } from "../Game/Game";
import { Carousel } from "../carousel/Carousel";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { GameInfoModal } from "../Game/GameInfoModal";
import { GameInfoMoadlMobile } from "../Game/GameInfoMoadlMobile";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { usePathname } from "next/navigation";
import classNames from "classnames";

import "./CasinoCategory.css";

const CasinoCategory = ({ data, redirect }) => {
  const t = useTranslations("casino");
  const router = useCustomRouter();
  const dispatch = useDispatch();
  const headerData = useSelector((state) => state.headerData);
  const isMobile = useSelector((state) => state.setMobile);
  const [modalInfo, setModalInfo] = useState(null);
  const pathname = usePathname();

  const showModalInfo = (info) => {
    setModalInfo(info);
  };

  const closeModalInfo = () => {
    setModalInfo(null);
  };

  const handleViewAll = () => {
    dispatch(setCasinoCategory(data));

    const casinoItem = headerData?.find((h) => h.path === "/casino");
    if (redirect && casinoItem) {
      dispatch(setActivePage(casinoItem));
      router.push("/casino");
    }
  };

  return data ? (
    <div
      className={classNames("mainGamesContainer", {
        "mainGamesContainer-home": pathname?.includes("index"),
      })}
    >
      <div className="mainGamesBox">
        <div className="d-flex justify-content-between w-100">
          <div className="recommendedTitle">{data.title}</div>
          {data.view_style !== "trending" && !isMobile && (
            <div className="recommendedTitle recommendedViewAll">
              <span className="me-2" onClick={handleViewAll}>
                {t("view_all")}
              </span>
              <ArrowDownIcon viewAll />
            </div>
          )}
        </div>

        {data.view_style === "trending" && (
          <Carousel
            onScroll={closeModalInfo}
            showGradient
            arrowClassName="tranding-arrow"
            data={data?.games?.map((game, index) => {
              return {
                id: game.id,
                render: (
                  <Game
                    showModalInfo={(info) => showModalInfo(info, data.title)}
                    modalInfoId={modalInfo?.gameId}
                    game={game}
                    key={game.id}
                    className="single-line"
                    number={index + 1}
                  />
                ),
              };
            })}
          />
        )}
        {data.view_style === "single_line" && (
          <Carousel
            onScroll={closeModalInfo}
            showGradient
            data={data?.games?.map((game) => {
              return {
                id: game.id,
                render: (
                  <Game
                    showModalInfo={(info) => showModalInfo(info, data.title)}
                    modalInfoId={modalInfo?.gameId}
                    className="single-line"
                    game={game}
                    key={game.id}
                  />
                ),
              };
            })}
          />
        )}
        {data.view_style === "hero_multi_line" && (
          <Carousel
            onScroll={closeModalInfo}
            showGradient
            data={
              isMobile
                ? data?.games?.map((game) => {
                    return {
                      id: game.id,
                      render: (
                        <Game
                          showModalInfo={(info) =>
                            showModalInfo(info, data.title)
                          }
                          modalInfoId={modalInfo?.gameId}
                          className="single-line"
                          game={game}
                          key={game.id}
                        />
                      ),
                    };
                  })
                : data.games
                    .reduce((accum, currentGame, index) => {
                      if (index === 0) {
                        return [[currentGame]];
                      }
                      if (index % 2 === 0) {
                        accum[accum?.length - 1]?.push(currentGame);
                      } else {
                        accum?.push([currentGame]);
                      }

                      return accum;
                    }, [])
                    .map((row, rowIndex) => {
                      return {
                        id: rowIndex,
                        render:
                          rowIndex === 0 ? (
                            <Game
                              showModalInfo={(info) =>
                                showModalInfo(info, data.title)
                              }
                              modalInfoId={modalInfo?.gameId}
                              game={data.games[0]}
                              key={data.games[0].id}
                              className="hero-multi-line-first-img"
                            />
                          ) : (
                            <div key={rowIndex} className="single-line-block">
                              {row.map((game) =>
                                game ? (
                                  <Game
                                    showModalInfo={(info) =>
                                      showModalInfo(info, data.title)
                                    }
                                    modalInfoId={modalInfo?.gameId}
                                    className="single-line"
                                    game={game}
                                    key={game.id}
                                  />
                                ) : null
                              )}
                            </div>
                          ),
                      };
                    })
            }
          />
        )}
        {data.view_style === "multi_line" && (
          <Carousel
            onScroll={closeModalInfo}
            showGradient
            data={
              isMobile
                ? data?.games?.map((game) => {
                    return {
                      id: game.id,
                      render: (
                        <Game
                          showModalInfo={(info) =>
                            showModalInfo(info, data.title)
                          }
                          modalInfoId={modalInfo?.gameId}
                          className="single-line"
                          game={game}
                          key={game.id}
                        />
                      ),
                    };
                  })
                : data.games
                    .reduce((acc, val, index) => {
                      if (index % 2 === 0) {
                        acc.push([val, data.games[index + 1]]);
                      }
                      return acc;
                    }, [])
                    .map((row, index) => {
                      return {
                        id: index,
                        render: (
                          <div key={index}>
                            {row.map((game) =>
                              game ? (
                                <Game
                                  showModalInfo={(info) =>
                                    showModalInfo(info, data.title)
                                  }
                                  modalInfoId={modalInfo?.gameId}
                                  className="single-line mb-3"
                                  game={game}
                                  key={game.id}
                                />
                              ) : null
                            )}
                          </div>
                        ),
                      };
                    })
            }
          />
        )}
      </div>
      {!!modalInfo && isMobile ? (
        <GameInfoMoadlMobile modalInfo={modalInfo} onClose={closeModalInfo} />
      ) : (
        <GameInfoModal modalInfo={modalInfo} onClose={closeModalInfo} />
      )}
    </div>
  ) : null;
};

export default CasinoCategory;
