import classNames from "classnames";
import Image from "next/image";
import { images } from "@/utils/imagesConstant";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { ArrowIcon } from "@/icons/ArrowIcon";
import { CloseIcon } from "@/icons/CloseIcon";
import { useTranslations } from "@/hooks/useTranslations";
import "../matches/Matches.css";

export const MobileSelect = ({
  data,
  selectedItem,
  placeholder,
  onSelect,
  setIsOpenSelect,
}) => {
  const t = useTranslations("common");
  const autoselectRef = useRef(null);
  const [isOpened, setIsOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const open = (e) => {
    e?.stopPropagation();
    if (!isOpened) {
      setIsOpened(true);
      setIsOpenSelect?.(true);
      document.querySelector("body").classList.add("opened");
    }
  };
  const close = () => {
    if (isOpened) {
      setIsOpened(false);
      setIsOpenSelect?.(false);
      document.querySelector("body").classList.remove("opened");
    }
  };

  const handleSelect = (item) => {
    onSelect?.(item);
    close();
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredItems = data.filter((item) =>
      item.label.toLowerCase().includes(query)
    );

    setFilteredData(filteredItems);
  };

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  useClickOutside(autoselectRef, close);

  return (
    <>
      <div className="competitions-select" onClick={open}>
        <span>{selectedItem?.label || placeholder}</span>
        <div className="dropdown-toggler">
          <ArrowIcon
            className={classNames("dropdown-arrow", { active: isOpened })}
          />
        </div>
      </div>
      <div
        className={classNames("dropdownFixedStyleComponent", {
          active: isOpened,
        })}
        ref={autoselectRef}
      >
        <div className="competitions-select_title competitions-select_name">
          <span>{placeholder}</span>
          <div onClick={close}>
            <CloseIcon />
          </div>
        </div>
        {placeholder !== t("region") && (
          <div className="competitions-select_item">
            <label className="search_wrapper">
              <Image
                alt={t("sports")}
                width={20}
                height={20}
                src={images.search}
              />
              <input
                type={"text"}
                className="competitions_search"
                placeholder={t("search")}
                value={searchQuery}
                onChange={handleSearch}
              />
            </label>
          </div>
        )}
        {filteredData?.length > 0 ? (
          filteredData?.map((item) => {
            return (
              <span
                key={item.id}
                className={
                  selectedItem?.id === item?.id
                    ? "competitions-select_item-active"
                    : "competitions-select_item"
                }
                onClick={() => {
                  handleSelect(item);
                }}
              >
                {item?.label}
              </span>
            );
          })
        ) : (
          <div className="relative">
            <span className="competition-no-option">{t("no_options")}</span>
          </div>
        )}
      </div>
    </>
  );
};
