"use client";

import classNames from "classnames";
import Image from "next/image";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { setCasinoCategory } from "@/store/actions";
import { useTranslations } from "next-intl";
import "./CasinoMenu.css";
import { Carousel } from "../carousel/Carousel";

const CasinoMenu = ({ data, search, setSearch, category }) => {
  const t = useTranslations("common");
  const isTablet = useSelector((state) => state.isTablet);
  const inputRef = useRef(null);
  const categoriesRef = useRef(null);
  const dispatch = useDispatch();
  const [activeSearch, setActiveSearch] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const handleActivateSearch = () => {
    if (isTablet) {
      setActiveSearch(true);
      inputRef.current.focus();
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleMouseDown = (e) => {
    setStartX(e.pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!startX) return;
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const distanceX = x - startX;
    categoriesRef.current.scrollLeft = scrollLeft - distanceX;
  };

  const handleMouseUp = () => {
    setStartX(null);
  };

  const handleMouseLeave = () => {
    setStartX(null);
  };

  const returnHome = () => {
    return (
      <div className="menu" onClick={() => dispatch(setCasinoCategory(null))}>
        <Button
          className={classNames("menu-link", {
            selected: !category,
          })}
          type="button"
          text={t("home")}
        />
      </div>
    );
  };

  return (
    <div className="casinoMenu">
      <div
        className="categories"
        ref={categoriesRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <Carousel
          center
          data={[
            ...[{ id: "home_casino_button", render: returnHome() }],
            ...(data
              ? data
                  .filter((item) => item.games && item.games.length > 0) // Ensure item.games is not null or undefined
                  .map((item) => ({
                    id: item.id,
                    render: (
                      <div
                        className="menu"
                        key={item.id}
                        onClick={() => {
                          dispatch(setCasinoCategory(item));
                        }}
                      >
                        <Button
                          className={classNames("menu-link", {
                            selected: category?.id === item?.id,
                          })}
                          type="button"
                          text={item.title}
                        />
                      </div>
                    ),
                  }))
              : []),
          ]}
        />
      </div>
      <div className="casino-search" onClick={handleActivateSearch}>
        <Image
          src={images.search}
          alt="Search icon"
          className="searchIcon"
          height={20}
          width={20}
        />
        <form>
          <input
            ref={inputRef}
            className={classNames("searchInput", { active: activeSearch })}
            type="text"
            placeholder={!isTablet ? t("search") : ""}
            value={search}
            onChange={handleSearch}
          />
        </form>
      </div>
    </div>
  );
};

export default CasinoMenu;
