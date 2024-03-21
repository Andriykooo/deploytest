import { memo } from "react";

const Seal = ({ html }) => {
  return (
    <div
      className="footer-image seal"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};

export default memo(Seal);
