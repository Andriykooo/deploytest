import { CloseMenu, BurgerMenu } from "@/utils/icons";

export const MenuIcon = ({ swiftyMenu, setSwiftyMenu }) => {
  return swiftyMenu ? (
    <CloseMenu
      onClick={() => setSwiftyMenu(!swiftyMenu)}
    />
  ) : (
    <BurgerMenu
      onClick={() => setSwiftyMenu(!swiftyMenu)}
    />
  );
};
