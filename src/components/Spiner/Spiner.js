import { useTranslations } from "@/hooks/useTranslations";
import "./Spiner.css";
import classNames from "classnames";

function Spiner({ sell, className }) {
  const t = useTranslations("common");

  return (
    <div
      className={sell ? "spinnerPadding spinnerPosition" : "spinnerPosition"}
    >
      <div className={classNames("spiner", className)}>
        <span className="visually-hidden">{t("loading")}</span>
      </div>
    </div>
  );
}

export default Spiner;
