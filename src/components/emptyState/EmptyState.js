import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import "./EmptyState.css";
import { useClientTranslation } from "@/app/i18n/client";

export const EmptyState = ({ message }) => {
  const { t } = useClientTranslation("common")
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
