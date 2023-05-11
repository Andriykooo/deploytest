import { React, useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import { apiUrl } from "../../utils/constants";
import { useSelector } from "react-redux";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { XIcon } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";

const TermsModal = ({ setPageModal }) => {
  const termsDivRef = useRef(null);
  const [terms, setTerms] = useState([]);
  const [loader, setLoader] = useState(true);
  const user = useSelector((state) => state.user);
  const isMobile = useSelector((state) => state.setMobile);

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
          {isMobile ? (
            <img src={images.gamingMobile} alt="Swifty Gaming Logo" />
          ) : (
            <img src={images.GroupSwifty} alt="Swifty Gaming Logo" />
          )}
        </div>
        <div
          className="close-full-modal-container"
          onClick={() => setPageModal("")}
        >
          <XIcon />
        </div>
      </nav>

      <div className="terms backgroundImageLogged backHeight">
        <p className="termsTitle">Terms and Conditions</p>
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
