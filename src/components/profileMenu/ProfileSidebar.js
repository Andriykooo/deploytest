
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { profileCards } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { PredictionsMenu } from "./PredictionsMenu";
import { ProfileCard, SidebarProfilMenu } from "./Styled";
import { useClientTranslation } from "@/app/i18n/client";
import { useLogout } from "@/hooks/useLogout";
import { Logout } from "@/utils/icons";

export const ProfileSidebar = ({
  sideBarMenu,
  version,
  profileMenu,
  page,
  active,
  setIsLoggingOut,
}) => {
  const { t } = useClientTranslation("common");
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
                        {value.icon}
                        <Button
                          className={
                            "btn dropdown-toggle popularDropdown profile top w-100 "
                          }
                          type="button"
                          text={t(value.cardName)}
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
            <Logout />
            <Button
              className={"btn dropdown-toggle azDropdown profile top w-100"}
              type="button"
              onClick={onLogOut}
              text={t("log_out")}
            />
          </div>
        </ProfileCard>
      )}
    </SidebarProfilMenu>
  );
};

