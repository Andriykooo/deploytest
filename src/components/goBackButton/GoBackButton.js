import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import classNames from "classnames";
export const GoBackButton = ({ link, fullIcon = false }) => {
  const t = useTranslations("common");
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
      {fullIcon ? (
        <Image
          src={images.goBackArrow}
          alt="Go back"
          className="goBackArrowFull"
          height={16}
          width={14}
        />
      ) : (
        <Image
          src={images.arrowIcon}
          alt="Go back"
          className="goBackArrow"
          height={14}
          width={14}
        />
      )}
      <span
        className={classNames("goBackText", { boldText: !fullIcon })}>
        {t("go_back")}
      </span>
    </div>
  );
};
