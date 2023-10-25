import { useTranslations } from "next-intl";
import Spinner from "react-bootstrap/Spinner";

function Spiner({ sell }) {
  const t = useTranslations("common");
  return (
    <div
      className={sell ? "spinnerPadding spinnerPosition" : "spinnerPosition"}
    >
      <Spinner
        animation="border"
        role="status"
        style={{ color: "white", marginTop: "30px", marginBottom: "35px" }}
      >
        <span className="visually-hidden">{t("loading")}</span>
      </Spinner>
    </div>
  );
}

export default Spiner;
