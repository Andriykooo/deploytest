"use client";

import { useState } from "react";
import { Button } from "../../components/button/Button";
import { apiUrl, bonusesChipDates } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import { useTranslations } from "@/hooks/useTranslations";
import "./BonuesesAndPromotions.css";
import { apiServices } from "@/utils/apiServices";
import moment from "moment/moment";
import { EmptyState } from "@/components/emptyState/EmptyState";
import { setBonusesAndPromotions } from "@/store/actions";
import classNames from "classnames";
import Image from "next/image";
import { FreeBetCreditsIcon } from "@/icons/FreeBetCreditsIcon";

function BonuesesAndPromotions() {
  const t = useTranslations();
  const dispatch = useDispatch();

  const isTablet = useSelector((state) => state.isTablet);
  const bonusesAndPromotions = useSelector(
    (state) => state.bonusesAndPromotions
  );

  const [selected, setSelected] = useState(bonusesChipDates[0]);

  const handleClick = (chip) => {
    setSelected(chip);

    apiServices
      .get(`${apiUrl.GET_BONUSES_PROMOTIONS}`, { all: chip.value })
      .then((response) => {
        dispatch(
          setBonusesAndPromotions({
            [chip.name]: response,
          })
        );
      });
  };

  const BONUS_STATUSES = {
    available: t("bonuses_promotions.available"),
    partly_used: t("bonuses_promotions.partly_used"),
    expired: t("bonuses_promotions.expired"),
    used: t("bonuses_promotions.used"),
  };

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
        <div className="promotion-nav">
          {bonusesChipDates.map((item) => {
            const isSelected = selected.id === item.id;
            return (
              <div
                className={classNames("menu", { "selected-bonus": isSelected })}
                key={item.id}
                onClick={() => handleClick(item)}
              >
                <Button
                  className={classNames("menu-link-promotions", {
                    selected: isSelected,
                  })}
                  type="button"
                  text={t(`common.${item?.name}`)}
                />
              </div>
            );
          })}
        </div>
        <div className="promotions-body">
          {bonusesAndPromotions?.[selected.name]?.length ? (
            bonusesAndPromotions?.[selected.name].map((value) => {
              return (
                <div className="promotions-container" key={value.id}>
                  <div className="promotion-background-circle">
                    {value?.icon ? (
                      <Image
                        src={value.icon}
                        className="promotion-icon"
                        height={20}
                        width={20}
                        alt="bonusIcon"
                      />
                    ) : (
                      <FreeBetCreditsIcon />
                    )}
                  </div>
                  <div className="promotion-details">
                    <p className="promotion-title m-0">{value.title}</p>
                    <div className="promotion-info">
                      <div className="promotion-values-container">
                        <p className="promotion-valid  m-0">
                          {t("bonuses_promotions.valid_until")}:
                        </p>{" "}
                        &nbsp;
                        <p className="promotion-value fw-bold m-0">
                          {moment(value.end_date, "YYYY-MM-DD HH:mm:ss").format(
                            "DD.MM.YYYY HH:mm"
                          )}
                        </p>
                      </div>
                      <p className="promotion-amount m-0">
                        {t("bonuses_promotions.amount")}{" "}
                        <span className="promotion-value fw-bold">
                          {`${value.amount_used}/${value.amount}`}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className={`promotion-duration ${value.status}-promotion`}>
                    {BONUS_STATUSES[value?.status]}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="empty-container">
              <EmptyState
                message={t("bonuses_promotions.there_are_no_free_bets")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BonuesesAndPromotions;
