import { CloseMenu } from "@/icons/CloseMenu";
import { Logo } from "../logo/Logo";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarLeft } from "@/store/actions";
import "./MobileSidebarActive.css";

export const MobileSiderbarActive = ({ handleNavigateHome }) => {
  const sidebaLeft = useSelector((state) => state.sidebarLeft);
  const dispatch = useDispatch();

  const toggleSidebarLeft = () => {
    dispatch(
      setSidebarLeft({
        ...sidebaLeft,
        isActive: false,
      })
    );
  };

  return (
    <div className="mobileHeaderContainerForLeftSidebar">
      <div className="mobileHeaderForLeftSidebar">
        <Logo handleNavigateHome={handleNavigateHome} />
      </div>
      <div className="closeIconForLeftSidebar">
        <CloseMenu onClick={toggleSidebarLeft} />
      </div>
    </div>
  );
};
