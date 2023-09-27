import classNames from "classnames";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { inPlayHomeMenu } from "../../utils/constants";
import { Button } from "../button/Button";
import "../casinoMenu/CasinoMenu.css";
import { useClientTranslation } from "@/app/i18n/client";

export const InPlayHomeMenu = () => {
  const { t } = useClientTranslation("home");
  const [selected, setSelected] = useState(0);
  const isMobile = useSelector((state) => state.setMobile);

  const handleClick = (index) => {
    setSelected(index);
  };

  return (
    <>
      {!isMobile ? (
        <div className="casinoMenu casinoSpecialMenu casinoSpecialMenus">
          {inPlayHomeMenu.map((value, index) => {
            const selectedStyle = selected === index ? "selected" : "";
            return (
              <div
                className={`menu ${selectedStyle}`}
                key={index}
                onClick={() => handleClick(index)}
              >
                <Button
                  className={`menu-link menu-links ${selectedStyle}`}
                  type="button"
                  text={t(value.name)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="casinoMenu casinoSpecialMenu casinoSpecialMenus homeSportsMenu">
          {inPlayHomeMenu.map((value, index) => {
            const selectedStyle = selected === index ? "selected" : "";
            return (
              <div
                className={`menu ${selectedStyle}`}
                key={index}
                onClick={() => handleClick(index)}
              >
                <Button
                  className={`menu-link menu-links ${selectedStyle}`}
                  type="button"
                  text={t(value.name)}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export const SportWidgetMultiSportsHomeMenu = ({
  data,
  setSelected,
  selected,
}) => {
  const { t } = useClientTranslation("home");
  const isMobile = useSelector((state) => state.setMobile);

  const handleClick = (item) => {
    setSelected(selected?.id === item?.id ? null : item);
  };

  return !isMobile ? (
    <div className="casinoMenu casinoSpecialMenu casinoSpecialMenus">
      {data?.map((item) => {
        return (
          <div
            className={classNames("menu", {
              selected: selected?.id === item.id,
            })}
            key={item.id}
            onClick={() => handleClick(item)}
          >
            <Button
              className={classNames("menu-link menu-links", {
                selected: selected?.id === item.id,
              })}
              type="button"
              text={item.name}
            />
          </div>
        );
      })}
    </div>
  ) : (
    <div className="casinoMenu casinoSpecialMenu casinoSpecialMenus homeSportsMenu">
      {inPlayHomeMenu.map((value, index) => {
        const selectedStyle = selected === index ? "selected" : "";
        return (
          <div
            className={`menu ${selectedStyle}`}
            key={index}
            onClick={() => handleClick(index)}
          >
            <Button
              className={`menu-link menu-links ${selectedStyle}`}
              type="button"
              text={t(value.name)}
            />
          </div>
        );
      })}
    </div>
  );
};

export const SwiftySpecialsHomeMenu = () => {
  const { t } = useClientTranslation("home");
  const [selected, setSelected] = useState(0);
  const isMobile = useSelector((state) => state.setMobile);

  const handleClick = (index) => {
    setSelected(index);
  };

  return (
    <>
      {!isMobile ? (
        <div className="casinoMenu casinoSpecialMenu casinoSpecialMenus">
          {inPlayHomeMenu.map((value, index) => {
            const selectedStyle = selected === index ? "selected" : "";
            return (
              <div
                className={`menu ${selectedStyle}`}
                key={index}
                onClick={() => handleClick(index)}
              >
                <Button
                  className={`menu-link menu-links ${selectedStyle}`}
                  type="button"
                  text={t(value.name)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="casinoMenu casinoSpecialMenu casinoSpecialMenus homeSportsMenu">
          {inPlayHomeMenu.map((value, index) => {
            const selectedStyle = selected === index ? "selected" : "";
            return (
              <div
                className={`menu ${selectedStyle}`}
                key={index}
                onClick={() => handleClick(index)}
              >
                <Button
                  className={`menu-link menu-links ${selectedStyle}`}
                  type="button"
                  text={t(value.name)}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
