import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/socket";
import { setHeaderData } from "../../store/actions";
import FooterMenu from "../footerMenu/FooterMenu";
import { PageContentModal } from "../pageContentModal/PageContentModal";
import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";

function Header() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { gamingSocket } = useContext(SocketContext);

  const isMobile = useSelector((state) => state.setMobile);
  const headerData = useSelector((state) => state.headerData);

  const [modalData, setModalData] = useState(null);
  const [swiftyProfile, setSwiftyProfile] = useState(false);
  const [showBetSlip, setShowBetSlip] = useState(
    (router.pathname.indexOf("/match") > -1 ||
      router.pathname.indexOf("/sports") > -1 ||
      router.pathname.indexOf("/home") > -1 ||
      router.pathname === "/" ||
      router.pathname.indexOf("/inplay") > -1) &&
      document.documentElement.clientWidth < 1400
      ? true
      : false
  );

  const handleClick = (item) => {
    if (item.type === "sport") {
      router.push(`/sport${item.path}`);
    }

    if (item.type === "page") {
      setModalData(item);
    }

    if (
      item.type === "generic" ||
      item.type === "layout" ||
      item.type === "casino"
    ) {
      router.push(item.path);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const resizeHandler = () => {
    if (
      (router.pathname.indexOf("/match") > -1 ||
        router.pathname.indexOf("/sports") > -1 ||
        router.pathname.indexOf("/inplay") > -1) &&
      document.documentElement.clientWidth < 1400
    ) {
      setShowBetSlip(true);
    } else {
      setShowBetSlip(false);
    }
  };

  useEffect(() => {
    gamingSocket.emit("main_menu", {}, (response) => {
      dispatch(setHeaderData(response));
    });
  }, []);

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg  p-0">
          <div className="col-12 primary-col">
            {!isMobile ? (
              <DesktopHeader
                showBetSlip={showBetSlip}
                data={headerData}
                onClick={handleClick}
              />
            ) : (
              <>
                <MobileHeader
                  swiftyProfile={swiftyProfile}
                  setSwiftyProfile={setSwiftyProfile}
                  showBetSlip={showBetSlip}
                  setShowBetSlip={setShowBetSlip}
                />
                <FooterMenu data={headerData} onClick={handleClick} />
              </>
            )}
          </div>
        </nav>
      </header>
      <PageContentModal data={modalData} setData={setModalData} />
    </>
  );
}

export default Header;
