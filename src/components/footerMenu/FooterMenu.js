"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { LinkType } from "../LinkType/LinkType";
import { HeaderDiv } from "../header/HeaderDiv";
import { images } from "@/utils/imagesConstant";
import { useTranslations } from "next-intl";
import classNames from "classnames";

const FooterMenu = ({ data, onClick }) => {
  const t = useTranslations("common");
  const activePage = useSelector((state) => state.activePage);
  const footerLinksRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const isPWA = window.matchMedia("(display-mode: standalone)").matches;

  const toggleFooterLinks = () => {
    setIsOpen(!isOpen);
  };

  const mainItems = data?.slice(0, 4);

  // We need reduce with reverse to make sure that data sorting is okay
  const secondaryItems = data
    ?.slice(4, data.lenght)
    ?.reduce((result, value, index) => {
      if (index % 5 === 0) {
        result.push([]);
      }
      result[result.length - 1].push(value);
      return result;
    }, [])
    .reverse();

  const renderFooterMenuItem = (arr) => {
    return arr
      ?.filter((item) => item?.show_in_menu)
      ?.map((item) => {
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
                <HeaderDiv
                  active={item.id === activePage?.id}
                  className={
                    (item.id === item.id) === activePage?.id
                      ? "header-link active"
                      : "header-link"
                  }
                >
                  <Image src={item.icon} alt="page" height={24} width={24} />
                  <span className="footerSport">{item.name}</span>
                </HeaderDiv>
              </LinkType>
            </div>
          );
        }
      });
  };

  return (
    <div className={classNames("footerWrapper", { pwa: isPWA })}>
      <div
        ref={footerLinksRef}
        className="footerLineWrapper"
        onClick={toggleFooterLinks}
      >
        <div className="footerLine" />
      </div>
      <div
        style={{ height: isOpen && `${secondaryItems?.length * 72}px` }}
        className="secondaryItems"
      >
        {secondaryItems?.map((data, index) => {
          return (
            <div className="footerIconsDiv" key={index}>
              {renderFooterMenuItem(data)}
            </div>
          );
        })}
      </div>
      <div className="footerIconsDiv">
        {renderFooterMenuItem(mainItems)}
        <div className="footerMenuIcon" onClick={toggleFooterLinks}>
          <div className="ps-1 sports-header-link">
            <HeaderDiv className="header-link">
              <Image src={images.dotVector} alt="more-less" />
              <span className="footerSport">
                {isOpen ? t("less") : t("more")}
              </span>
            </HeaderDiv>
          </div>
        </div>
      </div>
      {isPWA && <div className="footerFade"></div>}
    </div>
  );
};

export default FooterMenu;
