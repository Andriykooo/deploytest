import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setLogOut, setLoggedUser, setUser } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl, profileCards } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { PredictionsMenu } from "./PredictionsMenu";
import { ProfileCard, SidebarProfilMenu } from "./Styled";
import { clearLocalStorage, getLocalStorageItem } from "@/utils/localStorage";

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
  const onLogOut = () => {
    let body = {
      device_id: getLocalStorageItem("device_id"),
    };
    setIsLoggingOut(true);
    apiServices
      .post(apiUrl.SIGN_OUT, body)
      .then(() => {
        dispatch(setLogOut(null));
        dispatch(setUser(null));
        dispatch(setLoggedUser(null));
        clearLocalStorage();
        router.push("/login");
        setIsLoggingOut(false);
      })
      .catch(() => {
        setIsLoggingOut(false);
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
                    <ProfileCard active={value.text === page ? active : ""}>
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
