import classNames from "classnames";
import { SidebarLeft } from "../sidebarLeft/SidebarLeft";
import { SidebarRight } from "../sidebarRight/SidebarRight";

export const SidebarLayout = ({ left, right, children, className }) => {
  return (
    <>
      {left && <SidebarLeft />}
      {right && <SidebarRight />}
      <div className={classNames("content", className)}>{children}</div>
    </>
  );
};
