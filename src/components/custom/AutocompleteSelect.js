import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowDownIcon } from "@/icons/ArrowDownIcon";
import { CloseIcon } from "@/icons/CloseIcon";
import { MobileSelect } from "../mobileSelect/MobileSelect";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import { useClickOutside } from "@/hooks/useClickOutside";
import "./AutocmopleteSelect.css";
import classNames from "classnames";

export const AutocompleteSelect = ({
  placeholder,
  data,
  onSelect,
  selectedItem,
  ignorePageChange = false,
}) => {
  const pathname = usePathname();
  const t = useTranslations("common");
  const autoselectRef = useRef(null);

  const isTablet = useSelector((state) => state.isTablet);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const handleSelect = (item) => {
    onSelect(item);
    setSearch("");
    setIsOpen(false);
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSearch("");

    if (!selectedItem) {
      setInput("");
    }
  };

  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  const reset = (e) => {
    e.preventDefault();
    setSearch("");
    setInput("");
    setIsOpen(false);
    onSelect(null);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setInput(value);
    setSearch(value);
  };

  useClickOutside(autoselectRef, close);

  useEffect(() => {
    if (!ignorePageChange) onSelect?.(null);
  }, [pathname]);

  useEffect(() => {
    setInput(selectedItem?.label || "");
  }, [selectedItem]);

  const filteredData = data.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return !isTablet ? (
    <div ref={autoselectRef} className="autoselectWrapper">
      <label className="autoselect">
        <input
          className="autoselectInput"
          onClick={toggle}
          value={input}
          onChange={handleChange}
          placeholder={placeholder}
        />
        {selectedItem && (
          <CloseIcon className="autoselectReset" onClick={reset} />
        )}
        <ArrowDownIcon
          className={classNames("autoselectArrow", { active: isOpen })}
        />
      </label>
      {isOpen && (
        <ul className="autoselectList">
          {filteredData.length > 0 ? (
            filteredData.map((item) => {
              return (
                <li
                  className={classNames("autoselectListItem", {
                    active: selectedItem?.id === item.id,
                  })}
                  key={item.id}
                  onClick={() => handleSelect(item)}
                >
                  {item.label}
                </li>
              );
            })
          ) : (
            <li className="autoselectListItem">{t("no_options")}</li>
          )}
        </ul>
      )}
    </div>
  ) : (
    <MobileSelect
      data={data}
      selectedItem={selectedItem}
      placeholder={placeholder}
      onSelect={handleSelect}
    />
  );
};
