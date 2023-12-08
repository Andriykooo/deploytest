"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ArrowButton } from "../custom/ArrowButton";
import { ProfileSidebar } from "./ProfileSidebar";
import { nextWindow } from "@/utils/nextWindow";
import { PageLoader } from "../loaders/Loader";
import { usePathname } from "next/navigation";
import "./ProfileMenu.css";

const ProfileMenu = ({
  active,
  version,
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
        <ProfileSidebar
          sideBarMenu={sideBarMenu}
          version={version}
          profileMenu={profileMenu}
          page={page}
          active={active}
          setIsLoggingOut={setIsLoggingOut}
        />
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
