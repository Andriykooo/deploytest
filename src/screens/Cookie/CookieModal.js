import parse from "html-react-parser";
import { React, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { XIcon } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";

const CookieModal = ({ setPageModal }) => {
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
  const isMobile = useSelector((state) => state.setMobile);
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
      <Helmet>
        <title>Swifty Gaming | Cookie Policy</title>
      </Helmet>
      <div className="cookiePolicy">
        <div>
          <p className="cookieTitle  pb-3">Cookie Policy</p>
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
