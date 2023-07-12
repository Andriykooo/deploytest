import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSport } from "../../store/actions";
import { theme } from "../../utils/config";
import { Button } from "../button/Button";
import { ProfileCard, SidebarProfile } from "./Styled";

export const SportsSidebar = ({
  sports,
  bigScreenSidebarDisplay,
  largeScreen,
  swiftyMenu,
  sportsData,
  handleUnsubscribe,
}) => {
  const isMobile = useSelector((state) => state.setMobile);
  const activeSport = useSelector((state) => state.activeSport);
  const inPlay = useSelector((state) => state.inPlay);
  const router = useRouter();
  const dispatch = useDispatch();
  const isActive = true;

  return (
    <SidebarProfile
      sports={sports}
      className="resetSidebarStyle"
      bigScreenSidebarDisplay={bigScreenSidebarDisplay}
    >
      <>
        {sports ? (
          <>
            {sportsData?.map((value, index) => {
              let showImage = true;
              if (value?.icon.indexOf("null") > -1) {
                showImage = false;
              }
              return (
                <div style={{ borderBottom: "1px solid #25292d" }} key={index}>
                  <ProfileCard
                    active={value.id === activeSport ? true : false}
                    onClick={() => {
                      handleUnsubscribe();
                      dispatch(setActiveSport(value.id));
                      if (inPlay) {
                        router.push(`/inplay/${value?.id}`);
                      } else {
                        router.push(`/sport/${value?.slug}`);
                      }
                    }}
                    style={
                      value.id === activeSport
                        ? {
                            paddingRight: "1rem",
                            background: "rgba(188, 146, 57, 0.07)",
                          }
                        : {
                            paddingRight: "1rem",
                            background: theme?.colors?.mainSecondary,
                          }
                    }
                    key={Math.random()}
                    sports={sports}
                  >
                    <div className="dropdown sidebarBox d-flex dropdownStyle ">
                      {showImage ? (
                        <Image
                          alt="img-sports"
                          src={value.icon}
                          className={
                            value.id === activeSport
                              ? "sports-icon sport-icon-active"
                              : " sports-icon"
                          }
                        />
                      ) : (
                        <span className="m-2 sports-icon"></span>
                      )}
                      <Button
                        className={
                          "btn dropdown-toggle popularDropdown profile top w-100 "
                        }
                        type="button"
                        text={
                          <>
                            {isMobile ? value.name + "" : ""}
                            {!(isMobile && largeScreen) ? "" : value.name}
                            {!bigScreenSidebarDisplay &&
                            largeScreen &&
                            !isMobile
                              ? value.name
                              : ""}
                          </>
                        }
                      />
                    </div>
                  </ProfileCard>
                </div>
              );
            })}
          </>
        ) : (
          <>
            {sportsData?.map((value, index) => {
              let showImage = true;
              if (value?.icon.indexOf("null") > -1) {
                showImage = false;
              }
              return (
                <div style={{ borderBottom: "1px solid #25292d" }} key={index}>
                  {
                    <ProfileCard
                      active={value.id === activeSport ? true : false}
                      onClick={() => {
                        handleUnsubscribe();
                        dispatch(setActiveSport(value.id));
                        if (inPlay) {
                          router.push(`/inplay/${value?.id}`);
                        } else {
                          router.push(`/sport/${value?.slug}`);
                        }
                      }}
                      style={
                        swiftyMenu !== true && value?.id === activeSport
                          ? {
                              paddingRight: "1rem",
                              background: "rgba(188, 146, 57, 0.07)",
                              borderLeft: `4px solid ${theme?.colors?.mainTertiary}`,
                            }
                          : {
                              paddingRight: "1rem",
                            }
                      }
                      key={Math.random()}
                      sports={sports}
                    >
                      <div className="dropdown sport-d d-flex">
                        {value.id === activeSport ? (
                          <div
                            className={
                              isActive
                                ? "active-left-border-miniSideBar"
                                : "inactive-left-border-miniSideBar"
                            }
                          ></div>
                        ) : (
                          <div className="inactive-left-border-miniSideBar"></div>
                        )}
                        {showImage ? (
                          <Image
                            alt="img-minisidebar"
                            src={value.icon}
                            className={
                              value.id === activeSport
                                ? "sports-icon-miniSidebar"
                                : "sports-icon-miniSidebar sports-icon-miniSidebar-minimized"
                            }
                          />
                        ) : (
                          <span className="m-2 sports-icon-miniSidebar"></span>
                        )}
                        <Button
                          className={
                            "btn dropdown-toggle popularDropdown profile top w-100"
                          }
                          type="button"
                          text={
                            <>
                              {!(!isMobile && bigScreenSidebarDisplay)
                                ? value.name
                                : ""}
                              {bigScreenSidebarDisplay &&
                              largeScreen &&
                              !isMobile
                                ? ""
                                : value.name}
                            </>
                          }
                        />
                      </div>
                    </ProfileCard>
                  }
                </div>
              );
            })}
          </>
        )}
      </>
    </SidebarProfile>
  );
};
