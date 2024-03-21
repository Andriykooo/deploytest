import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import "./Accordion.css";
import { ArrowIcon } from "@/utils/icons";

export const Accordion = ({ children, title, className, active }) => {
  const contentRef = useRef(null);

  const [isOpen, setIsOpen] = useState(active);
  const [contentHeight, setContentHeight] = useState(active ? "unset" : 0);

  useEffect(() => {
    if (isOpen) {
      if (contentHeight === 0) {
        setContentHeight(contentRef.current.scrollHeight);
      }

      if (contentHeight !== "unset") {
        setTimeout(() => {
          setContentHeight("unset");
        }, 300);
      }
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
            setContentHeight(0);
            setIsOpen(false);
          }
        }}
      >
        {title}
        <ArrowIcon
          className={classNames("dropdown-arrow", { active: isOpen })}
        />
      </div>
      {(isOpen || active) && (
        <div
          ref={contentRef}
          style={{ maxHeight: contentHeight }}
          className="custom-accordion-content"
        >
          {children}
        </div>
      )}
    </div>
  );
};
