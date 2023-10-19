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
    <Link className={className} href={path || ""} onClick={onClick}>
      {children}
    </Link>
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
          path={`?content=${modalData?.slug}${
            modalData?.title ? "&name=" + modalData.title : ""
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
