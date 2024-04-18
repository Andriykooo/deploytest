"use client";

import { useSelector } from "react-redux";
import { SidebarLeft } from "../../components/sidebarLeft/SidebarLeft";
import { SidebarRight } from "../../components/sidebarRight/SidebarRight";
import { useClientPathname } from "@/hooks/useClientPathname";
import { enableSidebarRoutes } from "@/utils/constants";
import { nextWindow } from "@/utils/nextWindow";

export const SidebarLayout = ({ children }) => {
  const { pathname } = useClientPathname();

  const headerBoundingClientRect = useSelector(
    (state) => state.headerBoundingClientRect
  );

  const enableSidebar = enableSidebarRoutes.some((path) =>
    pathname.includes(path)
  );

  return (
    <div
      className="sidebar-layout"
      style={{
        height: `${nextWindow.innerHeight - headerBoundingClientRect.height}px`,
      }}
    >
      <SidebarLeft alwaysDisplay={enableSidebar} />
      <div className="content" id="content">
        {children}
      </div>
      <SidebarRight alwaysDisplay={enableSidebar} />
    </div>
  );
};
