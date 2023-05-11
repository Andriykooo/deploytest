import React from "react";
import { NavLink } from "react-router-dom";
import { predictionPages } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { GoBackButton } from "../custom/GoBackButton";
import { ProfileCard } from "./Styled";

export const PredictionsMenu = ({ page, active }) => {
  return (
    <>
      <GoBackButton />
      <p className="historyBets">Prediction History</p>
      {predictionPages.map((value, index) => {
        return (
          <NavLink to={value.route} key={index}>
            <ProfileCard
              key={index}
              data-id={index}
              active={value.text === page ? active : ""}
            >
              <div
                className={
                  value.text === page
                    ? "dropdown sidebarBox d-flex openBets "
                    : "dropdown sidebarBox d-flex profileMenuDisplay "
                }
              >
                <img
                  alt="sports-icon"
                  src={value.image}
                  className="m-2 sports-icon"
                />
                <Button
                  className={"btn dropdown-toggle popularDropdown profile top w-100"}
                  type="button"
                  text={value.cardName}
                />
                <img
                  src={images.arrowIcon}
                  alt="arrow"
                  className="arrow rotate profileMenu"
                />
              </div>
            </ProfileCard>
          </NavLink>
        );
      })}
    </>
  );
};
