import classNames from "classnames";
import { CustomLink } from "../Link/Link";
import "./ProfileCard.css";

export const ProfileCard = ({ children, active, href, className, onClick }) => {
  return (
    <CustomLink
      href={href}
      className={classNames("profile-card", className, { active })}
      onClick={onClick}
    >
      {children}
    </CustomLink>
  );
};
