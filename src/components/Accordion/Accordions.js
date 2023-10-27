import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./Accordion.css";

const classNames = require("classnames");

export const Accordion = ({ children, title, className, active }) => {
  const contentRef = useRef(null);

  const [isOpen, setIsOpen] = useState(active || false);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current && isOpen) {
      setContentHeight(contentRef.current.scrollHeight);

      setTimeout(() => {
        setContentHeight("unset");
      }, 300);
    }
  }, [isOpen, children]);

  return (
    <div className={classNames("custom-accordion", className)}>
      <div
        className="custom-accordion-header"
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setContentHeight(contentRef.current.scrollHeight);

            setTimeout(() => {
              setContentHeight(0);
            }, 0);

            setTimeout(() => {
              setIsOpen(false);
            }, 300);
          }
        }}
      >
        {title}
        <Image
          src={images.arrowIcon}
          alt={"arrow"}
          width={14}
          height={14}
          className={classNames("dropdown-arrow", { active: isOpen })}
        />
      </div>
      {(isOpen || active) && (
        <div
          ref={contentRef}
          style={{ maxHeight: contentHeight }}
          className={classNames("custom-accordion-content", {
            active: false,
          })}
        >
          {children}
        </div>
      )}
    </div>
  );
};
