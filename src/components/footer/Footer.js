"use client";

import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { LinkType } from "../LinkType/LinkType";
import { HtmlParse } from "../htmlParse/HtmlParse";
import LanguageDropdown from "../languageDropdown/languageDropdown";
import { FooterList } from "./FooterList";
import Seal from "./Seal";
import { apiServices } from "@/utils/apiServices";
import { setFooter } from "@/store/actions";
import { apiUrl } from "@/utils/constants";
import classNames from "classnames";
import { useClientPathname } from "@/hooks/useClientPathname";
import { CurrentDate } from "../CurrentDate/CurrentDate";
import "./Footer.css";

export const preselectedColumns = ["/terms", "/privacy"];

export const Footer = ({ noMenu }) => {
  const dispatch = useDispatch();
  const isPWA = window.matchMedia("(display-mode: standalone)").matches;
  const isTablet = useSelector((state) => state.isTablet);
  const footer = useSelector((state) => state.footer);
  const [isMounted, setIsMounted] = useState(false);
  const { pathname } = useClientPathname();
  const casinoPage = pathname.includes("/casino") || pathname.includes("/gameslist");

  useEffect(() => {
    setIsMounted(true);

    if (!footer?.data) {
      apiServices.get(apiUrl.GET_FOOTER).then((response) => {
        dispatch(setFooter({ data: response }));
      });
    }
  }, []);

  return footer?.data ? (
    <>
      {isMounted && (
        <Helmet>{parse(footer.data.footer_row2?.header || "")}</Helmet>
      )}
      <footer
        className={classNames(
          "footer-container-div",
          { pwa: isPWA },
          { casinoPage: casinoPage }
        )}
      >
        <div className="pt-5 footerContainerMenu">
          {isTablet ? (
            <div className="mobileVersionLinks row">
              {footer.data?.columns.map((column, index) => {
                return <FooterList data={column} key={index} />;
              })}
            </div>
          ) : !noMenu ? (
            <div className="row">
              {footer.data.columns.map((column, index) => {
                return (
                  <div key={index} className="col-6 col-lg-3 pb-5">
                    <div className="row">
                      <div className="col-12 mb-2">
                        <strong>{column.name}</strong>
                      </div>
                      {column.links.map((link) => {
                        return (
                          <div
                            className="col-12 mb-2"
                            key={`${link?.name}-${link?.page_type}-${link?.path}`}
                          >
                            <LinkType
                              type={link?.page_type}
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
          ) : null}
          <div className="row footer-images">
            {footer.data?.images.map((row, index) => {
              return (
                <div key={index} className="footer-images-row">
                  {row?.items?.map((image, rowIndex) => {
                    return image?.image ? (
                      <div key={rowIndex} className="footer-image">
                        <LinkType
                          type={image.page_type}
                          path={image.url}
                          openType={image?.open_type}
                          modalData={{
                            slug: image?.url,
                            title: image?.name,
                          }}
                        >
                          <img alt="footer-link" src={image.image} />
                        </LinkType>
                      </div>
                    ) : null;
                  })}
                  {footer?.data?.footer_row2 &&
                    index === footer?.data?.images?.length - 1 && (
                      <Seal html={footer?.data?.footer_row2?.body} />
                    )}
                </div>
              );
            })}
          </div>
          <div className="footer">
            <HtmlParse html={footer.data?.footer_row1} />
            <LanguageDropdown />
            <CurrentDate />
          </div>
        </div>
      </footer>
    </>
  ) : null;
};
