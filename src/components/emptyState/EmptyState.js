import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import { useTranslations } from "next-intl";
import "./EmptyState.css";

export const EmptyState = ({ message }) => {
  const t = useTranslations("common");
  return (
    <div className="empty-state">
      <Image
        src={images.emptyState}
        alt={t("warning")}
        className="empty-state-image"
        height={36}
        width={36}
      />
      <div className="empty-state-massage">{message}</div>
    </div>
  );
};
