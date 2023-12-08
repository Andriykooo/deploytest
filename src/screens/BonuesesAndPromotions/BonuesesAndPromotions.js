"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../../components/button/Button";
import { monthDates } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { useSelector } from "react-redux";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import { useTranslations } from "next-intl";
import "./BonuesesAndPromotions.css";

function BonuesesAndPromotions() {
  const t = useTranslations();
  const [selected, setSelected] = useState(0);
  const isTablet = useSelector((state) => state.isTablet);
  const handleClick = (index) => {
    setSelected(index);
  };

  const bonusesData = [
    {
      competition: "Europa League",
      expiring: "Expiring in 2 days",
      validDate: "30.03.2023",
      amount: "0/50",
      description: "Available",
      image: images.soccerLogo,
    },
    {
      competition: "Premier League",
      expiring: "",
      validDate: "04.04.2023",
      amount: "30/50",
      description: "Partly Used",
      image: images.soccerLogo,
    },
    {
      competition: "Gallagher Premiership",
      expiring: "",
      validDate: "15.05.2023",
      amount: "15/50",
      description: "Partly Used",
      image: images.iceHockeyLogo,
    },
  ];

  return (
    <div className="depositLimit netDepositLimit">
      <div className=" bonuses-container-menu">
        <PreferencesTitle
          title={t(
            isTablet
              ? "bonuses_promotions.bonuses_and_promotions"
              : "common.bonuses_promotions"
          )}
        />
        <div className="promotion-title">
          {monthDates.map((value, index) => {
            const selectedStyle = selected === index ? "selected" : "";
            return (
              <div
                className={`menu ${selectedStyle}-bonus`}
                key={index}
                onClick={() => handleClick(index)}
              >
                <Button
                  className={`menu-link-promotions ${selectedStyle}`}
                  type="button"
                  text={t(`common.${value?.month}`) + " " + value?.year}
                />
              </div>
            );
          })}
        </div>
        {bonusesData.map((value, index) => {
          return (
            <div
              className={`promotions-container ${
                index === 0 ? "avail-background" : ""
              }`}
              key={index}
            >
              <Image
                src={value?.image}
                alt="Promotion"
                className="promotion-image"
              />
              <div className="promotion-details">
                <p className="promotion-competition fw-bold">
                  {value?.competition}
                  {value?.expiring && " - "}
                  {value?.expiring && (
                    <span className="promotion-expiring fw-normal">
                      {value?.expiring}
                    </span>
                  )}
                </p>
                <div className="promotion-info">
                  <div className="promotion-values-container">
                    <p className="promotion-valid">
                      {t("bonuses_promotions.valid_until")}:
                    </p>{" "}
                    &nbsp;
                    <p className="promotion-value fw-bold">
                      {value?.validDate}
                    </p>
                  </div>
                  <p className="promotion-amount">
                    {t("bonuses_promotions.amount")}{" "}
                    <span className="promotion-value fw-bold">
                      {value?.amount}
                    </span>
                  </p>
                </div>
              </div>
              <p
                className={`promotion-duration ${
                  index === 0 ? "available-promotion" : ""
                }`}
              >
                {value?.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BonuesesAndPromotions;
