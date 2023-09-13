import classNames from "classnames";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { setSidebarLeft } from "../../store/actions";
import { LinkType } from "../LinkType/LinkType";
import { Carousel } from "../carousel/Carousel";
import { Logo } from "../logo/Logo";
import { HeaderDiv } from "./HeaderDiv";
import { MenuIcon } from "./MenuIcon";
import { Profile } from "./porfile/Profile";

export const DesktopHeader = ({ data, onClick, handleNavigateHome }) => {
  const dispatch = useDispatch();
  const sidebaLeft = useSelector((state) => state.sidebarLeft);
  const isMobile = useSelector((state) => state.setMobile);
  const isTablet = useSelector((state) => state.isTablet);

  const loggedUser = useSelector((state) => state.loggedUser);
  const activePage = useSelector((state) => state.activePage);
  const pathname = usePathname();

  const toggleSidebarLeft = (value) => {
    dispatch(
      setSidebarLeft({
        ...sidebaLeft,
        isActive: value,
      })
    );
  };

  // hide burger menu in the casino page
  const showMenuIcon = !pathname.startsWith('/casino')

  return (
    <>
      <div className="justify-content-between d-flex align-items-center">
        {isTablet ? (
          <div className="d-flex align-items-center">
            {showMenuIcon ? (
              <div className="ps-3 me-3">
                <MenuIcon
                  swiftyMenu={sidebaLeft.isActive}
                  setSwiftyMenu={toggleSidebarLeft}
                />
              </div>
            ) : (
              <div className="me-3" />
            )}
            <Logo handleNavigateHome={handleNavigateHome} />
          </div>
        ) : (
          <div className="swifty-gaming">
            <Logo handleNavigateHome={handleNavigateHome} />
          </div>
        )}

        {!isMobile && (
          <div
            className={classNames("container-nav-links", {
              unlogged: !loggedUser?.user_data,
            })}
          >
            <div className="navBarLinks">
              {data && (
                <Carousel
                  center
                  data={data?.map((item, index) => {
                    return {
                      id: item.id,
                      render: (
                        <LinkType
                          key={index}
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
                          <HeaderDiv
                            data-id={index}
                            active={item.id === activePage?.id}
                            className={"header-link active"}
                          >
                            {item?.icon && (
                              <Image
                                src={item.icon}
                                alt="page"
                                height={16}
                                width={16}
                                onError={(e) => e.target.style.display = "none"}
                              />
                            )}

                            <span className="ps-1 sports-header-link">
                              {item.name}
                            </span>
                          </HeaderDiv>
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
