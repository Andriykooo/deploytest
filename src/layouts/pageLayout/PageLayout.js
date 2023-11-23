"use client";

import { Footer } from "@/components/footer/Footer";
import {
  setFavouriteGames,
  setPageLayoutContent,
  updatePageLayoutContent,
} from "@/store/actions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Banner } from "../../components/Banner/Banner";
import CasinoCategory from "../../components/casinoCategory/CasinoCategory";
import { default as CasinoGames } from "../../components/casinoGames/CasinoGames";
import HomeSlider from "../../components/homeSlider/HomeSlider";
import { RacingWidget } from "../../components/racingWidget/RacingWidget";
import { SportsWidget } from "../../components/sportsWidget/SportsWidget";
import { SidebarLayout } from "../sidebarLayout/SidebarLayout";
import { PageContent } from "@/components/pageContent/PageContent";
import { notFound, useParams } from "next/navigation";
import HomeSkeletonComponent from "@/utils/HomeSkeletonComponent";
import { communicationSocket } from "@/context/socket";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";

export const PageLayout = ({ children }) => {
  const dispatch = useDispatch();

  const layout = useSelector((state) => state.pageLayoutContent);
  const headerData = useSelector((state) => state.headerData);
  const params = useParams();
  const path = params?.path?.[0] || "index";
  const page = headerData?.find((page) => {
    return page?.path?.substring(1) === path;
  });

  const data = layout?.[path];

  const fetchLayout = async () => {
    const lang = params.lng;
    const contentLanguage = lang === "en" ? "all" : lang;

    apiServices
      .get(apiUrl.GET_PAGE_LAYOUT, {
        value: page?.slug,
        country: contentLanguage,
      })
      .then((response) => {
        dispatch(
          setPageLayoutContent({
            ...layout,
            [path]: response,
          })
        );
      });
  };

  useEffect(() => {
    communicationSocket?.on("new_event", (response) => {
      if (response?.type === "component_updated") {
        dispatch(
          updatePageLayoutContent({
            content: response.updatedComponent,
            slug: path,
            language: params.lng,
          })
        );
      }
    });
  }, []);

  useEffect(() => {
    if ((headerData && !page) || params?.path?.length > 1) {
      notFound();
    }

    if (page) {
      fetchLayout();
    }
  }, [headerData]);

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
      {data?.content ? (
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
