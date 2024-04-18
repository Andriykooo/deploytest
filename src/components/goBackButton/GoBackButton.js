import { useTranslations } from "@/hooks/useTranslations";
import classNames from "classnames";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { GoBackArrowFull } from "@/icons/GoBackArrowFull";
import { ArrowIcon } from "@/icons/ArrowIcon";

import "./GoBackButton.css";

export const GoBackButton = ({
  link,
  onClick,
  fullIcon = false,
  className,
  arrowColor,
  withoutText,
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
