import classNames from "classnames";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarLeft } from "../../store/actions";
import { LinkType } from "../LinkType/LinkType";
import { Carousel } from "../carousel/Carousel";
import { Logo } from "../logo/Logo";
import { MenuIcon } from "./MenuIcon";
import { Profile } from "./porfile/Profile";
import { useClientPathname } from "@/hooks/useClientPathname";
import { enableSidebarRoutes } from "@/utils/constants";
import { MobileSiderbarActive } from "./MobileSidebarActive";

export const DesktopHeader = ({ data, onClick, handleNavigateHome }) => {
  const dispatch = useDispatch();
  const { pathname } = useClientPathname();

  const sidebaLeft = useSelector((state) => state.sidebarLeft);
  const isMobile = useSelector((state) => state.setMobile);
  const isTablet = useSelector((state) => state.isTablet);
  const loggedUser = useSelector((state) => state.loggedUser);
  const activePage = useSelector((state) => state.activePage);
  const showMenuIcon = useSelector((state) => state.showMenuIcon);

  const toggleSidebarLeft = (value) => {
    dispatch(
      setSidebarLeft({
        ...sidebaLeft,
        isActive: value,
      })
    );
  };

  // hide burger menu in the casino page
  const isCasinoPage = pathname.startsWith("/casino");
  const enableSidebar = enableSidebarRoutes.some((path) =>
    pathname.includes(path)
  );

  return (
    <>
      <div className="justify-content-between d-flex align-items-center h-100">
        {isTablet && !sidebaLeft.isActive ? (
          <div className="d-flex align-items-center">
            <div
              className={classNames("menuIcon ms-3", {
                active: enableSidebar || (showMenuIcon && !isCasinoPage),
              })}
            >
              <MenuIcon
                swiftyMenu={sidebaLeft.isActive}
                setSwiftyMenu={toggleSidebarLeft}
              />
            </div>
            <Logo handleNavigateHome={handleNavigateHome} />
          </div>
        ) : !isTablet ? (
          <div className="swifty-gaming">
            <Logo handleNavigateHome={handleNavigateHome} />
          </div>
        ) : (
          <MobileSiderbarActive handleNavigateHome={handleNavigateHome} />
        )}

        {!isMobile && (!isTablet || !sidebaLeft.isActive) && (
          <div
            className={classNames("container-nav-links", {
              unlogged: !loggedUser?.user_data,
            })}
          >
            <div className="navBarLinks">
              {data && (
                <Carousel
                  disableScrollToTab
                  center
                  data={data
                    ?.filter((item) => item?.show_in_menu)
                    ?.map((item) => {
                      return {
                        id: item.id,
                        render: (
                          <LinkType
                            type={item.type}
                            openType={item.open_type}
                            path={item.path}
                            modalData={{
                              slug: item.path.substring(1).replaceAll("-", "_"),
                              title: item.name,
                            }}
                            onClick={() => {
                              onClick(item);
                            }}
                          >
                            <div
                              className={classNames("headerItem", {
                                active: item.id === activePage?.id,
                              })}
                              data-id={item.id}
                            >
                              {item?.icon && (
                                <Image
                                  src={item.icon}
                                  alt="page"
                                  height={16}
                                  width={16}
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              )}

                              <span className="ps-1 sports-header-link">
                                {item.name}
                              </span>
                            </div>
                          </LinkType>
                        ),
                      };
                    })}
                />
              )}
            </div>
          </div>
        )}

        <Profile />
      </div>
    </>
  );
};
