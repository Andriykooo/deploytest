import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import "./EmptyState.css";

export const EmptyState = ({ message }) => {
  return (
    <div className="empty-state">
      <Image
        src={images.emptyState}
        alt="warning"
        className="empty-state-image"
        height={36}
        width={36}
      />
      <div className="empty-state-massage">{message}</div>
    </div>
  );
};
