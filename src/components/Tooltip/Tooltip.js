"use client";

import classNames from "classnames";
import { useSelector } from "react-redux";
import "./Tooltip.css";

export const Tooltip = () => {
  const tooltip = useSelector((state) => state.tooltip);

  return (
    tooltip && (
      <div
        style={{ transform: `translate(${tooltip?.x}px, ${tooltip?.y + (tooltip.height + 5)}px)` }}
        className={classNames("custom-tooltip", tooltip?.className)}
      >
        <div className="custom-tooltip-content">
          <div
            className="custom-tooltip-message"
            style={{
              transform: `translateX(calc(-100% + ${tooltip.width}px + 12px))`,
            }}
          >
            {tooltip?.message} <div className="custom-tooltip-arrow" />
          </div>
        </div>
      </div>
    )
  );
};
