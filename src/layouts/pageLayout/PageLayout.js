"use client";

import { Footer } from "@/components/footer/Footer";
import { setFavouriteGames, setPageLayoutContent } from "@/store/actions";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Banner } from "../../components/Banner/Banner";
import CasinoCategory from "../../components/casinoCategory/CasinoCategory";
import { default as CasinoGames } from "../../components/casinoGames/CasinoGames";
import HomeSlider from "../../components/homeSlider/HomeSlider";
import { RacingWidget } from "../../components/racingWidget/RacingWidget";
import { SportsWidget } from "../../components/sportsWidget/SportsWidget";
import { SidebarLayout } from "../sidebarLayout/SidebarLayout";
import { PageContent } from "@/components/pageContent/PageContent";
import { useParams } from "next/navigation";
import HomeSkeletonComponent from "@/utils/HomeSkeletonComponent";
import { SocketContext } from "@/context/socket";

export const PageLayout = ({ children }) => {
  const dispatch = useDispatch();

  const layout = useSelector((state) => state.pageLayoutContent);
  const headerData = useSelector((state) => state.headerData);
  const params = useParams();
  const { gamingSocket } = useContext(SocketContext);

  const page = headerData?.find(
    (page) => page?.path?.substring(1) === (params?.path || "home-page")
  );

  const data = layout?.[page?.slug];

  const fetchLayout = async () => {
    const lang = params.lng;
    const contentLanguage = lang === "en" ? "all" : lang;

    gamingSocket.emit(
      "page_layout",
      {
        value: page?.slug,
        country: contentLanguage,
      },
      (response) => {
        console.log(response);
        dispatch(
          setPageLayoutContent({
            ...layout,
            [page.slug]: response.data,
          })
        );
      }
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

      data?.content?.forEach((component) => {
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
      });

      dispatch(setFavouriteGames(favouriteGames));
    }
  }, [data]);

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
