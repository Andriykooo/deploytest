import classNames from "classnames";
import { useSelector } from "react-redux";

const skeletonTitle = new Array(4).fill(0);
const skeleteInline = new Array(20).fill(0);

export const SidebarLeftSkeleton = () => {
  const sidebarLeft = useSelector((state) => state.sidebarLeft);

  return (
    <div
      className={classNames("sidebar-left sidebar-skeleton", {
        active: sidebarLeft.isActive,
      })}
    ></div>
  );
};
