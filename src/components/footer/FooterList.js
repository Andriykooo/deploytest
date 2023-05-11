import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { images } from "../../utils/imagesConstant";

export const FooterList = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="col-12 d-block">
      <div className="justify-content-between d-flex">
        <span>{data.name}</span>
        <Image
          src={isOpen ? images.polygon : images.polygon2}
          onClick={() => setIsOpen(!isOpen)}
          alt="footer polygon company"
        />
      </div>
      {isOpen && (
        <div className="footer-items">
          {data.links.map((link, index) => (
            <Link href={link.path} key={index}>
              <div className="footer-link">{link.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
