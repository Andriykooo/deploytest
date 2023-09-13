import { clearLocalStorage, getLocalStorageItem } from "@/utils/localStorage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBet,
  removeBetAmount,
  setLogOut,
  setLoggedUser,
  setUser,
} from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl, profileCards } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { PredictionsMenu } from "./PredictionsMenu";
import { ProfileCard, SidebarProfilMenu } from "./Styled";
import { refreshGamingSocket } from "@/context/socket";

export const ProfileSidebar = ({
  sideBarMenu,
  version,
  profileMenu,
  page,
  active,
  setIsLoggingOut,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobile = useSelector((state) => state.setMobile);
  const isTablet = useSelector((state) => state.isTablet);

  const onLogOut = () => {
    let body = {
      device_id: getLocalStorageItem("device_id"),
    };
    setIsLoggingOut(true);
    dispatch(setLogOut(null));
    dispatch(setUser(null));
    dispatch(setLoggedUser(null));
    router.replace("/home");
    dispatch(removeBet("all"));
    dispatch(removeBetAmount("all"));
    apiServices.post(apiUrl.SIGN_OUT, body).finally(() => {
      clearLocalStorage();
      refreshGamingSocket(null);
    });
  };
  return (
    <SidebarProfilMenu sideBarMenu version={version}>
      {version ? (
        <PredictionsMenu page={page} active={active} />
      ) : (
        <>
          {profileCards.map((value, index) => {
            return (
              <div key={index} className="borderProfile">
                {sideBarMenu && (
                  <Link href={value.route} key={index} data-id={index}>
                    {/* In the mobile version there shouldn't be any active menu items */}
                    <ProfileCard
                      active={
                        !isMobile && !isTablet && value.text === page
                          ? active
                          : ""
                      }
                    >
                      <div
                        className={
                          value.text === page
                            ? "dropdown sidebarBox d-flex dropdownStyle "
                            : "dropdown sidebarBox d-flex profileMenuDisplay"
                        }
                      >
                        <Image
                          alt="img-img"
                          src={value.image}
                          className="m-2"
                        />
                        <Button
                          className={
                            "btn dropdown-toggle popularDropdown profile top w-100 "
                          }
                          type="button"
                          text={value.cardName}
                        />
                        {value?.buttonText && (
                          <button className="link-in-bonuses-promotions">
                            {value?.buttonText}{" "}
                          </button>
                        )}
                        {profileMenu ? (
                          ""
                        ) : (
                          <Image
                            src={images.arrowIcon}
                            alt="arrow"
                            className="arrow rotate profileMenu"
                          />
                        )}
                      </div>
                    </ProfileCard>
                  </Link>
                )}
              </div>
            );
          })}
        </>
      )}
      {!version && (
        <ProfileCard>
          <div className="dropdown sidebarBox profileMenuDisplay">
            <Image alt="logoutIcon" src={images.logoutIcon} className="m-2" />
            <Button
              className={"btn dropdown-toggle azDropdown profile top w-100"}
              type="button"
              onClick={onLogOut}
              text={"Log out"}
            />
          </div>
        </ProfileCard>
      )}
    </SidebarProfilMenu>
  );
};
