import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarLeft } from "@/store/actions";
import { images } from "../../utils/imagesConstant";
import { ProfileCard } from "./Styled";

export const Search = ({ handleSearch }) => {
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
          placeholder="Search"
          onKeyUp={(e) => handleSearch(e.target.value)}
        />
      </label>
    </ProfileCard>
  );
};
