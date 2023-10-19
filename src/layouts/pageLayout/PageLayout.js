"use client";

import { Footer } from "@/components/footer/Footer";
import {
  setFavouriteGames,
  setPageLayoutContent,
  setSubscriptions,
  setUpdatedSelections,
} from "@/store/actions";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Banner } from "../../components/Banner/Banner";
import CasinoCategory from "../../components/casinoCategory/CasinoCategory";
import { default as CasinoGames } from "../../components/casinoGames/CasinoGames";
import HomeSlider from "../../components/homeSlider/HomeSlider";
import { RacingWidget } from "../../components/racingWidget/RacingWidget";
import { SportsWidget } from "../../components/sportsWidget/SportsWidget";
import { SidebarLayout } from "../sidebarLayout/SidebarLayout";
import { SocketContext } from "@/context/socket";
import { v4 as uuidv4 } from "uuid";
import { PageContent } from "@/components/pageContent/PageContent";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import HomeSkeletonComponent from "@/utils/HomeSkeletonComponent";

export const PageLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { gamingSocket } = useContext(SocketContext);

  const layout = useSelector((state) => state.pageLayoutContent);
  const headerData = useSelector((state) => state.headerData);
  const sports = useSelector((state) => state.sports);
  const subscriptions = useSelector((state) => state.subscriptions);
  const params = useParams();

  const page = headerData?.find(
    (page) => page?.path?.substring(1) === (params?.path || "home")
  );

  const data = layout?.[page?.slug];

  const getPageLayout = async () => {
    const lang = Cookies.get("language");
    const contentLanguage = lang === "en" ? "all" : lang;

    const layout = await apiServices
      .get(apiUrl.GET_PAGE_LAYOUT, {
        value: page?.slug,
        country: contentLanguage,
      })
      .then((response) => ({
        ...response,
        page,
      }));

    return layout;
  };

  const fetchLayout = async () => {
    const data = await getPageLayout();

    dispatch(
      setPageLayoutContent({
        ...layout,
        [data.page.slug]: data,
      })
    );
  };

  useEffect(() => {
    if (headerData && !data && page && !layout[page?.slug]) {
      fetchLayout();
    }
  }, [headerData, page]);

  useEffect(() => {
    if (data?.content) {
      const favouriteGames = {};

      dispatch(
        setSubscriptions(
          data?.content?.reduce((subscriptionsAccum, component) => {
            if (component.type === "casino_category") {
              component.casino_category.games.forEach((game) => {
                if (game.favorite) {
                  favouriteGames[game.id] = game;
                }
              });
            }

            if (component.type === "casino") {
              component.casino.forEach((category) => {
                category.games.forEach((game) => {
                  if (game.favorite) {
                    favouriteGames[game.id] = game;
                  }
                });
              });
            }

            if (component.type === "racing_widget") {
              const sportId = sports.find(
                (sport) => sport.slug === "horseracing"
              )?.id;

              return {
                ...subscriptionsAccum,
                [sportId]: true,
              };
            }

            if (component.type === "sport_widget") {
              return {
                ...subscriptionsAccum,
                sports: {
                  ...subscriptionsAccum.sports,
                  ...component?.sport_widget?.sports?.reduce(
                    (sportsSubscriptions, currentSport) => {
                      const sportId = sports.find(
                        (sport) => sport.slug === currentSport.slug
                      )?.id;

                      return {
                        ...sportsSubscriptions,
                        [sportId]: currentSport,
                      };
                    },
                    {}
                  ),
                },
              };
            }

            if (component.type === "carousel") {
              return {
                ...subscriptionsAccum,
                markets: {
                  ...subscriptionsAccum.markets,
                  ...component.carousel.reduce((markets, carouselItem) => {
                    return {
                      ...markets,
                      ...carouselItem.buttons.reduce(
                        (selections, selection) => {
                          return {
                            ...selections,
                            [selection.bet_id]: selection,
                          };
                        },
                        {}
                      ),
                    };
                  }, {}),
                },
              };
            }

            return subscriptionsAccum;
          }, {})
        )
      );

      dispatch(setFavouriteGames(favouriteGames));
    }
  }, [data]);

  useEffect(() => {
    Object.entries(subscriptions).forEach(([entity, ids]) => {
      if (entity === "sports") {
        Object.keys(ids).forEach((id) => {
          gamingSocket.emit("subscribe_sport", {
            value: id,
          });
        });
      }

      if (entity === "markets") {
        Object.keys(ids).forEach((id) => {
          gamingSocket.emit("subscribe_market", {
            value: id,
          });
        });
      }
    });

    gamingSocket.on("selection_updated", (response) => {
      dispatch(setUpdatedSelections(response));
    });

    return () => {
      gamingSocket.off("selection_updated");

      Object.entries(subscriptions).forEach(([entity, ids]) => {
        if (entity === "sports") {
          Object.keys(ids).forEach((id) => {
            gamingSocket.emit("unsubscribe_sport", {
              value: id,
              action_id: uuidv4(),
            });
          });
        }

        if (entity === "markets") {
          Object.keys(ids).forEach((id) => {
            gamingSocket.emit("unsubscribe_market", {
              value: id,
              action_id: uuidv4(),
            });
          });
        }
      });
    };
  }, [subscriptions]);

  return (
    <SidebarLayout
      sidebarLeftIsActive={!!data?.show_sidebar}
      sidebarRightIsActive={!!data?.show_betslip}
    >
      {data ? (
        <div>
          {data?.content?.map((component) => {
            if (component.type === "banner") {
              return (
                <Banner key={component.nr_order} data={component.banner} />
              );
            }

            if (component.type === "carousel") {
              return (
                <HomeSlider
                  key={component.nr_order}
                  data={component.carousel}
                  type={"casino-live"}
                  className="casinoCarousel"
                />
              );
            }

            if (
              component.type === "casino_category" ||
              component.type === "live_casino_category"
            ) {
              return (
                <CasinoCategory
                  data={
                    component?.casino_category ||
                    component?.live_casino_category
                  }
                  key={component.nr_order}
                  redirect={true}
                />
              );
            }

            if (
              component.type === "casino" ||
              component.type === "live_casino"
            ) {
              return (
                <CasinoGames
                  data={component?.casino}
                  key={component.nr_order}
                />
              );
            }

            if (component.type === "sport_widget") {
              return (
                <SportsWidget
                  data={component.sport_widget}
                  key={component.nr_order}
                />
              );
            }

            if (component.type === "racing_widget") {
              return (
                <RacingWidget
                  data={component.racing_widget}
                  key={component.nr_order}
                />
              );
            }

            if (component.type === "page_content") {
              return (
                <PageContent
                  key={component.nr_order}
                  content={component.page_content.content}
                />
              );
            }

            return null;
          })}
          {children}
        </div>
      ) : (
        <HomeSkeletonComponent isLoading />
      )}
      <Footer />
    </SidebarLayout>
  );
};
