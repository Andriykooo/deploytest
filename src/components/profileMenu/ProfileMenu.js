"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setSportTypes } from "../../store/actions";
import { ArrowButton } from "../custom/ArrowButton";
import { ProfileSidebar } from "./ProfileSidebar";
import { SportsSidebar } from "./SportsSidebar";
import { nextWindow } from "@/utils/nextWindow";
import { PageLoader } from "../loaders/Loader";
import { usePathname } from "next/navigation";

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
  bigScreenSidebarDisplay,
  children,
}) => {
  const isMobile = useSelector((state) => state.setMobile);
  const sportTypes = useSelector((state) => state.sports);
  const activeSport = useSelector((state) => state.activeSport);

  const pathname = usePathname();
  const page = pathname.split("/").pop();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const removeSidebarArrow = () => {
    if (nextWindow?.innerWidth > 1201) {
      setTimeout(() => {
        setIsHovered(false);
      }, 1500);
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
