"use client";

import {
  setPageLayoutContent,
  setShowMenuIcon,
  setSidebarRight,
  setUpdatedEvents,
  updateSelections,
} from "@/store/actions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Banner } from "../../components/Banner/Banner";
import CasinoCategory from "../../components/casinoCategory/CasinoCategory";
import { default as CasinoGames } from "../../components/casinoGames/CasinoGames";
import HomeSlider from "../../components/homeSlider/HomeSlider";
import { RacingWidget } from "../../components/racingWidget/RacingWidget";
import { SportsWidget } from "../../components/sportsWidget/SportsWidget";
import { PageContent } from "@/components/pageContent/PageContent";
import HomeSkeletonComponent from "@/components/HomeSkeleton/HomeSkeletonComponent";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { useAxiosData } from "@/hooks/useAxiosData";

export const PageLayout = ({ children, slug }) => {
  const dispatch = useDispatch();

  const layout = useSelector((state) => state.pageLayoutContent);
  const data = layout?.[slug];

  const fetchLayout = async () => {
    return await apiServices.get(apiUrl.GET_PAGE_LAYOUT, {
      value: slug,
    });
  };

  useAxiosData(fetchLayout, {
    onSuccess: (response) => {
      dispatch(
        setPageLayoutContent({
          ...layout,
          [slug]: response,
        })
      );

      const selections = {};

      response.content.forEach((item) => {
        if (item.type === "carousel") {
          item.carousel?.forEach((carouselItem) => {
            carouselItem.button.selections.forEach((selection) => {
              selections[selection.bet_id] = selection;
            });
          });
        }

        if (item.type === "racing_widget") {
          item.racing_widget?.events?.forEach((racingEvent) => {
            racingEvent.selections.forEach((selection) => {
              selections[selection.bet_id] = selection;
            });
          });
        }

        if (item.type === "sport_widget") {
          if (item.sport_widget.widget_type === "sport_widget_standard") {
            item.sport_widget.selections.forEach((selection) => {
              selections[selection.bet_id] = selection;
            });
          } else {
            item.sport_widget?.sports?.forEach((sport) => {
              sport.competitions?.forEach((competition) => {
                competition.events?.forEach((event) => {
                  event.selections.forEach((selection) => {
                    selections[selection.bet_id] = selection;
                  });
                });
              });
            });
          }
        }
      });

      dispatch(updateSelections(Object.values(selections)));
      dispatch(setUpdatedEvents({}));
    },
  });

  useEffect(() => {
    if (data) {
      dispatch(setShowMenuIcon(!!data.show_sidebar));

      if (window.document.documentElement.clientWidth > 1400) {
        dispatch(
          setSidebarRight({
            isActive: !!data.show_betslip,
          })
        );
      }
    }
  }, [data]);

  return data?.content ? (
    <>
      {data?.content?.map((component) => {
        if (component.type === "banner") {
          return <Banner key={component.nr_order} data={component.banner} />;
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
                component?.casino_category || component?.live_casino_category
              }
              key={component.nr_order}
              redirect={true}
            />
          );
        }

        if (component.type === "casino" || component.type === "live_casino") {
          return (
            <CasinoGames data={component?.casino} key={component.nr_order} />
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
    </>
  ) : (
    <HomeSkeletonComponent />
  );
};
