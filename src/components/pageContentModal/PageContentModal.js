import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/socket";
import { XIcon } from "../../utils/icons";
import { HtmlParse } from "../htmlParse/HtmlParse";
import { Loader } from "../loaders/Loader";
import "./PageContentModal.css";
import { Logo } from "../logo/Logo";

export const PageContentModal = () => {
  const { gamingSocket } = useContext(SocketContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const language = useSelector((state) => state.language);

  const [loader, setLoader] = useState(true);
  const [content, setContent] = useState("");

  const close = () => {
    setContent("");
    router.push(pathname);
  };

  useEffect(() => {
    if (searchParams?.get("content")) {
      gamingSocket?.emit(
        "page_content",
        {
          value: searchParams?.get("content"),
          country: language.code2,
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
  }, [searchParams]);

  return (
    content && (
      <div className="scrollable-modal content-modal">
        <nav className="navbar navbar-expand-lg container-fluid p-0 d-flex justify-content-between content-navBar">
          <div className="swifty-gaming">
            <Logo />
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
