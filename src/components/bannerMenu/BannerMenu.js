import classNames from "classnames";
import { Button } from "../button/Button";
import { LinkType } from "../LinkType/LinkType";
import Image from "next/image";
import "./BannerMenu.css";
import { Carousel } from "../carousel/Carousel";

export const BannerMenu = ({
  title,
  subtitle,
  image,
  options,
  selected,
  setSelected,
  callToActinButton,
  disableCta,
  className,
}) => {
  const handleClick = (item) => {
    setSelected(item);
  };

  return (
    <div className={classNames("banner-menu", className)}>
      <div className="banner-menu-content">
        {image && (
          <Image
            src={image}
            alt="banner"
            fill
            priority
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        <div className="banner-menu-title">
          {title && <span>{title}</span>}
          {!disableCta && callToActinButton?.name && (
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
        {subtitle && <div className="banner-menu-subtitle">{subtitle}</div>}
        <div className="banner-menu-filter">
          <Carousel
            arrowClassName="banner-arrow-wrapper"
            data={options.map((item, index) => {
              return {
                id: item.id,
                render: (
                  <Button
                    key={index}
                    onClick={() => handleClick(item)}
                    className={classNames("banner-menu-button", {
                      selected: selected?.slug === item.slug,
                    })}
                    type="button"
                    text={item.name}
                  />
                ),
              };
            })}
          />
        </div>
      </div>
    </div>
  );
};
