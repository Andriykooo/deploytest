import classNames from "classnames";
import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { ArrowIconSidebarLeft } from "@/utils/icons";

export const ArrowButton = ({ active, setActive }) => {
  return (
    <Button
      className={classNames("closeSidebarButton", {
        openSidebarButtonn: !active,
      })}
      onClick={() => setActive(!active)}
      text={<div className="arrowImgSidebar"><ArrowIconSidebarLeft /></div>}
    />
  );
};
