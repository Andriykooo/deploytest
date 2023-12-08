import Image from "next/image";
import { useSelector } from "react-redux";
import { profileCards } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { PredictionsMenu } from "./PredictionsMenu";
import { useTranslations } from "next-intl";
import { CustomLink } from "../Link/Link";
import { ProfileCard } from "../ProfileCard/ProfileCard";

export const ProfileSidebar = ({
  sideBarMenu,
  version,
  profileMenu,
  page,
  active,
}) => {
  const t = useTranslations("common");
  const isMobile = useSelector((state) => state.setMobile);
  const isTablet = useSelector((state) => state.isTablet);

  return (
    <div className="sidebarProfilMenu">
      {version ? (
        <PredictionsMenu page={page} active={active} />
      ) : (
        <>
          {profileCards.map((value, index) => {
            return (
              <div key={index} className="borderProfile">
                {sideBarMenu && (
                  <CustomLink href={value.route} key={index} data-id={index}>
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
                            ? "sidebarBox"
                            : "sidebarBox profileMenuDisplay"
                        }
                      >
                        <div className="profileMenuTimeTitle">
                          {value.icon}
                          <span>{t(value.cardName)}</span>
                        </div>
                        {value?.buttonText && (
                          <button className="link-in-bonuses-promotions">
                            {value?.buttonText}{" "}
                          </button>
                        )}
                        {profileMenu ? (
                          ""
                        ) : (
                          <Image
                            height={15}
                            width={15}
                            src={images.arrowIcon}
                            alt="arrow"
                            className="rotate profileMenu"
                          />
                        )}
                      </div>
                    </ProfileCard>
                  </CustomLink>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
