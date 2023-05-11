import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { setLogOut, setLoggedUser, setUser } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl, profileCards } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { PredictionsMenu } from "./PredictionsMenu";
import { ProfileCard, SidebarProfilMenu } from "./Styled";

export const ProfileSidebar = ({
  sideBarMenu,
  version,
  profileMenu,
  page,
  active,
  setIsLoggingOut,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onLogOut = () => {
    let body = {
      device_id: localStorage.getItem("device_id"),
    };
    setIsLoggingOut(true);
    apiServices
      .post(apiUrl.NEXT_PUBLIC_SIGN_OUT, body)
      .then(() => {
        dispatch(setLogOut(null));
        dispatch(setUser(null));
        dispatch(setLoggedUser(null));
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        localStorage.removeItem("swifty_id");
        localStorage.removeItem("kyc_access_token");
        localStorage.removeItem("userBalance");
        localStorage.removeItem("userCurrency");
        sessionStorage.removeItem("loggedUserInTime");
        navigate("/login");
        setIsLoggingOut(false);
      })
      .catch(() => {
        setIsLoggingOut(false);
      });
  };
  return (
    <SidebarProfilMenu sideBarMenu>
      {version ? (
        <PredictionsMenu page={page} active={active} />
      ) : (
        <>
          {profileCards.map((value, index) => {
            return (
              <div key={index} className="borderProfile">
                {sideBarMenu && (
                  <NavLink to={value.route} key={index} data-id={index}>
                    <ProfileCard active={value.text === page ? active : ""}>
                      <div
                        className={
                          value.text === page
                            ? "dropdown sidebarBox d-flex dropdownStyle "
                            : "dropdown sidebarBox d-flex profileMenuDisplay"
                        }
                      >
                        <img alt="img-img" src={value.image} className="m-2" />
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
                          <img
                            src={images.arrowIcon}
                            alt="arrow"
                            className="arrow rotate profileMenu"
                          />
                        )}
                      </div>
                    </ProfileCard>
                  </NavLink>
                )}
              </div>
            );
          })}
        </>
      )}
      {!version && (
        <ProfileCard>
          <div className="dropdown sidebarBox profileMenuDisplay">
            <img alt="logoutIcon" src={images.logoutIcon} className="m-2" />
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
