"use client";

import { useSelector } from "react-redux";
import { LinkType } from "../LinkType/LinkType";
import { HtmlParse } from "../htmlParse/HtmlParse";
import LanguageDropdown from "../languageDropdown/languageDropdown";
import { FooterList } from "./FooterList";

export const Footer = ({ footerData }) => {
  const isTablet = useSelector((state) => state.isTablet);

  return (
    <>
      <footer className="footer-container-div">
        <div className="pt-5 footerContainerMenu">
          {!isTablet ? (
            <div className="row">
              {footerData?.columns.map((column, index) => {
                return (
                  <div key={index} className="col-6 col-lg-3 pb-5">
                    <div className="row">
                      <div className="col-12 mb-2">
                        <strong>{column.name}</strong>
                      </div>
                      {column.links.map((link, index) => {
                        return (
                          <div className="col-12 mb-2" key={index}>
                            <LinkType
                              type={link.page_type}
                              path={link.path}
                              openType={link?.open_type}
                              modalData={{
                                slug: link?.path,
                                title: link?.name,
                              }}
                              className="footer-link"
                            >
                              {link.name}
                            </LinkType>
                          </div>
                        );
                      })}
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
          <div className="row footer-images">
            {footerData?.images.map((row, index) => {
              return (
                <div key={index} className="footer-images-row">
                  {row?.items?.map((image, rowIndex) => {
                    return image.image ? (
                      <div key={rowIndex} className="footer-image">
                        <LinkType
                          type={image.page_type}
                          path={image.path}
                          openType={image?.open_type}
                          modalData={{
                            slug: image?.path,
                            title: image?.name,
                          }}
                        >
                          <img alt="footer-link" src={image.image} />
                        </LinkType>
                      </div>
                    ) : null;
                  })}
                  {index === footerData?.images?.length - 1 && (
                    <div
                      className="footer-image seal"
                      dangerouslySetInnerHTML={{
                        __html: footerData?.footer_row2.body,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="footer">
            <div>
              <HtmlParse html={footerData?.footer_row1} />
            </div>
            <LanguageDropdown />
          </div>
        </div>
      </footer>
    </>
  );
};
