import { React, useEffect, useRef, useState } from "react";
import "../Terms/Terms.css";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { apiUrl } from "../../utils/constants";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { XIcon } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";

const PrivacyModal = ({ setPageModal }) => {
  const privacyDivRef = useRef(null);
  const [policy, setPolicy] = useState([]);
  const [loader, setLoader] = useState(true);
  const user = useSelector((state) => state.user);
  const isMobile = useSelector((state) => state.setMobile);

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
        <p className="termsTitle">Privacy Policy</p>
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
