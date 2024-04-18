import "./Information.css";
import classNames from "classnames";
import { InfoIcon } from "@/icons/InfoIcon";

const Information = ({ text, className }) => {
  return (
    <div className={classNames("information-card", className)}>
      <InfoIcon />
      <span className="information-text">{text}</span>
    </div>
  );
};

export default Information;
