import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import { useSelector } from "react-redux";
import "./menuBarEmpty.css";
import classNames from "classnames";

export const MenuBarEmpty = ({ message, icon = "closeRounded" }) => {
  const sidebarLeft = useSelector((state) => state.sidebarLeft);
  const isActive = sidebarLeft.isActive;
  const imageSize = isActive ? 64 : 36;

  return (
    <div className="menu-bar-empty">
      <Image
        src={images[icon]}
        alt="warning"
        className={classNames({ "mb-3": isActive })}
        height={imageSize}
        width={imageSize}
      />
      {isActive && <div className="menu-bar-empty-massage">{message}</div>}
    </div>
  );
};
