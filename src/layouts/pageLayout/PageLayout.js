"use client";

import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Banner } from "../../components/Banner/Banner";
import CasinoCategory from "../../components/casinoCategory/CasinoCategory";
import { default as CasinoGames } from "../../components/casinoGames/CasinoGames";
import HomeSlider from "../../components/homeSlider/HomeSlider";
import { PageContentModal } from "../../components/pageContentModal/PageContentModal";
import { RacingWidget } from "../../components/racingWidget/RacingWidget";
import { SportsWidget } from "../../components/sportsWidget/SportsWidget";
import { SidebarLayout } from "../sidebarLayout/SidebarLayout";

export const PageLayout = ({ data, children }) => {
  const language = useSelector((state) => state.language);
  const [content, setContent] = useState(data?.content);

  const getPageLayout = () => {
    apiServices
      .get(apiUrl.GET_PAGE_LAYOUT, {
        value: data.page.slug,
        country: language.code2,
      })
      .then((response) => {
        setContent(response.content);
      });
  };

  return (
    <SidebarLayout leftData={data.sidebar_left} rightData={data.sidebar_right} className="sportsBackground">
      {content?.map((component) => {
        if (component.type === "banner") {
          return <Banner key={component.nr_order} data={component.data} />;
        }

        if (component.type === "carousel") {
          return (
            <HomeSlider
              key={component.nr_order}
              data={component.data}
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
              data={component.data}
              key={component.nr_order}
              onFavoriteToggle={getPageLayout}
            />
          );
        }

        if (component.type === "casino" || component.type === "live_casino") {
          return (
            <CasinoGames
              data={component?.data}
              key={component.nr_order}
              onFavoriteToggle={getPageLayout}
            />
          );
        }

        if (component.type === "sport_widget") {
          return (
            <SportsWidget data={component.data} key={component.nr_order} />
          );
        }

        if (component.type === "racing_widget") {
          return (
            <RacingWidget data={component.data} key={component.nr_order} />
          );
        }

        return null;
      })}
      {children}
    </SidebarLayout>
  );
};
