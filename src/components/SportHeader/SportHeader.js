import classNames from "classnames";
import "./SportHeader.css";
import { useSelector } from "react-redux";

export const SportHeader = ({ children, headerContent }) => {
  const isTablet = useSelector((state) => state.isTablet);

  return (
    <div className="sport-competitions">
      <div
        className={classNames("sport-competitions-head", {
          mobile: isTablet,
        })}
      >
        {headerContent}
      </div>
      {children}
    </div>
  );
};
