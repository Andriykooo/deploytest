import Link from "next/link";
import { CustomLink } from "../Link/Link";

const redirectTypes = [
  "page",
  "casino",
  "layout",
  "event",
  "default",
  "same_tab",
  "sport",
  "generic",
];

const OpenType = ({ openType, children, className, path, onClick }) => {
  return openType === "new_tab" ? (
    <a
      rel="noopener noreferrer"
      href={path}
      target="_blank"
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  ) : (
    <CustomLink className={className} href={path || ""} onClick={onClick}>
      {children}
    </CustomLink>
  );
};

export const LinkType = ({
  type,
  openType,
  path,
  modalData,
  children,
  onClick,
  className,
}) => {
  return (
    <>
      {type === "new_tab" && (
        <OpenType
          className={className}
          openType={type}
          onClick={onClick}
          path={path}
        >
          {children}
        </OpenType>
      )}
      {type === "modal" && (
        <OpenType
          className={className}
          openType={type}
          onClick={onClick}
          path={`?modal=${modalData?.slug}${
            modalData?.title ? "&title=" + modalData.title : ""
          }`}
        >
          {children}
        </OpenType>
      )}
      {redirectTypes.includes(type) && (
        <OpenType
          openType={openType}
          className={className}
          path={path}
          onClick={onClick}
        >
          {children}
        </OpenType>
      )}
    </>
  );
};
