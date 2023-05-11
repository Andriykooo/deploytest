import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiServices } from "../../utils/apiServices";
import { apiDomain } from "../../utils/constants";
import { XIcon } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import { HtmlParse } from "../htmlParse/HtmlParse";
import { Loader } from "../loaders/Loader";

export const PageContentModal = ({ data, setData }) => {
  const isMobile = useSelector((state) => state.setMobile);

  const [loader, setLoader] = useState(true);
  const [content, setContent] = useState("");

  const close = () => {
    setData(null);
    setContent("");
  };

  useEffect(() => {
    if (data) {
      setLoader(true);

      apiServices
        .get(`${apiDomain}/v1/page_content?type=${data?.path?.substring(1)}`)
        .then((res) => {
          setContent(res.content);
        })
        .finally(() => {
          setLoader(false);
        });
    }
  }, [data]);

  return (
    data && (
      <div className="full-screen-modal scrollable-modal">
        <nav className="navbar navbar-expand-lg container-fluid p-0 d-flex justify-content-between">
          <div className="swifty-gaming">
            <Image
              src={isMobile ? images.gamingMobile : images.GroupSwifty}
              alt="Swifty Gaming Logo"
            />
          </div>
          <div className="close-full-modal-container" onClick={close}>
            <XIcon />
          </div>
        </nav>
        <div className="page-content-modal">
          {loader ? (
            <Loader />
          ) : (
            <HtmlParse html={content} title={data?.name} />
          )}
        </div>
      </div>
    )
  );
};
