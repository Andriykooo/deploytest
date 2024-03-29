import { useDispatch, useSelector } from "react-redux";
import { setSidebarLeft } from "@/store/actions";
import { useTranslations } from "next-intl";
import { SearchCloseIcon, SearchIcon } from "@/utils/icons";
import classNames from "classnames";
import { _debounce } from "@/helpers/debounce";
import { useEffect, useState } from "react";

const debounce = _debounce();

export const Search = ({ handleSearch, searchValue, setSearchData }) => {
  const t = useTranslations("common");
  const dispatch = useDispatch();
  const sidebarLeft = useSelector((state) => state.sidebarLeft);
  const isTablet = useSelector((state) => state.isTablet);
  const [value, setValue] = useState(searchValue);

  const onClickSearch = () => {
    dispatch(
      setSidebarLeft({
        ...sidebarLeft,
        isActive: true,
      })
    );
  };

  useEffect(() => {
    if (!isTablet && value && !sidebarLeft.isActive) {
      setValue("");
    }
  }, [sidebarLeft.isActive]);

  useEffect(() => {
    if (!isTablet && value) {
      setValue("");
      setSearchData({
        data: sidebarLeft.data,
        value: "",
      });
    }
  }, [isTablet]);

  return (
    <div className="position-relative">
      <form>
        <label className="sport-d d-flex search-label" onClick={onClickSearch}>
          <SearchIcon />
          <input
            value={value}
            className={classNames("input-search-sports", {
              active: sidebarLeft.isActive,
            })}
            placeholder={t("search")}
            onChange={(e) => {
              debounce(() => handleSearch(e.target.value)),
                setValue(e.target.value);
            }}
          />
        </label>
      </form>
      {
        <SearchCloseIcon
          onClick={() => {
            handleSearch(""), setValue("");
          }}
          className={classNames("search-close-icon-container", {
            "is-active": sidebarLeft.isActive && value,
          })}
        />
      }
    </div>
  );
};
