import Image from "next/image";
import { images } from "../../utils/imagesConstant";

export const MenuIcon = ({ swiftyMenu, setSwiftyMenu }) => {
  return swiftyMenu ? (
    <Image
      src={images.closeIcon}
      onClick={() => setSwiftyMenu(!swiftyMenu)}
      alt=""
      height={"30"}
      width={"30"}
      className="header-icon"
    />
  ) : (
    <Image
      src={images.menuIcon}
      onClick={() => setSwiftyMenu(!swiftyMenu)}
      alt=""
      height={"30"}
      width={"30"}
      className="header-icon"
    />
  );
};
