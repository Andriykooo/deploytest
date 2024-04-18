import { CloseMenu } from "@/icons/CloseMenu";
import { BurgerMenu } from "@/icons/BurgerMenu";

export const MenuIcon = ({ swiftyMenu, setSwiftyMenu }) => {
  return swiftyMenu ? (
    <CloseMenu onClick={() => setSwiftyMenu(!swiftyMenu)} />
  ) : (
    <BurgerMenu onClick={() => setSwiftyMenu(!swiftyMenu)} />
  );
};
