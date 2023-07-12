"use client";

import { useDispatch, useSelector } from "react-redux";
import { setActivePage } from "../../store/actions";
import FooterMenu from "../footerMenu/FooterMenu";
import "../sidebar/Sidebar.css";
import { DesktopHeader } from "./DesktopHeader";
import "./Header.css";

function Header({headerData}) {
  const dispatch = useDispatch();
  const isMobile = useSelector((state) => state.setMobile);

  const handleClick = (item) => {
    if (item.type === "casino") {
      return;
    }

    dispatch(setActivePage(item));
  };

  return (
    <header>
      <nav className="navigation navbar-expand-lg  p-0">
        <div className="col-12 primary-col">
          <DesktopHeader data={headerData} onClick={handleClick} />
          {isMobile && <FooterMenu data={headerData} onClick={handleClick} />}
        </div>
      </nav>
    </header>
  );
}

export default Header;
