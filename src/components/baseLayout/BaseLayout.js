import classNames from "classnames";
import Header from "../header/Header";

export const BaseLayout = ({ children, className }) => {
  return (
    <>
      <Header />
      <div className={classNames("base-layout", className)}>{children}</div>
    </>
  );
};
