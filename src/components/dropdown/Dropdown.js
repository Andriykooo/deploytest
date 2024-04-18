import { useEffect, useRef, useState } from "react";
import { Button } from "../button/Button";
import classNames from "classnames";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ArrowIcon } from "@/icons/ArrowIcon";
import "./Dropdown.css";

export const Dropdown = ({ data, onSelect, selectedItem }) => {
  const dropdownRef = useRef(null);

  const [activeItem, setActiveItem] = useState(data[0]);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setActiveItem(selectedItem);
    }
  }, [selectedItem]);

  useClickOutside(dropdownRef, close);

  return (
    <div className="dropdown-wrapper">
      <div className="dropdown-toggler" onClick={toggle}>
        {activeItem?.label}
        <ArrowIcon
          className={classNames("dropdown-arrow", { active: isOpen })}
        />
      </div>
      {isOpen && (
        <ul className="dropdown-list" ref={dropdownRef}>
          {data.map((item) => {
            return (
              <li key={item.id}>
                <Button
                  text={item.label}
                  className={classNames("dropdown-button", {
                    active: activeItem?.id === item?.id,
                  })}
                  onClick={() => {
                    onSelect?.(item);
                    setActiveItem(item);
                    close();
                  }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
