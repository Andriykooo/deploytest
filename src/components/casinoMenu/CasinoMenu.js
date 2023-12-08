"use client";

import { Skeleton } from "@mui/material";
import classNames from "classnames";
import Image from "next/image";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useClickOutside } from "../../hooks/useClickOutside";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { setCasinoCategory } from "@/store/actions";
import { useTranslations } from "next-intl";
import "./CasinoMenu.css";

const skeletonArray = Array(5).fill(null);

const CasinoMenu = ({ data, search, setSearch, category, isLoading }) => {
  const t = useTranslations("common");
  const isTablet = useSelector((state) => state.isTablet);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const [activeSearch, setActiveSearch] = useState(false);

  const handleActivateSearch = () => {
    if (isTablet) {
      setActiveSearch(true);
      inputRef.current.focus();
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useClickOutside(inputRef, () => {
    setActiveSearch(false);
  });

  return (
    <div className="casinoMenu">
      {isLoading ? (
        <>
          {skeletonArray.map((_, index) => (
            <Skeleton
              key={index}
              className="my-2"
              variant="text"
              sx={{
                bgcolor: "#212536",
                width: "100px",
                height: "100%",
              }}
            />
          ))}
          <div className="casino-search">
            <input className="searchInput" type="text" />
          </div>
        </>
      ) : (
        <>
          <div className="categories">
            <div
              className="menu"
              onClick={() => dispatch(setCasinoCategory(null))}
            >
              <Button
                className={classNames("menu-link", {
                  selected: !category,
                })}
                type="button"
                text={t("home")}
              />
            </div>
            {data
              ?.filter((item) => item.games?.length > 0)
              ?.map((item) => {
                return (
                  <div
                    className="menu"
                    key={item.id}
                    onClick={() => {
                      dispatch(
                        setCasinoCategory(
                          category?.id !== item?.id ? item : null
                        )
                      );
                    }}
                  >
                    <Button
                      className={classNames("menu-link", {
                        selected: item?.id === category?.id,
                      })}
                      type="button"
                      text={item.title}
                    />
                  </div>
                );
              })}
          </div>
          <div className="casino-search" onClick={handleActivateSearch}>
            <Image
              src={images.search}
              alt="Search icon"
              className="searchIcon"
              height={20}
              width={20}
            />
            <input
              ref={inputRef}
              className={classNames("searchInput", { active: activeSearch })}
              type="text"
              placeholder={!isTablet ? t("search") : ""}
              value={search}
              onChange={handleSearch}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CasinoMenu;
