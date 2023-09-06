"use client";

import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { SocketContext } from "../../context/socket";
import { setSportTypes } from "../../store/actions";
import {
  unsubscribeToCompetition,
  unsubscribeToMarket,
  unsubscribeToMatch,
  unsubscribeToSport,
} from "../../utils/socketSubscribers";
import { ArrowButton } from "../custom/ArrowButton";
import { ProfileSidebar } from "./ProfileSidebar";
import { SportsSidebar } from "./SportsSidebar";
import { nextWindow } from "@/utils/nextWindow";
import { usePathname } from "next/navigation";
import { PageLoader } from "../loaders/Loader";

const ProfileMenu = ({
  active,
  version,
  profileMenu,
  sports,
  swiftyMenu,
  setSwiftyMenu,
  sideBarMenu,
  showCollapse,
  largeScreen,
  setLargeScreen,
  bigScreenSidebarDisplay,
  children,
}) => {
  const { gamingSocket } = useContext(SocketContext);

  const isMobile = useSelector((state) => state.setMobile);
  const sportTypes = useSelector((state) => state.sports);
  const activeSport = useSelector((state) => state.activeSport);
  const activeSocketSubscribe = useSelector(
    (state) => state.activeSocketSubscribe
  );
  const pathname = usePathname();
  const page = pathname.split("/").pop();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sportsStoredData = useSelector((state) => state.sportsData);
  const uuid = uuidv4();

  useEffect(() => {
    const mediaQuery = nextWindow.matchMedia(
      "(min-width: 992px) and (max-width: 1200px)"
    );
    setIsHovered(mediaQuery.matches);
    return () => mediaQuery.removeEventListener("change", handleMatch);
  }, []);

  useEffect(() => {
    const mediaQuery = nextWindow.matchMedia("(min-width: 1400px)");
    if (setLargeScreen) {
      setLargeScreen(mediaQuery.matches);
    }
    return () => mediaQuery.removeEventListener("change", handleMatch);
  }, []);

  const handleMatch = (mediaQuery) => {
    if (mediaQuery.media === "(min-width: 992px) and (max-width: 1200px)") {
      setIsHovered(mediaQuery.matches);
    } else if (mediaQuery.media === "(min-width: 1400px)") {
      if (setLargeScreen) {
        setLargeScreen(mediaQuery.matches);
      }
    }
  };

  useEffect(() => {
    const mediaQuery992_1200 = nextWindow.matchMedia(
      "(min-width: 992px) and (max-width: 1200px)"
    );
    const mediaQuery1400 = nextWindow.matchMedia("(min-width: 1400px)");
    mediaQuery992_1200.addEventListener("change", handleMatch);
    mediaQuery1400.addEventListener("change", handleMatch);
    return () => {
      mediaQuery992_1200.removeEventListener("change", handleMatch);
      mediaQuery1400.removeEventListener("change", handleMatch);
    };
  }, []);

  const removeSidebarArrow = () => {
    if (nextWindow?.innerWidth > 1201) {
      setTimeout(() => {
        setIsHovered(false);
      }, 1500);
    }
  };

  const handleUnsubscribe = () => {
    if (activeSocketSubscribe === "SUBSCRIBE_SPORT") {
      unsubscribeToSport(gamingSocket, activeSport.toString(), uuid);
    } else if (
      activeSocketSubscribe === "SUBSCRIBE_COMPETITION" &&
      sportsStoredData?.competition_id
    ) {
      unsubscribeToCompetition(
        gamingSocket,
        sportsStoredData?.competition_id.toString(),
        uuid
      );
    } else if (
      activeSocketSubscribe === "SUBSCRIBE_MARKET" &&
      sportsStoredData?.market_id
    ) {
      unsubscribeToMarket(
        gamingSocket,
        sportsStoredData?.market_id.toString(),
        uuid
      );
    } else if (
      activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
      sportsStoredData?.match_id
    ) {
      unsubscribeToMatch(gamingSocket, sportsStoredData?.market_id, uuid);
    }
  };

  return isLoggingOut ? (
    <div className="profileMenuLoader">
      <PageLoader />
    </div>
  ) : (
    <>
      <div
        className="row sidebarRow"
        id="sidebarRow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={removeSidebarArrow}
      >
        {sideBarMenu ? (
          <ProfileSidebar
            sideBarMenu={sideBarMenu}
            version={version}
            profileMenu={profileMenu}
            page={page}
            active={active}
            setIsLoggingOut={setIsLoggingOut}
          />
        ) : (
          <SportsSidebar
            sports={sports}
            bigScreenSidebarDisplay={bigScreenSidebarDisplay}
            largeScreen={largeScreen}
            swiftyMenu={swiftyMenu}
            setSportsData={setSportTypes}
            sportsData={sportTypes}
            handleUnsubscribe={handleUnsubscribe}
          />
        )}
        {!isMobile && activeSport && isHovered && showCollapse && (
          <ArrowButton
            swiftyMenu={swiftyMenu}
            largeScreen={largeScreen}
            browserName={""}
            setSwiftyMenu={setSwiftyMenu}
          />
        )}
      </div>
      <div>{children}</div>
    </>
  );
};

export default ProfileMenu;
