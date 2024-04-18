"use client";

import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setTooltip } from "@/store/actions";
import "./Tooltip.css";

export const Tooltip = () => {
  const dispatch = useDispatch();
  const tooltip = useSelector((state) => state.tooltip);

  const close = () => {
    dispatch(setTooltip(null));
  };

  useEffect(() => {
    if (tooltip) {
      const content = document.getElementById("content");

      content.addEventListener("scroll", close);

      return () => {
        content.removeEventListener("scroll", close);
      };
    }
  }, [tooltip]);

  return (
    tooltip && (
      <div
        style={{
          transform: `translate(${tooltip?.x}px, ${
            tooltip?.y + (tooltip.height + 5)
          }px)`,
        }}
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
