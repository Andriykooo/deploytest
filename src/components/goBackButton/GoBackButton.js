import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import { useRouter } from "next/navigation";
import { useClientTranslation } from "@/app/i18n/client";

export const GoBackButton = ({ link }) => {
  const { t } = useClientTranslation("common");
  const router = useRouter();

  const handleLink = () => {
    if (link) {
      router.push(link);
    } else {
      router.back();
    }
  };

  return (
    <div onClick={handleLink} className="goBackButton">
      <Image src={images.arrowIcon} alt="Go back" className="goBackArrow" height={14} width={14} />
      <span>{t("go_back")}</span>
    </div>
  );
};
