import classNames from "classnames";
import { Button } from "../button/Button";
import { ArrowIconSidebarLeft } from "@/utils/icons";

export const ArrowButton = ({ active, show, setActive }) => {
  return (
    <Button
      className={classNames("closeSidebarButton", {
        openSidebarButtonn: !active,
        show,
      })}
      onClick={() => setActive(!active)}
      ariaLabel="arrow"
      text={
        <div className="arrowImgSidebar">
          <ArrowIconSidebarLeft />
        </div>
      }
    />
  );
};
