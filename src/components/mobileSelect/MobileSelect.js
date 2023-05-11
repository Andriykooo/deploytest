import classNames from "classnames";
import { useRef, useState } from "react";
import { ArrowDownIcon, CloseIcon } from "../../utils/icons";
import { useClickOutside } from "../../utils/useClickOutside";

export const MobileSelect = ({ data, selectedItem, placeholder, onSelect }) => {
  const autoselectRef = useRef(null);

  const [isOpened, setIsOpened] = useState(false);

  const open = (e) => {
    e?.stopPropagation();
    if (!isOpened) {
      setIsOpened(true);
      document.querySelector("body").classList.add("opened");
    }
  };

  const close = () => {
    if (isOpened) {
      setIsOpened(false);
      document.querySelector("body").classList.remove("opened");
    }
  };

  const handleSelect = (item) => {
    onSelect?.(item);
    close();
  };

  useClickOutside(autoselectRef, close);

  return (
    <div
      className={classNames(
        classNames({ dropdownFixedStyleComponent: isOpened })
      )}
      ref={autoselectRef}
      onClick={open}
    >
      <div className={classNames("competitions-select", { opened: isOpened })}>
        <span>{selectedItem?.label || placeholder}</span>
        {isOpened ? (
          <div onClick={close}>
            <CloseIcon />
          </div>
        ) : (
          <div onClick={open}>
            <ArrowDownIcon />
          </div>
        )}
      </div>
      {isOpened && (
        <div className="competitions-options">
          {data?.length > 0 ? (
            data?.map((item) => {
              return (
                <span
                  key={item.id}
                  className="competition-option"
                  onClick={() => {
                    handleSelect(item);
                  }}
                >
                  {item?.label}
                </span>
              );
            })
          ) : (
            <span className="competition-no-option">No options</span>
          )}
        </div>
      )}
    </div>
  );
};
