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
import { useParams, usePathname } from "next/navigation";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { getLocalStorageItem } from "@/utils/localStorage";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import "./SedibarLeft.css";

export const SidebarLeft = () => {
  const dispatch = useDispatch();
  const router = useCustomRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("common");

  const loggedUser = useSelector((state) => state.loggedUser);
  const sidebarLeft = useSelector((state) => state.sidebarLeft);
  const isTablet = useSelector((state) => state.isTablet);
  const activeSport = useSelector((state) => state.activeSport);
  const settings = useSelector((state) => state.settings);
  const isVerifyMessage = useSelector((state) => state.isVerifyMessage);

  const chatIsActive =
    loggedUser && getLocalStorageItem("access_token")
      ? settings?.is_trader_chat_enabled &&
        loggedUser?.user_data?.trader_chat_enabled
      : settings?.is_trader_chat_enabled;

  const [fileteredData, setFilteredData] = useState(sidebarLeft.data);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTransition, setActiveTransition] = useState(false);

  const handleSearch = (value) => {
    setFilteredData(
      sidebarLeft?.data?.filter((item) => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      })
    );
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

  useEffect(() => {
    if (sidebarLeft.data) {
      setFilteredData(sidebarLeft.data);
    }
  }, [sidebarLeft.data]);

  useEffect(() => {
    if (sidebarLeft.data && activeSport?.slug !== params.slug) {
      dispatch(
        setActiveSport(
          sidebarLeft?.data?.find((sport) => sport.slug === params.slug)
        )
      );
    }
  }, [pathname]);

  let timeoutId = null;

  return sidebarLeft?.data ? (
    <div
      className={classNames("sidebar-left", {
        active: sidebarLeft.isActive,
        transition: activeTransition,
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
      <div
        className={classNames("sidebar-profile", {
          active: sidebarLeft.isActive,
        })}
        style={{
          height: `calc(100% - ${
            isTablet
              ? 56
              : 74 + (chatIsActive ? 59 : 0) + (isVerifyMessage ? 34 : 0)
          }px)`,
        }}
      >
        <div>
          <Search handleSearch={handleSearch} />
        </div>
        {fileteredData?.length > 0 ? (
          fileteredData?.map((item) => {
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
                      priority
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
        {!isTablet && chatIsActive && <Chat isOpen={sidebarLeft.isActive} />}
      </div>
      {isHovered && !isTablet && (
        <ArrowButton
          active={sidebarLeft.isActive}
          setActive={(value) => {
            if (!activeTransition) {
              setActiveTransition(true);
            }

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
  ) : (
    <SidebarLeftSkeleton />
  );
};
