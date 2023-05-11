import React from "react";
import { images } from "../../utils/imagesConstant";

export const MenuIcon = ({ swiftyMenu, setSwiftyMenu }) => {
  return swiftyMenu ? (
    <img
      src={images.closeIcon}
      onClick={() => setSwiftyMenu(!swiftyMenu)}
      alt=""
      height={"30"}
      width={"30"}
      className="header-icon"
    />
  ) : (
    <img
      src={images.menuIcon}
      onClick={() => setSwiftyMenu(!swiftyMenu)}
      alt=""
      height={"30"}
      width={"30"}
      className="header-icon"
    />
  );
};
