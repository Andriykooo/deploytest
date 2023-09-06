"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActivePage } from "../../store/actions";
import FooterMenu from "../footerMenu/FooterMenu";
import "../sidebar/Sidebar.css";
import { DesktopHeader } from "./DesktopHeader";
import "./Header.css";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../logo/Logo";
import { XIcon } from "@/utils/icons";
import { nextWindow } from "@/utils/nextWindow";

const modalList = [
  "/privacy",
  "/verification",
  "/kyc",
  "/login",
  "/terms",
  "/sign_up",
  "/sign_up_with_phone",
  "/forgot_password",
  "/verify_email",
  "/email_sent",
  "/finish_account_setup",
  "/profile/*",
];

function Header({ headerData }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useSelector((state) => state.setMobile);
  const activePage = useSelector((state) => state.activePage);

  useEffect(() => {
    // Initially, check if the window pathname and the active page path are not the same. If they are different
    // find and replace with the correct one
    if (nextWindow && activePage?.path !== nextWindow.location.pathname) {
      const { pathname } = nextWindow.location;
      const page = headerData.find((item) => pathname === '/' ? item.path === '/home' : item.path === pathname);

      if (page) {
        dispatch(setActivePage(page));
      }
    }
  }, []);

  const isModal = useMemo(() => {
    return modalList.some((modalPath) => {
      if (modalPath.endsWith("/*")) {
        const prefix = modalPath.slice(0, -2);
        return pathname.startsWith(prefix);
      }
      return pathname === modalPath;
    });
  }, [pathname]);

  const handleClick = (item) => {
    if (item.type === "casino") {
      return;
    }

    dispatch(setActivePage(item));
  };

  const handleNavigateHome = (navigate = true) => {
    if (navigate) {
      router.push("/");
    }

    const home = headerData.find((item) => item.path === '/home');

    if (home) {
      dispatch(setActivePage(home));
    }
  };

  return (
    <header>
      {isModal ? (
        <nav className="navigation navbar-expand-lg p-0 d-flex justify-content-between align-items-center">
          <div className="swifty-gaming">
            <Logo handleNavigateHome={handleNavigateHome} />
          </div>
          <div
            className="close-full-modal-container"
            onClick={handleNavigateHome}
          >
            <XIcon />
          </div>
        </nav>
      ) : (
        <nav className="navigation navbar-expand-lg p-0">
          <div className="col-12 primary-col">
            <DesktopHeader data={headerData} onClick={handleClick} handleNavigateHome={handleNavigateHome} />
            {isMobile && <FooterMenu data={headerData} onClick={handleClick} />}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
