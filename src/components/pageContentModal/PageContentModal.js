import {
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";
import { CloseIcon, XIcon } from "../../utils/icons";
import { HtmlParse } from "../htmlParse/HtmlParse";
import { PageLoader } from "../loaders/Loader";
import "./PageContentModal.css";
import { Logo } from "../logo/Logo";
import { alertToast } from "@/utils/alert";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import classNames from "classnames";

export const PageContentModal = ({ disableHeader }) => {
  const { gamingSocket } = useContext(SocketContext);
  const searchParams = useSearchParams();
  const router = useCustomRouter();
  const pathname = usePathname();
  const params = useParams();
  const loggedUser = useSelector((state) => state.loggedUser);
  const t = useTranslations();

  const [loader, setLoader] = useState(true);
  const [content, setContent] = useState("");

  const predefinedContent = [
    { link: "/terms", title: t("common.terms_and_conditions") },
    { link: "/privacy", title: t("privacy.privacy_policy") },
  ];
  const contentSlug = searchParams?.get("modal");
  const language = params.lng === "en" ? "all" : params.lng;
  const country = loggedUser?.user_data?.country || "all";
  const predefinedLink = predefinedContent.find(
    (content) => content.link === contentSlug
  );
  const title = predefinedLink?.title || searchParams.get("title");

  const close = () => {
    setContent("");
    router.replace(pathname);
  };

  useEffect(() => {
    if (contentSlug) {
      if (predefinedLink) {
        apiServices
          .get(apiUrl[contentSlug.toUpperCase().substring(1)], {
            country,
            language,
          })
          .then((res) => {
            setContent(res.content);
          })
          .catch((error) => {
            alertToast({ message: error?.response?.data?.message });
          })
          .finally(() => {
            setLoader(false);
          });
      } else {
        gamingSocket?.emit(
          "page_content",
          {
            value: contentSlug,
            country: language,
          },
          (response) => {
            setLoader(false);
            if (response?.data?.content) {
              setContent(response?.data?.content);
            } else {
              if (response?.data?.errorMessage) {
                alertToast({ message: response?.data?.errorMessage });
              }
              close();
            }
          }
        );
      }
    }
  }, [searchParams]);

  return (
    contentSlug && (
      <div className={classNames("scrollable-modal content-modal", {
        disableHeader: disableHeader
      })}>
        {disableHeader ?
          (
            <div className="closeModal">
              <CloseIcon onClick={close} />
            </div>
          ) : (
            <nav className="navbar navbar-expand-lg container-fluid p-0 d-flex justify-content-between content-navBar">
              <div className="swifty-gaming">
                <Logo />
              </div>
              <div className="close-full-modal-container" onClick={close}>
                <XIcon />
              </div>
            </nav>
          )}
        {loader ? (
          <PageLoader />
        ) : (
          <div className="page-content-modal">
            <HtmlParse html={content} title={title} />
          </div>
        )}
      </div>
    )
  );
};
