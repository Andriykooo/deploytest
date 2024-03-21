"use client";

import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSport, setSidebarLeft } from "../../store/actions";
import { Chat } from "../chat/Chat";
import { ArrowButton } from "../custom/ArrowButton";
import { Search } from "../profileMenu/SearchSport";
import { MenuBarEmpty } from "../menuBarSearch/menuBarEmpty";
import { SidebarLeftSkeleton } from "./SidebarLeftSkeleton";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { getLocalStorageItem } from "@/utils/localStorage";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { alertToast } from "@/utils/alert";
import "./SedibarLeft.css";

export const SidebarLeft = ({ alwaysDisplay }) => {
  const dispatch = useDispatch();
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const t = useTranslations("common");
  const loggedUser = useSelector((state) => state.loggedUser);
  const sidebarLeft = useSelector((state) => state.sidebarLeft);
  const isTablet = useSelector((state) => state.isTablet);
  const activeSport = useSelector((state) => state.activeSport);
  const settings = useSelector((state) => state.settings);
  const showMenuIcon = useSelector((state) => state.showMenuIcon);
  const chatIsActive =
    loggedUser && getLocalStorageItem("access_token")
      ? settings?.is_trader_chat_enabled &&
        loggedUser?.user_data?.trader_chat_enabled
      : settings?.is_trader_chat_enabled;

  const [searchData, setSearchData] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMatch, setActiveMatch] = useState(null);

  const handleSearch = (value) => {
    setIsLoading(true);
    if (value) {
      apiServices
        .post(apiUrl.MATCHES_SEARCH, { value })
        .then((res) => {
          setSearchData({
            data: res,
            value: value,
          });
        })
        .catch((error) => {
          alertToast({ message: error?.response?.data?.message });
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      setSearchData({
        data: sidebarLeft.data,
        value: "",
      });
    }
  };

  const handleClick = (item) => {
    dispatch(setActiveSport(item));
    router.push(
      `/${pathname.includes("inplay") ? "inplay" : "sport"}/${item.slug}`
    );

    if (isTablet) {
      dispatch(
        setSidebarLeft({
          ...sidebarLeft,
          isActive: false,
        })
      );
    }
  };

  const handleClickMatch = (item) => {
    const slug =
      item.sport_slug === "horseracing" ||
      item.sport_slug === "greyhoundracing";
    if (isTablet) {
      dispatch(
        setSidebarLeft({
          ...sidebarLeft,
          isActive: false,
        })
      );
    }
    if (slug) {
      return router.push(
        `/racecard/${item.sport_slug}/${item.event_name}?id=${item.event_id}`
      );
    }
    router.push(`/${item.sport_slug}/event/${item.event_id}`);
  };

  useEffect(() => {
    setSearchData({
      data: sidebarLeft.data,
      value: "",
    });
    if (sidebarLeft.data) {
      setIsLoading(false);
    }
  }, [sidebarLeft.data]);

  useEffect(() => {
    if (!isTablet && searchData?.value && !sidebarLeft.isActive) {
      setSearchData({
        data: sidebarLeft.data,
        value: "",
      });
    }
  }, [sidebarLeft.isActive]);

  useEffect(() => {
    if (sidebarLeft?.data) {
      const activeSport = sidebarLeft?.data.find(
        (sport) => sport.slug === params.slug
      );

      if (!activeSport) {
        dispatch(setActiveSport(null));
      }
    }

    if (searchData?.value) {
      if (params?.slug && searchParams.get("id")) {
        const match = searchData.data?.find(
          (item) =>
            item.event_id === searchParams.get("id") &&
            params.slug === item.sport_slug
        );
        setActiveMatch(match);
      } else if (params?.sport && params?.id) {
        const match = searchData.data?.find(
          (item) =>
            item.event_id === params.id && params.sport === item.sport_slug
        );
        setActiveMatch(match);
      } else {
        setActiveMatch(null);
      }
    }
  }, [pathname, searchParams]);

  let timeoutId = null;

  return (
    <div
      className={classNames("sidebar-left", {
        active: sidebarLeft.isActive,
        show: (showMenuIcon || alwaysDisplay) && !isTablet,
      })}
      onMouseEnter={() => {
        clearTimeout(timeoutId);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        timeoutId = setTimeout(() => {
          setIsHovered(false);
        }, 2000);
      }}
    >
      <div className="sidebar-profile">
        <div
          className="sidebar-profile-items"
          style={{
            height: !isTablet && chatIsActive ? `calc(100% - 59px)` : "100%",
          }}
        >
          <Search
            searchValue={searchData?.value || ""}
            handleSearch={handleSearch}
            setSearchData={setSearchData}
          />
          {isLoading ? (
            !isTablet && <SidebarLeftSkeleton height={searchData?.data && 68} />
          ) : searchData?.value ? (
            searchData?.data.length > 0 ? (
              searchData?.data.map((item) => {
                return (
                  <div key={item.event_id}>
                    <ProfileCard
                      className="matches-item-container"
                      active={activeMatch?.event_id === item.event_id}
                      onClick={() => handleClickMatch(item)}
                    >
                      <div className="matches-item">
                        <p className="match-competition-name">
                          {item.competition_name}
                        </p>
                        <p className="match-event-name">{item.event_name}</p>
                        <p className="match-start-time">
                          {item.event_start_time}
                        </p>
                      </div>
                    </ProfileCard>
                  </div>
                );
              })
            ) : (
              <div className="empty-matches">
                <p>{t("no_results")}</p>
              </div>
            )
          ) : searchData?.data?.length > 0 ? (
            searchData?.data?.map((item) => {
              return (
                <div key={item.id}>
                  <ProfileCard
                    active={
                      activeSport
                        ? item.id === activeSport.id
                        : item.slug === pathname.split("/").pop()
                    }
                    onClick={() => handleClick(item)}
                  >
                    <div className="sport-d d-flex">
                      <Image
                        alt="img-minisidebar"
                        src={item?.icon}
                        className="sports-icon-miniSidebar"
                        height={20}
                        width={20}
                      />
                      {sidebarLeft.isActive && (
                        <span className="sidebar-item-name">{item.name}</span>
                      )}
                    </div>
                  </ProfileCard>
                </div>
              );
            })
          ) : (
            <MenuBarEmpty message={t("sport_not_found")} />
          )}
        </div>
        {!isTablet && chatIsActive && <Chat isOpen={sidebarLeft.isActive} />}
      </div>
      {!isTablet && (
        <ArrowButton
          show={isHovered}
          active={sidebarLeft.isActive}
          setActive={(value) => {
            dispatch(
              setSidebarLeft({
                ...sidebarLeft,
                isActive: value,
              })
            );
          }}
        />
      )}
    </div>
  );
};
