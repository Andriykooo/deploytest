import { InfoInformationIcon } from "@/icons/InfoInformationIcon";
import classNames from "classnames";
import "./Warning.css";

export const Warning = ({ text, className }) => {
  return (
    <div className={classNames("warning", className)}>
      <div className="warning-image">
        <InfoInformationIcon />
      </div>
      <span className="warning-text">{text}</span>
    </div>
  );
};
