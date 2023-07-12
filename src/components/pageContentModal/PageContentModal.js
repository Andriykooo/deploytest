import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/socket";
import { XIcon } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import { HtmlParse } from "../htmlParse/HtmlParse";
import { Loader } from "../loaders/Loader";
import "./PageContentModal.css";
import Image from "next/image";

export const PageContentModal = () => {
  const { gamingSocket } = useContext(SocketContext);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const language = useSelector((state) => state.language);
  const isMobile = useSelector((state) => state.setMobile);

  const [loader, setLoader] = useState(true);
  const [content, setContent] = useState("");

  const close = () => {
    setContent("");
    router.back();
  };

  useEffect(() => {
    if (searchParams?.get("page_content")) {
      gamingSocket?.emit(
        "page_content",
        {
          value: searchParams?.get("page_content"),
          country: language?.code2 === "all" ? "EN" : language?.code2,
        },
        (response) => {
          setLoader(false);
          if (response?.data?.content) {
            setContent(response?.data?.content);
          } else {
            close();
          }
        }
      );
    }
  }, [searchParams, language]);

  return (
    content && (
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
            <HtmlParse html={content} title={searchParams.get("name")} />
          )}
        </div>
      </div>
    )
  );
};
