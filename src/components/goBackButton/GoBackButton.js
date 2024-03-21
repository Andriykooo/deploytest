import { useTranslations } from "next-intl";
import classNames from "classnames";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import "./GoBackButton.css";
import { ArrowIcon, GoBackArrowFull } from "@/utils/icons";

export const GoBackButton = ({
  link,
  onClick,
  fullIcon = false,
  className,
  arrowColor,
  withoutText ,
}) => {
  const t = useTranslations("common");
  const router = useCustomRouter();

  const handleLink = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (link) {
      router.push(link);
    } else {
      router.back();
    }
  };

  return (
    <div onClick={handleLink} className={classNames("goBackButton", className)}>
      {fullIcon ? (
        <GoBackArrowFull className="goBackArrowFull" />
      ) : (
        <ArrowIcon className="goBackArrow" color={arrowColor} />
      )}
      {!withoutText && (
        <span className={classNames("goBackText", { boldText: !fullIcon })}>
          {t("go_back")}
        </span>
      )}
    </div>
  );
};
