import { setActivePage, setCasinoCategory } from "@/store/actions";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ArrowDownIcon } from "../../utils/icons";
import { Game } from "../Game/Game";
import { Carousel } from "../carousel/Carousel";
import "./CasinoCategory.css";
import { useClientTranslation } from "@/app/i18n/client";

const CasinoCategory = ({ data, redirect }) => {
  const { t } = useClientTranslation("casino");
  const router = useRouter();
  const dispatch = useDispatch();
  const headerData = useSelector((state) => state.headerData);
  const isMobile = useSelector((state) => state.setMobile);

  const handleViewAll = () => {
    dispatch(setCasinoCategory(data));

    const casinoItem = headerData?.find((h) => h.path === "/casino");
    if (redirect && casinoItem) {
      dispatch(setActivePage(casinoItem));
      router.push("/casino");
    }
  };

  return data ? (
    <div className="mainGames">
      <div className="mainGamesContainer">
        <div className="mainGamesBox">
          <div className="d-flex justify-content-between w-100">
            <div className="recommendedTitle">{data.title}</div>
            {data.view_style !== "trending" && (
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
              arrowClassName="tranding-arrow"
              data={data?.games?.map((game, index) => {
                return {
                  id: game.id,
                  render: <Game game={game} key={game.id} number={index + 1} />,
                };
              })}
            />
          )}
          {data.view_style === "single_line" && (
            <Carousel
              data={data?.games?.map((game) => {
                return {
                  id: game.id,
                  render: <Game game={game} key={game.id} />,
                };
              })}
            />
          )}
          {data.view_style === "hero_multi_line" && (
            <Carousel
              data={
                isMobile
                  ? data?.games?.map((game) => {
                      return {
                        id: game.id,
                        render: <Game game={game} key={game.id} />,
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
                                game={data.games[0]}
                                key={data.games[0].id}
                                className="hero-multi-line"
                                height={390}
                                width={418}
                              />
                            ) : (
                              <div
                                key={rowIndex}
                                className="hero-multi-line-item"
                              >
                                {row.map((game) =>
                                  game ? (
                                    <Game game={game} key={game.id} />
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
              data={
                isMobile
                  ? data?.games?.map((game) => {
                      return {
                        id: game.id,
                        render: <Game game={game} key={game.id} />,
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
                            <div key={index} className="hero-multi-line-item">
                              {row.map((game) =>
                                game ? <Game game={game} key={game.id} /> : null
                              )}
                            </div>
                          ),
                        };
                      })
              }
            />
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default CasinoCategory;
