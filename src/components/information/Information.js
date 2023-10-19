import Image from "next/image";
import { images } from "../../utils/imagesConstant";

import "./Information.css";
import classNames from "classnames";

const Information = ({ text, className }) => {
  return (
    <div className={classNames("information-card", className)}>
      <Image src={images.infoIconWhite} alt="info" className="information-image" />
      <span className="information-text">{text}</span>
    </div>
  );
};

export default Information;
