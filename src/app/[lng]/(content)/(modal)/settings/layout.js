"use client";

import ProfileMenu from "@/components/profileMenu/ProfileMenu";
import { useParams, usePathname } from "next/navigation";
import { ProtectedLayout } from "@/layouts/protectedLayout/ProtectedLayout";
import { useSelector } from "react-redux";

export default function Layout({ children }) {
  const pathname = usePathname();
  const isTablet = useSelector((state) => state.isTablet);
  const params = useParams();

  // in the mobile version we have sidebar in full width
  const hideSidebar = isTablet && pathname !== `/${params.lng}/settings`;

  return (
    <ProtectedLayout redirect="/">
      <div className="backgroundLinear">
        {hideSidebar ? (
          children
        ) : (
          <ProfileMenu sideBarMenu>{children}</ProfileMenu>
        )}
      </div>
    </ProtectedLayout>
  );
}
