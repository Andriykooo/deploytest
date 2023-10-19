import parse from "html-react-parser";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { XIcon } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import "../Cookie/Cookie.css";
import { useClientTranslation } from "@/app/i18n/client";

const CookieModal = ({ setPageModal }) => {
  const { t } = useClientTranslation("common");
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
          <Link href="/">
            <Image
              alt="img-GroupSwifty"
              src={isMobile ? images.gamingMobile : images.GroupSwifty}
              height={30}
              width={195}
            />
          </Link>
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
