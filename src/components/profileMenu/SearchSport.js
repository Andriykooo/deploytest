import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import { ProfileCard } from "./Styled";

export const Search = ({ handleSearch }) => {
  return (
    <ProfileCard className="search-profile-card" sports>
      <Image alt="img-sports" src={images.search} className={"sports-icon"} />
      <input
        type={"text"}
        className="input-search-sports dropdown-toggle popularDropdown profile top w-100"
        placeholder="Search"
        onKeyUp={(e) => handleSearch(e.target.value)}
      />
    </ProfileCard>
  );
};
