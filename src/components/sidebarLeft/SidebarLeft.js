"use client";

import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSport, setSidebarLeft } from "../../store/actions";
import { Button } from "../button/Button";
import { Chat } from "../chat/Chat";
import { ArrowButton } from "../custom/ArrowButton";
import { Search } from "../profileMenu/SearchSport";
import { ProfileCard, SidebarProfile } from "../profileMenu/Styled";
import { MenuBarEmpty } from "../menuBarSearch/menuBarEmpty";
import { SidebarLeftSkeleton } from "./SidebarLeftSkeleton";
import { getLocalStorageItem } from "@/utils/localStorage";
import { useTranslations } from "next-intl";
import { useClientPathname } from "@/hooks/useClientPathname";

export const SidebarLeft = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { pathname } = useClientPathname();
  const t = useTranslations("common");

  const loggedUser = useSelector((state) => state.loggedUser);
  const sidebarLeft = useSelector((state) => state.sidebarLeft);
  const isTablet = useSelector((state) => state.isTablet);
  const activeSport = useSelector((state) => state.activeSport);
  const settings = useSelector((state) => state.settings);
  const isVerifyMessage = useSelector((state) => state.isVerifyMessage);

  const chatIsActive =
    getLocalStorageItem("access_token") &&
    settings?.isTraderChatEnabled &&
    loggedUser &&
    loggedUser?.user_data?.trader_chat_enabled;

  const [fileteredData, setFilteredData] = useState(sidebarLeft.data);
  const [isHovered, setIsHovered] = useState(false);

  const handleSearch = (value) => {
    setFilteredData(
      sidebarLeft?.data?.filter((item) => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      })
    );
  };

  const handleClick = (item) => {
    dispatch(setActiveSport(item.id));
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
    dispatch(setActiveSport(null));
  }, [pathname]);

  let timeoutId = null;

  return sidebarLeft?.data ? (
    <div
      className={classNames("sidebar-left", {
        active: sidebarLeft.isActive,
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
      <SidebarProfile
        isOpen={sidebarLeft.isActive}
        chatIsActive={chatIsActive}
        noVerified={isVerifyMessage}
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
                      ? item.id === activeSport
                      : item.slug === pathname.split("/").pop()
                  }
                  onClick={() => handleClick(item)}
                >
                  <div className="sport-d d-flex">
                    <Image
                      alt="img-minisidebar"
                      src={item?.icon}
                      priority
                      quality={50}
                      className="sports-icon-miniSidebar"
                      height={20}
                      width={20}
                    />
                    {sidebarLeft.isActive && (
                      <Button
                        className="btn popularDropdown profile top"
                        type="button"
                        text={item.name}
                      />
                    )}
                  </div>
                </ProfileCard>
              </div>
            );
          })
        ) : (
          <MenuBarEmpty message={t("sport_not_found")} />
        )}
      </SidebarProfile>
      {isHovered && !isTablet && (
        <ArrowButton
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
      {!isTablet && chatIsActive && <Chat isOpen={sidebarLeft.isActive} />}
    </div>
  ) : (
    <SidebarLeftSkeleton />
  );
};
