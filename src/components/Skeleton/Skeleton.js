import classNames from "classnames";
import "./Skeleton.css";

export const Skeleton = ({ sx, className, height, width, children }) => {
  return (
    <div
      className={classNames("skeleton", className)}
      style={{ ...sx, height, width }}
    >
      {children}
    </div>
  );
};
