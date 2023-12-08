import { useClientPathname } from "@/hooks/useClientPathname";
import { CustomLink } from "../Link/Link";
import Link from "next/link";

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
  if (openType === "new_tab") {
    return (
      <a
        rel="noopener noreferrer"
        href={path}
        target="_blank"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  if (/^(http:\/\/|https:\/\/)/.test(path)) {
    return (
      <Link className={className} href={path || ""} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
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
  const { pathname } = useClientPathname();

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
          path={`${pathname}?modal=${modalData?.slug}${
            modalData?.title ? "&title=" + modalData.title : ""
          }`}
        >
          {children}
        </OpenType>
      )}
      {redirectTypes.includes(type) && (
        <OpenType
          type={type}
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
