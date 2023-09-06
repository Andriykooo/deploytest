import classNames from "classnames";
import { images } from "../../utils/imagesConstant";
import "./Warning.css";
import Image from "next/image";

export const Warning = ({ text, className }) => {
  return (
    <div className={classNames("warning", className)}>
      <Image src={images.infoIcon} alt="info" className="warning-image" height={14} width={14} />
      <span className="warning-text">{text}</span>
    </div>
  );
};
