"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { LinkType } from "../LinkType/LinkType";
import { images } from "@/utils/imagesConstant";
import { useTranslations } from "@/hooks/useTranslations";
import classNames from "classnames";
import "./FooterMenu.css";

const FooterMenu = ({ data, onClick }) => {
  const t = useTranslations("common");
  const activePage = useSelector((state) => state.activePage);
  const footerLinksRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const isPWA = window.matchMedia("(display-mode: standalone)").matches;

  const toggleFooterLinks = () => {
    setIsOpen(!isOpen);
  };

  const itemsToShow = data?.filter((item) => item?.show_in_menu);
  const dataLength = itemsToShow?.length > 5;
  const mainItems = dataLength ? itemsToShow?.slice(0, 4) : itemsToShow;
  // We need reduce with reverse to make sure that data sorting is okay

  const secondaryItems = itemsToShow
    ?.filter((page) => page.show_in_menu)
    ?.slice(4, itemsToShow.length)
    ?.reduce((result, value, index) => {
      if (index % 5 === 0) {
        result.push([]);
      }
      result[result.length - 1].push(value);
      return result;
    }, [])
    .reverse();

  const renderFooterMenuItem = (data) => {
    return data?.map((item) => {
      if (item?.path) {
        return (
          <div
            key={item.id}
            data-id={item.id}
            className="footerMenuIcon"
            onClick={() => {
              onClick(item);
            }}
          >
            <LinkType
              onClick={() => {
                onClick(item);
              }}
              className="ps-1 sports-header-link"
              type={item.type}
              path={item.slug === "index" ? "/" : item.path}
              openType={item?.open_type}
              modalData={{
                slug: item.slug,
                title: item.name,
              }}
            >
              <div
                className={classNames("headerItem", {
                  active: item.id === activePage?.id,
                })}
              >
                <div className="headerItemImage">
                  {item?.icon && (
                    <Image src={item.icon} alt="page" height={24} width={24} />
                  )}
                </div>
                <span>{item.name}</span>
              </div>
            </LinkType>
          </div>
        );
      }
    });
  };

  return (
    <div className="footerWrapper">
      <div
        style={{
          bottom: isOpen && `100%`,
        }}
        className="secondaryItems"
      >
        {dataLength &&
          isOpen &&
          secondaryItems?.map((data, index) => {
            return (
              <div className="footerIconsDiv grid" key={index}>
                {renderFooterMenuItem(data)}
              </div>
            );
          })}
      </div>
      <div className={classNames("footerContent", { pwa: isPWA })}>
        <div
          ref={footerLinksRef}
          className="footerLineWrapper"
          onClick={toggleFooterLinks}
        >
          <div className="footerLine" />
        </div>
        <div
          className={classNames("footerIconsDiv", dataLength ? "grid" : "flex")}
        >
          {renderFooterMenuItem(mainItems)}
          {dataLength && (
            <div className="footerMenuIcon" onClick={toggleFooterLinks}>
              <div className="ps-1 sports-header-link">
                <div className="headerItem">
                  <Image
                    src={images.dotVector}
                    alt="more-less"
                    height={24}
                    width={24}
                  />
                  <span>{isOpen ? t("less") : t("more")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {isPWA && <div className="footerFade"></div>}
      </div>
    </div>
  );
};

export default FooterMenu;
