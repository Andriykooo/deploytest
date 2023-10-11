import classNames from "classnames";
import Image from "next/image";
import { Button } from "../button/Button";
import "./BannerMenu.css";
import { LinkType } from "../LinkType/LinkType";

export const BannerMenu = ({
  title,
  subtitle,
  image,
  options,
  selected,
  setSelected,
  callToActinButton,
}) => {
  const handleClick = (item) => {
    setSelected(selected?.name === item.name ? null : item);
  };

  return (
    <div
      className="banner-menu"
      style={{ height: subtitle && options ? "115px" : "91px" }}
    >
      {image && (
        <Image
          src={image}
          alt="banner"
          className="banner-menu-image"
          fill
          priority
        />
      )}
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
        {callToActinButton?.name && (
          <LinkType
            type={callToActinButton?.type}
            path={callToActinButton?.path}
            openType={callToActinButton?.open_type}
            modalData={callToActinButton?.modalData}
          >
            <Button
              type="button"
              className="btnPrimary bannerButton buttonOfSlider cta"
              text={callToActinButton?.name}
            />
          </LinkType>
        )}
      </div>
    </div>
  );
};
