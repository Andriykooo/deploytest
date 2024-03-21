import React from "react";
import classNames from "classnames";
import { InfoIcon } from "@/utils/icons";
import { useTranslations } from "next-intl";

const FreeCreditSelect = ({
  freeBet,
  active,
  onSelect,
  symbol,
  id,
  onIconClick,
  disabled,
}) => {
  const t = useTranslations();

  const sports = freeBet?.sportNames?.map((sport) => sport?.name);

  return (
    <div
      className={classNames("free-credit-select", {
        active: active,
        disabled: disabled,
      })}
    >
      <div
        className="d-flex info-icon"
        onClick={() => !disabled && onIconClick()}
      >
        <InfoIcon fill={disabled && "#979797"} />
      </div>

      <div className="free-credit-info">
        <div>
          {symbol}
          {freeBet.amount + " "}
          {t("common.free_credit")}
          {sports?.length > 0 && " (" + sports?.join(", ") + ")"}
        </div>
      </div>

      <div className="select d-flex align-item-center justify-content-end">
        <input
          type="radio"
          id={id}
          onClick={() => {
            if (!disabled) {
              if (active) onSelect("");
              else onSelect(freeBet);
            }
          }}
          checked={active}
        />

        <label htmlFor={id} className="radio-label">
          <span className="radio-border"></span>
        </label>
      </div>
    </div>
  );
};

export default FreeCreditSelect;
