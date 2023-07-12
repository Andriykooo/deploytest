"use client";

import classNames from "classnames";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { SocketContext } from "../../context/socket";
import { setActiveSport, setSidebarLeft } from "../../store/actions";
import {
  unsubscribeToCompetition,
  unsubscribeToMarket,
  unsubscribeToMatch,
  unsubscribeToSport,
} from "../../utils/socketSubscribers";
import { Button } from "../button/Button";
import { Chat } from "../chat/Chat";
import { ArrowButton } from "../custom/ArrowButton";
import { Search } from "../profileMenu/SearchSport";
import { ProfileCard, SidebarProfile } from "../profileMenu/Styled";

export const SidebarLeft = ({ data }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const uuid = uuidv4();

  const { subscriptionsSocket } = useContext(SocketContext);
  const loggedUser = useSelector((state) => state.loggedUser);
  const sidebarLeft = useSelector((state) => state.sidebarLeft);
  const isTablet = useSelector((state) => state.isTablet);
  const activeSport = useSelector((state) => state.activeSport);
  const sportsStoredData = useSelector((state) => state.sportsData);
  const activeSocketSubscribe = useSelector(
    (state) => state.activeSocketSubscribe
  );

  const [fileteredData, setFilteredData] = useState(data);
  const [isHovered, setIsHovered] = useState(false);

  const handleSearch = (value) => {
    setFilteredData(
      data?.filter((item) => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      })
    );
  };

  const handleUnsubscribe = () => {
    if (activeSocketSubscribe === "SUBSCRIBE_SPORT") {
      unsubscribeToSport(subscriptionsSocket, activeSport.toString(), uuid);
    } else if (
      activeSocketSubscribe === "SUBSCRIBE_COMPETITION" &&
      sportsStoredData?.competition_id
    ) {
      unsubscribeToCompetition(
        subscriptionsSocket,
        sportsStoredData?.competition_id.toString(),
        uuid
      );
    } else if (
      activeSocketSubscribe === "SUBSCRIBE_MARKET" &&
      sportsStoredData?.market_id
    ) {
      unsubscribeToMarket(
        subscriptionsSocket,
        sportsStoredData?.market_id.toString(),
        uuid
      );
    } else if (
      activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
      sportsStoredData?.match_id
    ) {
      unsubscribeToMatch(
        subscriptionsSocket,
        sportsStoredData?.market_id,
        uuid
      );
    }
  };

  const handleClick = (item) => {
    handleUnsubscribe();
    dispatch(setActiveSport(item.id));
    router.push(
      `/${pathname.includes("inplay") ? "inplay" : "sport"}/${item.slug}`
    );

    if (isTablet) {
      dispatch(
        setSidebarLeft({
          isActive: false,
        })
      );
    }
  };

  let timeoutId = null;

  return (
    <div
      className={classNames("sidebar-left", {
        active: sidebarLeft.isActive,
        "sidebar-left-chat": loggedUser,
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
      <SidebarProfile isOpen={sidebarLeft.isActive}>
        <Search handleSearch={handleSearch} />
        {fileteredData?.map((item) => {
          return (
            <div key={item.id}>
              <ProfileCard
                active={item.slug === pathname.split("/").pop()}
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
        })}
      </SidebarProfile>
      {isHovered && !isTablet && (
        <ArrowButton
          active={sidebarLeft.isActive}
          setActive={(value) => {
            dispatch(
              setSidebarLeft({
                isActive: value,
              })
            );
          }}
        />
      )}
      {loggedUser && <Chat isOpen={sidebarLeft.isActive} />}
    </div>
  );
};
