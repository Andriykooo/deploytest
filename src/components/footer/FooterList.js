import Image from "next/image";
import { useState } from "react";
import { images } from "../../utils/imagesConstant";
import { LinkType } from "../LinkType/LinkType";
import { preselectedColumns } from "./Footer";

export const FooterList = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="col-12 d-block">
      <div
        className="justify-content-between d-flex"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{data.name}</span>
        <Image
          src={isOpen ? images.polygon : images.polygon2}
          alt="footer polygon company"
          width={18}
          height={14}
        />
      </div>
      {isOpen && (
        <div className="footer-items">
          {data.links.map((link) => {
            const isPreselectedLink = preselectedColumns.includes(link.path);
            return (
              <LinkType
                key={`${link?.name}-${link?.page_type}-${link?.path}`}
                type={isPreselectedLink ? "default" : link?.page_type}
                path={link?.path}
                openType={link?.open_type}
                modalData={{
                  slug: link?.path,
                  title: link?.name,
                }}
              >
                <div className="footer-link">{link.name}</div>
              </LinkType>
            );
          })}
        </div>
      )}
    </div>
  );
};
