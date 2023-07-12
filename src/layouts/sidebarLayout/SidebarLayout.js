import classNames from "classnames";
import { SidebarLeft } from "../../components/sidebarLeft/SidebarLeft";
import { SidebarRight } from "../../components/sidebarRight/SidebarRight";

export const SidebarLayout = ({ leftData, rightData, children, className }) => {
  return (
    <>
      {leftData && <SidebarLeft data={leftData} />}
      {rightData && <SidebarRight data={rightData} />}
      <div className={classNames("content", className)}>{children}</div>
    </>
  );
};
