"use client";

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Image from "next/image";
import { useSelector } from "react-redux";
import { LinkType } from "../LinkType/LinkType";
import { HeaderDiv } from "../header/HeaderDiv";
import { images } from "@/utils/imagesConstant";

const FooterMenu = ({ data, onClick }) => {
  const activePage = useSelector((state) => state.activePage);
  const footerLinksRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [swipeStarted, setSwipeStarted] = useState(false);

  const toggleFooterLinks = () => {
    setIsOpen(!isOpen);
  };

  const handleSwipe = (e) => {
    if (swipeStarted) {
      return;
    }

    const footerPosition = footerLinksRef.current.getBoundingClientRect().y;
    const swipePosition = e.targetTouches[0].clientY;

    if (!isOpen && footerPosition > swipePosition + 20) {
      setIsOpen(true);
      setSwipeStarted(true);
    }

    if (isOpen && footerPosition + 20 < swipePosition) {
      setIsOpen(false);
      setSwipeStarted(true);
    }
  };

  return (
    <div
      className={classNames("footerWrapper", { active: isOpen })}
      onTouchMove={handleSwipe}
      onTouchEnd={() => {
        setSwipeStarted(false);
      }}
    >
      <div
        ref={footerLinksRef}
        className="footerLineWrapper"
        onClick={toggleFooterLinks}
      >
        <div className="footerLine" />
      </div>
      <div
        className={classNames("footerIconsDiv", {
          active: isOpen,
          inline: data?.length < 5,
        })}
      >
        {data?.map((item, index) => {
          if (!isOpen && index === 4) {
            return (
              <div
                key={0}
                data-id={0}
                className="footerMenuIcon"
                onClick={toggleFooterLinks}
              >
                <div className="ps-1 sports-header-link">
                  <HeaderDiv className="header-link">
                    <div>
                      <Image src={images.dotVector} alt="more" />
                    </div>
                    <span className="footerSport">More</span>
                  </HeaderDiv>
                </div>
              </div>
            );
          }

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
                  path={item.path}
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
        })}
        {isOpen && (
          <div className="footerMenuIcon" onClick={toggleFooterLinks}>
            <div className="ps-1 sports-header-link">
              <HeaderDiv className="header-link">
                <div>
                  <Image src={images.dotVector} alt="less" />
                </div>
                <span className="footerSport">Less</span>
              </HeaderDiv>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterMenu;
