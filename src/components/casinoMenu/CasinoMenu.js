import { Skeleton } from "@mui/material";
import classNames from "classnames";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { images } from "../../utils/imagesConstant";
import { useClickOutside } from "../../utils/useClickOutside";
import { Button } from "../button/Button";

const skeletonArray = Array(5).fill(null);

const CasinoMenu = ({
  data,
  search,
  setSearch,
  category,
  setCategory,
  isLoading,
}) => {
  const isMobile = useSelector((state) => state.setMobile);
  const inputRef = useRef(null);

  const [activeSearch, setActiveSearch] = useState(false);

  const handleActivateSearch = () => {
    if (isMobile) {
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
            <div className="menu" onClick={() => setCategory(null)}>
              <Button
                className={classNames("menu-link", {
                  selected: !category,
                })}
                type="button"
                text="Home"
              />
            </div>
            {data
              ?.filter((item) => item.games?.length > 0)
              ?.map((item) => {
                return (
                  <div
                    className="menu"
                    key={item.id}
                    onClick={() => setCategory(item)}
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
            <img src={images.search} alt="Search icon" className="searchIcon" />
            <input
              ref={inputRef}
              className={classNames("searchInput", { active: activeSearch })}
              type="text"
              placeholder={!isMobile ? "Search" : ""}
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
