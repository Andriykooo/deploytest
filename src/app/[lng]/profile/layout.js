"use client";

import ProfileMenu from "@/components/profileMenu/ProfileMenu";
import { useClientPathname } from "@/hooks/useClientPathname";
import { ProtectedLayout } from "@/layouts/protectedLayout/ProtectedLayout";
import { useSelector } from "react-redux";

export default function Layout({ children }) {
  const {pathname} = useClientPathname();
  const isTablet = useSelector((state) => state.isTablet);

  // in the mobile version we have sidebar in full width
  const hideSidebar = isTablet && pathname !== "/profile";

  return (
    <ProtectedLayout>
      <div className="backgroundLinear">
        {hideSidebar ? (
          children
        ) : (
          <ProfileMenu sideBarMenu active={"active"}>
            {children}
          </ProfileMenu>
        )}
      </div>
    </ProtectedLayout>
  );
}