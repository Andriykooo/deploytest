import { images } from "@/utils/imagesConstant";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSport, setSidebarLeft } from "../../store/actions";
import { LinkType } from "../LinkType/LinkType";
import { Carousel } from "../carousel/Carousel";
import { HeaderDiv } from "./HeaderDiv";
import { MenuIcon } from "./MenuIcon";
import { Profile } from "./porfile/Profile";

export const DesktopHeader = ({ data, onClick }) => {
  const dispatch = useDispatch();
  const sidebaLeft = useSelector((state) => state.sidebarLeft);
  const isMobile = useSelector((state) => state.setMobile);
  const loggedUser = useSelector((state) => state.loggedUser);
  const activePage = useSelector((state) => state.activePage);

  const toggleSidebarLeft = (value) => {
    dispatch(
      setSidebarLeft({
        ...sidebaLeft,
        isActive: value,
      })
    );
  };

  const homePage = data?.find((page) => page.path === "/home");

  return (
    <>
      <div className="justify-content-between d-flex align-items-center">
        {isMobile ? (
          <div className="d-flex align-items-center">
            <div className={"ps-3 me-3"}>
              <MenuIcon
                swiftyMenu={sidebaLeft.isActive}
                setSwiftyMenu={toggleSidebarLeft}
              />
            </div>
            <Link href={"/home"} className="logo">
              <Image
                height={30}
                width={30}
                src={images.gamingMobile}
                className="h-100"
                alt="Swifty Gaming Logo"
              />
            </Link>
          </div>
        ) : (
          <div className="swifty-gaming">
            <Link href={"/home"}>
              <Image
                height={30}
                width={195}
                alt="img-GroupSwifty"
                src={images.GroupSwifty}
                onClick={() => dispatch(setActiveSport("0"))}
              />
            </Link>
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
                <Carousel center>
                  {data?.map((item, index) => {
                    return (
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
                            />
                          )}

                          <span className="ps-1 sports-header-link">
                            {item.name}
                          </span>
                        </HeaderDiv>
                      </LinkType>
                    );
                  })}
                </Carousel>
              )}
            </div>
          </div>
        )}
        <Profile />
      </div>
    </>
  );
};
