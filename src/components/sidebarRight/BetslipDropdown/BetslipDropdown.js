import "./BetslipDropdown.css";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { ArrowIcon } from "@/utils/icons";

export const BetslipDropdown = ({
  name,
  status,
  show,
  active,
  className,
  renderHead,
  children,
}) => {
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
    <div className={classNames(className)}>
      {renderHead ? (
        <div onClick={toggle}>{renderHead(isActive)}</div>
      ) : (
        <div className="betslip-dropdown-head" onClick={toggle}>
          <div
            className={classNames("betslip-dropdown-toggler", {
              active: isActive,
            })}
          >
            <span className="betslip-dropdown-name">{name}</span>

            {status && (
              <span className="betslip-dropdown-status">{status}</span>
            )}
            <ArrowIcon />
          </div>
        </div>
      )}
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
