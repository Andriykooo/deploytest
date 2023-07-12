"use client";

import classNames from "classnames";
import Image from "next/image";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { LinkType } from "../LinkType/LinkType";
import { HeaderDiv } from "../header/HeaderDiv";

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
      <div className={classNames("footerIconsDiv", { active: isOpen })}>
        {data?.map((item, index) => {
          return (
            <div
              key={index}
              data-id={index}
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
                  <Image
                    onError={(e) => {
                      e.target.style.opacity = "0";
                    }}
                    src={item.icon}
                    alt="page"
                    height={24}
                    width={24}
                  />
                  <span className="footerSport">{item.name}</span>
                </HeaderDiv>
              </LinkType>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FooterMenu;
