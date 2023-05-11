import { SocketContext } from "../../context/socket";
import { useContext, useEffect, useState } from "react";
import HomeSkeletonComponent from "../../utils/HomeSkeletonComponent";
import { HeroBanner } from "../HeroBanner/HeroBanner";
import CasinoCategory from "../casinoCategory/CasinoCategory";
import { default as CasinoGames } from "../casinoGames/CasinoGames";
import CasinoMenu from "../casinoMenu/CasinoMenu";
import HeroWidget from "../heroWidget/HeroWidget";
import HomeSlider from "../homeSlider/HomeSlider";
import { RacingWidget } from "../racingWidget/RacingWidget";
import { StartingSoon } from "../startingSoon/StartingSoon";

const skeleton = Array(4).fill(null);

export const PageLayout = ({ type, children }) => {
  const { gamingSocket } = useContext(SocketContext);

  const [pageData, setPageData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading?.(true);

    if (type) {
      gamingSocket?.emit("page_layout", { type }, (response) => {
        setPageData(response);
        setIsLoading?.(false);
      });
    }
  }, [type]);

  return isLoading ? (
    <>
      <HomeSkeletonComponent isLoading={isLoading} />
      <HeroBanner isLoading={isLoading} />
      <HomeSlider isLoading={isLoading} data={skeleton} />
      <CasinoMenu isLoading={isLoading} />
    </>
  ) : (
    <div className="page-layout">
      {children}
      {pageData?.content?.map((component) => {
        if (component.type === "hero_banner") {
          return <HeroBanner key={component.nr_order} data={component.data} />;
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
            <CasinoCategory data={component.data} key={component.nr_order} />
          );
        }

        if (component.type === "casino" || component.type === "live_casino") {
          return <CasinoGames key={component.nr_order} data={component.data} />;
        }

        if (component.type === "hero_widget") {
          return <HeroWidget key={component.nr_order} data={component.data} />;
        }

        if (component.type === "starting_soon_sport") {
          return (
            <StartingSoon data={component.data} key={component.nr_order} />
          );
        }

        // todo: 404-add-racing-widget-data-from-server
        if (component.type === "racing_widget") {
          return (
            <RacingWidget data={component.data} key={component.nr_order} />
          );
        }

        return null;
      })}
    </div>
  );
};
