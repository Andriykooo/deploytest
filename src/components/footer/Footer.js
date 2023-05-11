import { SocketContext } from "../../context/socket";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PageContentModal } from "../pageContentModal/PageContentModal";
import { FooterList } from "./FooterList";

const Footer = () => {
  const isMobile = useSelector((state) => state.setMobile);
  const { gamingSocket } = useContext(SocketContext);
  
  const [modalData, setModalData] = useState(null);
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    gamingSocket?.emit("footer", {}, (response) => {
      setFooterData(response);
    });
  }, []);

  return (
    <>
      <footer className="footer-container-div">
        <div className="pt-5 footerContainerMenu">
          {!isMobile ? (
            <div className="row">
              {footerData?.columns.map((column, index) => {
                return (
                  <div key={index} className="col-6 col-lg-3 pb-5">
                    <div className="row">
                      <div className="col-12">
                        <strong>{column.name}</strong>
                      </div>
                      <div className="col-12">
                        {column.links.map((link, index) => {
                          if (link.page_type === "new_tab") {
                            return (
                              <Link
                                rel="noopener noreferrer"
                                key={index}
                                href={link.path}
                                target="_blank"
                              >
                                <div className="footer-link">{link.name}</div>
                              </Link>
                            );
                          }

                          if (link.page_type === "modal") {
                            return (
                              <div
                                key={index}
                                className="footer-link"
                                onClick={() => {
                                  setModalData(link);
                                }}
                              >
                                {link.name}
                              </div>
                            );
                          }

                          if (link.page_type === "redirect") {
                            return (
                              <Link href={link.path} key={index}>
                                <div className="footer-link">{link.name}</div>
                              </Link>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mobileVersionLinks row">
              {footerData?.columns.map((column, index) => {
                return <FooterList data={column} key={index} />;
              })}
            </div>
          )}
          <div className="row mb-4">
            {footerData?.images.map((image, index) => {
              return image.image !== "blank" ? (
                <div
                  key={index}
                  className="col-6 col-lg text-start text-lg-center"
                >
                  <Link href={image.url}>
                    <img alt="footer-link" src={image.image} />
                  </Link>
                </div>
              ) : null;
            })}
          </div>
          <div className="footer">
            <p
              dangerouslySetInnerHTML={{ __html: footerData?.footer_row1 }}
            ></p>
            <p
              dangerouslySetInnerHTML={{ __html: footerData?.footer_row2 }}
            ></p>
          </div>
        </div>
      </footer>
      <PageContentModal data={modalData} setData={setModalData} />
    </>
  );
};
export default Footer;
