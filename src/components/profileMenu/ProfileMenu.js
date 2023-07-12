import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { SocketContext } from "../../context/socket";
import { setActiveSport, setSportTypes } from "../../store/actions";
import { alertToast } from "../../utils/alert";
import { apiUrl } from "../../utils/constants";
import {
  unsubscribeToCompetition,
  unsubscribeToMarket,
  unsubscribeToMatch,
  unsubscribeToSport,
} from "../../utils/socketSubscribers";
import { ArrowButton } from "../custom/ArrowButton";
import { SpinningLoader } from "../loaders/Loader";
import "./ProfileMenu.css";
import { ProfileSidebar } from "./ProfileSidebar";
import { SportsSidebar } from "./SportsSidebar";
import { nextWindow } from "@/utils/nextWindow";

const ProfileMenu = ({
  page,
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
}) => {
  const dispatch = useDispatch();
  const { subscriptionsSocket } = useContext(SocketContext);

  const isMobile = useSelector((state) => state.setMobile);
  const sportTypes = useSelector((state) => state.sports);
  const activeSport = useSelector((state) => state.activeSport);
  const activeSocketSubscribe = useSelector(
    (state) => state.activeSocketSubscribe
  );

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sportsData, setSportsData] = useState(sportTypes);

  const sportsStoredData = useSelector((state) => state.sportsData);
  const uuid = uuidv4();

  const getSportTypes = () => {
    axios
      .get(apiUrl.GET_SPORT_TYPES)
      .then((result) => {
        let sportsData = result?.data;
        if (sportsData && sportsData.length > 0) {
          setSportsData(sportsData);
          dispatch(setSportTypes(sportsData));
          if (!activeSport) {
            dispatch(setActiveSport(sportsData[0]?.id));
          }
        } else {
          setSportsData([]);
          dispatch(setSportTypes(sportsData));
          dispatch(setSportTypes([]));
          dispatch(setActiveSport(null));
        }
      })
      .catch((err) => {
        alertToast({ message: err?.message });
      });
  };

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

  useEffect(() => {
    if (sportTypes.length === 0) {
      getSportTypes();
    }
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
      unsubscribeToSport(subscriptionsSocket, activeSport.toString(), uuid);
    } else if (
      activeSocketSubscribe === "SUBSCRIBE_COMPETITION" &&
      sportsStoredData?.competition_id
    ) {
      unsubscribeToCompetition(
        subscriptionsSocket,
        sportsStoredData?.competition_id.toString(),
        uuid
      );
    } else if (
      activeSocketSubscribe === "SUBSCRIBE_MARKET" &&
      sportsStoredData?.market_id
    ) {
      unsubscribeToMarket(
        subscriptionsSocket,
        sportsStoredData?.market_id.toString(),
        uuid
      );
    } else if (
      activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
      sportsStoredData?.match_id
    ) {
      unsubscribeToMatch(
        subscriptionsSocket,
        sportsStoredData?.market_id,
        uuid
      );
    }
  };

  return (
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
          setSportsData={setSportsData}
          sportsData={sportsData}
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
      {isLoggingOut && <SpinningLoader />}
    </div>
  );
};

export default ProfileMenu;
