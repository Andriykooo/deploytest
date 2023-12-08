import classNames from "classnames";
import "./ProfileCard.css";

export const ProfileCard = ({ children, active, className, onClick }) => {
  return (
    <div
      className={classNames("profile-card", className, { active })}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
