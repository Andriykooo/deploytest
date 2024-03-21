"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ArrowButton } from "../custom/ArrowButton";
import { ProfileSidebar } from "./ProfileSidebar";
import { nextWindow } from "@/utils/nextWindow";
import { PageLoader } from "../loaders/Loader";
import "./ProfileMenu.css";

const ProfileMenu = ({
  profileMenu,
  swiftyMenu,
  setSwiftyMenu,
  sideBarMenu,
  showCollapse,
  largeScreen,
  children,
}) => {
  const isMobile = useSelector((state) => state.setMobile);
  const activeSport = useSelector((state) => state.activeSport);

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
        className="sidebarRow"
        id="sidebarRow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={removeSidebarArrow}
      >
        <ProfileSidebar
          sideBarMenu={sideBarMenu}
          profileMenu={profileMenu}
          setIsLoggingOut={setIsLoggingOut}
        />
        {!isMobile && activeSport && isHovered && showCollapse && (
          <ArrowButton
            swiftyMenu={swiftyMenu}
            largeScreen={largeScreen}
            setSwiftyMenu={setSwiftyMenu}
          />
        )}
      </div>
      {children}
    </>
  );
};

export default ProfileMenu;
