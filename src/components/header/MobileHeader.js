import { useDispatch, useSelector } from "react-redux";
import { setSidebarLeft } from "../../store/actions";
import { MenuIcon } from "./MenuIcon";
import { MobileLoggedUser } from "./logged/MobileLoggedUser";
import { MobileUnloggedUser } from "./unlogged/MobileUnloggedUser";
import { Logo } from "../logo/Logo";

export const MobileHeader = ({
  page,
  showBetSlip,
  setSwiftyProfile,
  swiftyProfile,
}) => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);
  const sidebaLeft = useSelector((state) => state.sidebarLeft);
  const toggleSidebarLeft = (value) => {
    dispatch(
      setSidebarLeft({
        ...sidebaLeft,
        isActive: value,
      })
    );
  };

  return (
    <>
      <div className="d-flex justify-content-start align-items-center h-100">
        <div className={page === "sports" ? "ps-3 me-3" : "ps-3 me-3"}>
          <MenuIcon
            swiftyMenu={sidebaLeft.isActive}
            setSwiftyMenu={toggleSidebarLeft}
          />
        </div>
        <div>
          <Logo />
        </div>
        <div className="sing-up-txt mobileAccInfo">
          <div className="d-flex align-items-center">
            {!loggedUser?.user_data ? (
              <MobileUnloggedUser showBetSlip={showBetSlip} />
            ) : (
              <MobileLoggedUser
                setSwiftyProfile={setSwiftyProfile}
                swiftyProfile={swiftyProfile}
                showBetSlip={showBetSlip}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
