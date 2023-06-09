import classNames from "classnames";
import Image from "next/image";
import { Button } from "../button/Button";
import "./BannerMenu.css";

export const BannerMenu = ({
  title,
  subtitle,
  image,
  options,
  selected,
  setSelected,
}) => {
  const handleClick = (item) => {
    setSelected(selected?.name === item.name ? null : item);
  };

  return (
    <div
      className="banner-menu"
      style={{ height: subtitle ? "115px" : "81px" }}
    >
      <Image src={image} alt="banner" className="banner-menu-image" fill />
      <div className="banner-menu-content">
        {title && <div className="banner-menu-title">{title}</div>}
        {subtitle && <div className="banner-menu-subtitle">{subtitle}</div>}
        <div className="banner-menu-filter">
          {options?.map((item, index) => {
            return (
              <Button
                key={index}
                onClick={() => handleClick(item)}
                className={classNames("banner-menu-button", {
                  selected: selected?.name === item.name,
                })}
                type="button"
                text={item.name}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
