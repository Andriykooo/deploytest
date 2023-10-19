"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActivePage,
  setHeaderData,
  setIsVerifyMessage,
} from "../../store/actions";
import FooterMenu from "../footerMenu/FooterMenu";
import { DesktopHeader } from "./DesktopHeader";
import { useParams, useRouter } from "next/navigation";
import { Logo } from "../logo/Logo";
import { CloseIcon, XIcon } from "@/utils/icons";
import Cookies from "js-cookie";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { useClientPathname } from "@/hooks/useClientPathname";
import "../sidebar/Sidebar.css";
import "./Header.css";
import classNames from "classnames";
import Link from "next/link";
import { useClientTranslation } from "@/app/i18n/client";

function Header({ isModal }) {
  const dispatch = useDispatch();
  const { pathname } = useClientPathname();
  const { t } = useClientTranslation("header");
  const router = useRouter();
  const params = useParams();
  const isMobile = useSelector((state) => state.setMobile);
  const activePage = useSelector((state) => state.activePage);
  const headerData = useSelector((state) => state.headerData);
  const loggedUser = useSelector((state) => state.loggedUser);
  const isVerifyMessage = useSelector((state) => state.isVerifyMessage);

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
          pathname === "/" ? item.path === "/home-page" : item.path === pathname
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

    const home = headerData?.find((item) => item.path === "/home-page");

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
          <nav
            className={classNames("navigation navbar-expand-lg p-0", {
              noVerified: loggedUser && !isModal && isVerifyMessage,
            })}
          >
            <div className="noVerifiedMsg">
              <Link href="/verification">
                {t("please_verify_your_identity")}
              </Link>
              <div
                className="close-noVerifiedMsg"
                onClick={() => dispatch(setIsVerifyMessage(false))}
              >
                <CloseIcon width={16} height={16} />
              </div>
            </div>
            <DesktopHeader
              data={headerData}
              onClick={handleClick}
              handleNavigateHome={handleNavigateHome}
            />
            {isMobile && <FooterMenu data={headerData} onClick={handleClick} />}
          </nav>
        )}
      </header>
    )
  );
}

export default Header;
