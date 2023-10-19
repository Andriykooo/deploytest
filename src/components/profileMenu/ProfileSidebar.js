import { getLocalStorageItem } from "@/utils/localStorage";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { apiServices } from "../../utils/apiServices";
import { apiUrl, profileCards } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { PredictionsMenu } from "./PredictionsMenu";
import { ProfileCard, SidebarProfilMenu } from "./Styled";
import { useLogout } from "@/hooks/useLogout";

export const ProfileSidebar = ({
  sideBarMenu,
  version,
  profileMenu,
  page,
  active,
  setIsLoggingOut,
}) => {
  const isMobile = useSelector((state) => state.setMobile);
  const isTablet = useSelector((state) => state.isTablet);
  const logout = useLogout();

  const onLogOut = () => {
    setIsLoggingOut(true);
    logout();
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
