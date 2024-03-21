import classNames from "classnames";
import { useSelector } from "react-redux";
import { Skeleton } from "../Skeleton/Skeleton";

const skeleteInline = new Array(16).fill(0);

export const SidebarLeftSkeleton = ({ height }) => {
  const sidebarLeft = useSelector((state) => state.sidebarLeft);

  return (
    <div
      className={classNames("sidebar-left show sidebar-skeleton", {
        active: sidebarLeft.isActive,
      })}
    >
      <div className="px-2">
        {skeleteInline.map((_, index) => (
          <Skeleton
            className={classNames("my-1", { "mt-2": index === 0 })}
            width="100%"
            height={height || 41}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};
