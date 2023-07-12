import { Skeleton } from "@mui/material";
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
    >
      <div className="p-2 mt-2">
        <Skeleton
          variant="text"
          sx={{ fontSize: "2.5rem", bgcolor: "#212536" }}
          className="my-2"
          animation="wave"
        />
        {skeletonTitle.map((_, index) => (
          <Skeleton
            variant="text"
            sx={{ fontSize: "1.2rem" }}
            className="my-2"
            animation="wave"
            key={index}
          />
        ))}

        {skeleteInline.map((_, index) => (
          <Skeleton
            variant="text"
            sx={{ fontSize: "1.2rem" }}
            className="my-2"
            animation="wave"
            key={index}
          />
        ))}
      </div>
    </div>
  );
};
