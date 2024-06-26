import { useClientPathname } from "@/hooks/useClientPathname";
import { CustomLink } from "../Link/Link";
import Link from "next/link";
import { nextWindow } from "@/utils/nextWindow";

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
    const currentURL = nextWindow.location.origin;
    const target = path.includes(currentURL);
    return (
      <Link
        className={className}
        target={!target && openType !== "same_tab" && "_blank"}
        href={path || ""}
        onClick={onClick}
      >
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
          path={`${pathname}?modal=${modalData?.slug}`}
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
