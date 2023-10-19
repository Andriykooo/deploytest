"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActivePage, setHeaderData } from "../../store/actions";
import FooterMenu from "../footerMenu/FooterMenu";
import { DesktopHeader } from "./DesktopHeader";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Logo } from "../logo/Logo";
import { XIcon } from "@/utils/icons";
import Cookies from "js-cookie";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import "../sidebar/Sidebar.css";
import "./Header.css";

const modalList = [
  "/privacy",
  "/verification",
  "/kyc",
  "/login",
  "/terms",
  "/affiliates",
  "/sign_up",
  "/sign_up_with_phone",
  "/forgot_password",
  "/verify_email",
  "/verify_phone",
  "/email_sent",
  "/finish_account_setup",
  "/profile/*",
];

function Header() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const isMobile = useSelector((state) => state.setMobile);
  const activePage = useSelector((state) => state.activePage);
  const headerData = useSelector((state) => state.headerData);

  const disableHeader =
    (params?.path &&
      !headerData?.some((page) => page.path.substring(1) == params?.path)) ||
    pathname === "/not_found" ||
    pathname === "/customer_service_notice" ||
    pathname.startsWith("/promo/");

  useEffect(() => {
    if (headerData) {
      // Initially, check if the window pathname and the active page path are not the same. If they are different
      // find and replace with the correct one
      if (activePage?.path !== pathname) {
        const page = headerData?.find((item) =>
          pathname === "/" ? item.path === "/home" : item.path === pathname
        );

        if (page) {
          dispatch(setActivePage(page));
        }
      }
    }

    if (!headerData) {
      const lang = Cookies.get("language");
      const defaultLanguage = lang?.toLowerCase() || "en";

      const country = defaultLanguage === "en" ? "all" : defaultLanguage;

      apiServices.get(apiUrl.GET_MAIN_MENU, { country }).then((response) => {
        dispatch(
          setHeaderData(
            response?.map((page, index) => ({ ...page, id: index + 1 }))
          )
        );
      });
    }
  }, [headerData, pathname]);

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

    const home = headerData?.find((item) => item.path === "/home");

    if (home) {
      dispatch(setActivePage(home));
    }
  };

  return (
    !disableHeader && (
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
              <DesktopHeader
                data={headerData}
                onClick={handleClick}
                handleNavigateHome={handleNavigateHome}
              />
              {isMobile && (
                <FooterMenu data={headerData} onClick={handleClick} />
              )}
            </div>
          </nav>
        )}
      </header>
    )
  );
}

export default Header;
