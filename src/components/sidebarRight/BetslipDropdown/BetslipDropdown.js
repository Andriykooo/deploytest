import Image from "next/image";
import "./BetslipDropdown.css";
import { images } from "@/utils/imagesConstant";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

export const BetslipDropdown = ({ name, status, show, active, children }) => {

  const contentRef = useRef(null);
  
  const [isActive, setIsActive] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const toggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (show) {
      setIsActive(active);
    }
  }, [active, show]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isActive ? contentRef.current.scrollHeight : 0);
    }
  }, [isActive, children]);

  return show ? (
    <div>
      <div className="betslip-dropdown-head" onClick={toggle}>
        <span className="betslip-dropdown-name">{name}</span>
        <div
          className={classNames("betslip-dropdown-toggler", {
            active: isActive,
          })}
        >
          {status && <span className="betslip-dropdown-status">{status}</span>}
          <Image width={14} height={8} alt="arrow" src={images.arrowIcon} />
        </div>
      </div>
      <div
        ref={contentRef}
        style={{ maxHeight: contentHeight }}
        className={classNames("betslip-dropdown-content", { active: isActive })}
      >
        {children}
      </div>
    </div>
  ) : (
    children
  );
};
