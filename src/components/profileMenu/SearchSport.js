import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarLeft } from "@/store/actions";
import { images } from "../../utils/imagesConstant";
import { ProfileCard } from "./Styled";
import { useClientTranslation } from "@/app/i18n/client";

export const Search = ({ handleSearch }) => {
  const { t } = useClientTranslation("common");
  const dispatch = useDispatch();
  const sidebaLeft = useSelector((state) => state.sidebarLeft);

  const onClickSearch = () => {
    dispatch(
      setSidebarLeft({
        ...sidebaLeft,
        isActive: true,
      })
    );
  };

  return (
    <ProfileCard className="search-profile-card" sports>
      <label className="d-flex align-items-center" onClick={onClickSearch}>
        <Image alt="img-sports" src={images.search} className={"sports-icon"} />
        <input
          type={"text"}
          className="input-search-sports dropdown-toggle popularDropdown profile top w-100"
          placeholder={t("search")}
          onKeyUp={(e) => handleSearch(e.target.value)}
        />
      </label>
    </ProfileCard>
  );
};
