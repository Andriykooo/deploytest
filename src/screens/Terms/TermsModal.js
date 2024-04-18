import parse from "html-react-parser";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { XIcon } from "@/icons/XIcon";
import { useTranslations } from "@/hooks/useTranslations";
import { Logo } from "@/components/logo/Logo";
import "../Terms/Terms.css";

const TermsModal = ({ setPageModal }) => {
  const t = useTranslations();
  const termsDivRef = useRef(null);
  const user = useSelector((state) => state.user);

  const [terms, setTerms] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    getTerms();
  }, []);

  const getTerms = () => {
    var country = "";
    if (!user) {
      country = "US";
    } else {
      country = user.country;
    }
    setLoader(true);
    apiServices
      .get(`${apiUrl.TERMS}?country=${country}`)
      .then((res) => {
        setLoader(false);
        setTerms(res.content);
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

      <div className="terms backgroundImageLogged backHeight">
        <p className="termsTitle">{t("common.terms_and_conditions")}</p>
        {loader ? (
          <Loader />
        ) : (
          <>
            <div ref={termsDivRef} className="termsContent">
              {parse(terms.toString())}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TermsModal;
