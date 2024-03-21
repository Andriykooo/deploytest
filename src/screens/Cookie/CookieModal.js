import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { XIcon } from "../../utils/icons";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo/Logo";
import "../Cookie/Cookie.css";

const CookieModal = ({ setPageModal }) => {
  const t = useTranslations("common");
  const [loader, setLoader] = useState(true);
  const [cookieContent, setCookieContent] = useState("");

  useEffect(() => {
    getAboutUs();
  }, []);

  const getAboutUs = () => {
    setLoader(true);
    apiServices
      .get(apiUrl.COOKIE_POLICY)
      .then((res) => {
        setLoader(false);
        setCookieContent(res.content);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  return (
    <div className="full-screen-modal">
      <nav className="navbar navbar-expand-lg container-fluid p-0 d-flex justify-content-between">
        <div className="swifty-gaming">
          <Logo />
        </div>
        <div
          className="close-full-modal-container"
          onClick={() => setPageModal("")}
        >
          <XIcon />
        </div>
      </nav>
      <div className="cookiePolicy">
        <div>
          <p className="cookieTitle  pb-3">{t("cookie_policy")}</p>
          {loader ? (
            <Loader />
          ) : (
            <>
              <p className="cookieText">{parse(cookieContent.toString())}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieModal;
