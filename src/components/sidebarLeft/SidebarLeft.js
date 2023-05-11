import { SocketContext } from "../../context/socket";
import { Skeleton } from "@mui/material";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { setActiveSport, setSidebarLeft } from "../../store/actions";
import {
  unsubscribeToCompetition,
  unsubscribeToMarket,
  unsubscribeToMatch,
  unsubscribeToSport,
} from "../../utils/socketSubscribers";
import { Button } from "../button/Button";
import { ArrowButton } from "../custom/ArrowButton";
import { Search } from "../profileMenu/SearchSport";
import { ProfileCard, SidebarProfile } from "../profileMenu/Styled";

const skeletonTitle = new Array(4).fill(0);
const skeleteInline = new Array(20).fill(0);

export const SidebarLeft = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const uuid = uuidv4();

  const { gamingSocket } = useContext(SocketContext);
  const { subscriptionsSocket } = useContext(SocketContext);
  const sidebarLeft = useSelector((state) => state.sidebarLeft);

  const isMobile = useSelector((state) => state.setMobile);
  const activeSport = useSelector((state) => state.activeSport);
  const sportsStoredData = useSelector((state) => state.sportsData);
  const activeSocketSubscribe = useSelector(
    (state) => state.activeSocketSubscribe
  );

  const [fileteredData, setFilteredData] = useState(sidebarLeft?.data);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleSearch = (value) => {
    setFilteredData(
      sidebarLeft.data?.filter((item) => {
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
      `/${location.pathname.includes("inplay") ? "inplay" : "sports"}/${
        item.id
      }`
    );

    if (isMobile) {
      dispatch(
        setSidebarLeft({
          ...sidebarLeft,
          isActive: false,
        })
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);

    gamingSocket?.emit("sidebar_left", {}, (response) => {
      dispatch(
        setSidebarLeft({
          ...sidebarLeft,
          data: response,
        })
      );
      setFilteredData(response);
      setIsLoading(false);
    });
  }, []);

  let timeoutId = null;

  return isLoading && !sidebarLeft.data ? (
    <div
      className={classNames("sidebar-left sidebar-skeleton", {
        active: sidebarLeft.isActive,
      })}
    >
      <div className="p-2 mt-2">
        <Skeleton
          variant="text"
          sx={{ fontSize: "2.5rem", bgcolor: "#212536" }}
          className="my-2"
          animation="wave"
        />
        {skeletonTitle.map((_, index) => (
          <Skeleton
            variant="text"
            sx={{ fontSize: "1.2rem" }}
            className="my-2"
            animation="wave"
            key={index}
          />
        ))}

        {skeleteInline.map((_, index) => (
          <Skeleton
            variant="text"
            sx={{ fontSize: "1.2rem" }}
            className="my-2"
            animation="wave"
            key={index}
          />
        ))}
      </div>
    </div>
  ) : (
    <div
      className={classNames("sidebar-left", { active: sidebarLeft.isActive })}
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
                active={item.id === +location.pathname.split("/").pop()}
                onClick={() => handleClick(item)}
              >
                <div className="sport-d d-flex">
                  <img
                    alt="img-minisidebar"
                    src={item?.icon}
                    className="sports-icon-miniSidebar"
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
      {isHovered && (
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
    </div>
  );
};
