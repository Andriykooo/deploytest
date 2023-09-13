import classNames from "classnames";
import Image from "next/image";
import { images } from "@/utils/imagesConstant";
import { useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { CloseIcon } from "../../utils/icons";

export const MobileSelect = ({ data, selectedItem, placeholder, onSelect }) => {
  const autoselectRef = useRef(null);

  const [isOpened, setIsOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredItems = data.filter((item) =>
      item.label.toLowerCase().includes(query)
    );

    setFilteredData(filteredItems);
  };

  useClickOutside(autoselectRef, close);

  return (
    <>
      <div onClick={open}>
        <div className="competitions-select">
          <span>{selectedItem?.label || placeholder}</span>
          <div className="dropdown-toggler">
            <Image
              src={images.arrowIcon}
              alt="arrow"
              width={14}
              height={14}
              className={classNames("dropdown-arrow", { active: isOpened })}
            />
          </div>
        </div>
      </div>
      {isOpened && (
        <div className="dropdownFixedStyleComponent" ref={autoselectRef}>
          <div className="competitions-select_title competitions-select_name">
            <span>{placeholder}</span>
            <div onClick={close}>
              <CloseIcon />
            </div>
          </div>
          {placeholder !== 'Region' && (
            <div className="competitions-select_item">
              <label className="search_wrapper">
                <Image alt="img-sports" width={20} height={20} src={images.search} />
                <input
                  type={"text"}
                  className="competitions_search"
                  placeholder="Search"
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
                  className={selectedItem?.id === item?.id ? "competitions-select_item-active" : "competitions-select_item"}
                  onClick={() => {
                    handleSelect(item);
                  }}
                >
                  {item?.label}
                </span>
              );
            })
          ) : (
            <div className="relative"><span className="competition-no-option">No options</span></div>
          )}
        </div>
      )}
    </>
  );
};
