"use client";

import HeaderNotification from "./headerNotification/HeaderNotification";
import FooterMenu from "../footerMenu/FooterMenu";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DesktopHeader } from "./DesktopHeader";
import { CloseIcon } from "@/icons/CloseIcon";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { useTranslations } from "@/hooks/useTranslations";
import { useClientPathname } from "@/hooks/useClientPathname";
import { CustomLink } from "../Link/Link";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { getLocalStorageItem } from "@/utils/localStorage";
import {
  setActivePage,
  setHeaderBoundingClientRect,
  setHeaderData,
  setHeaderNotification,
  setIsVerifyMessage,
  setLastVisitedPage,
} from "../../store/actions";
import "./Header.css";

function Header() {
  const dispatch = useDispatch();
  const { pathname } = useClientPathname();
  const t = useTranslations("header");
  const router = useCustomRouter();
  const headerRef = useRef(null);

  const isMobile = useSelector((state) => state.setMobile);
  const activePage = useSelector((state) => state.activePage);
  const headerData = useSelector((state) => state.headerData);
  const isVerifyMessage = useSelector((state) => state.isVerifyMessage);
  const headerNotification = useSelector((state) => state.headerNotification);
  const home = headerData?.find((item) => item.slug === "index");

  const handleClick = (item) => {
    if (item.type === "casino") {
      return;
    }

    dispatch(setActivePage(item));
  };

  const handleNavigateHome = () => {
    router.replace("/");

    if (home) {
      dispatch(setActivePage(home));
    }
  };

  const getHeaderBoundingClientRect = () => {
    const boundingClientRect = headerRef.current.getBoundingClientRect();

    dispatch(setHeaderBoundingClientRect(boundingClientRect));
  };

  useEffect(() => {
    if (headerData) {
      dispatch(setLastVisitedPage(pathname));

      if (activePage?.path !== pathname) {
        const page = headerData?.find(
          (item) => (item.slug === "index" ? "/" : item.path) === pathname
        );

        if (page) {
          dispatch(setActivePage(page));
        } else {
          dispatch(setActivePage({}));
        }
      }
    }

    if (!headerData) {
      apiServices.get(apiUrl.GET_MAIN_MENU).then((response) => {
        dispatch(
          setHeaderData(
            response?.map((page, index) => ({ ...page, id: index + 1 }))
          )
        );
      });
    }
  }, [headerData, pathname]);

  useEffect(() => {
    apiServices.get(apiUrl.NOTIFICATION_BAR).then((response) => {
      const removedNotifications = JSON.parse(
        getLocalStorageItem("removed_notifications")
      );
      const active = response?.find(
        (notification) =>
          !removedNotifications?.some(
            (removed) =>
              removed.id === notification.id &&
              removed.modified_at === notification.modified_at
          )
      );
      return dispatch(
        setHeaderNotification({
          data: response.length ? response : null,
          activeNotification: active || null,
        })
      );
    });
  }, []);

  useEffect(() => {
    getHeaderBoundingClientRect();

    window.addEventListener("resize", getHeaderBoundingClientRect);

    return () => {
      window.removeEventListener("resize", getHeaderBoundingClientRect);
    };
  }, [headerNotification, isVerifyMessage]);

  return (
    <header ref={headerRef}>
      {isVerifyMessage && (
        <div className="noVerifiedMsg">
          <CustomLink href="/verification">
            {t("please_verify_your_identity")}
          </CustomLink>
          <div
            className="close-noVerifiedMsg"
            onClick={() => dispatch(setIsVerifyMessage(false))}
          >
            <CloseIcon width={16} height={16} />
          </div>
        </div>
      )}
      {headerNotification.activeNotification &&
        headerNotification.data?.map((notification) => {
          return (
            <HeaderNotification
              key={notification.id}
              data={notification}
              active={
                notification.id === headerNotification.activeNotification?.id
              }
            />
          );
        })}
      <nav className="navigation">
        <DesktopHeader
          data={headerData}
          onClick={handleClick}
          handleNavigateHome={handleNavigateHome}
        />
        {isMobile && <FooterMenu data={headerData} onClick={handleClick} />}
      </nav>
    </header>
  );
}

export default Header;
