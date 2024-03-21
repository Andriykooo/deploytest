import parse from "html-react-parser";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { XIcon } from "../../utils/icons";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo/Logo";
import "../Terms/Terms.css";

const PrivacyModal = ({ setPageModal }) => {
  const t = useTranslations();
  const privacyDivRef = useRef(null);
  const [policy, setPolicy] = useState([]);
  const [loader, setLoader] = useState(true);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    getPolicy();
  }, []);

  const getPolicy = () => {
    var country = "";
    if (!user) {
      country = "US";
    } else {
      country = user.country;
    }
    setLoader(true);
    apiServices
      .get(`${apiUrl.PRIVACY}?country=${country}`)
      .then((response) => {
        setLoader(false);
        setPolicy(response.content);
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
        <p className="termsTitle">{t("privacy.privacy_policy")}</p>
        {loader ? (
          <Loader />
        ) : (
          <>
            <div ref={privacyDivRef} className="termsContent">
              {parse(policy.toString())}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrivacyModal;
