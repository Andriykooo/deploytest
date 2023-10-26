"use client";

import { useSelector } from "react-redux";
import classNames from "classnames";
import { useTranslations } from "next-intl";
export const Place = ({ item, place, onClick, disable, eventId }) => {
  const t = useTranslations();
  const selectedPlayerBets = useSelector((state) => state.selectedBets);

  const places = {
    1: t("racecard.1st"),
    2: t("racecard.2nd"),
    3: t("racecard.3rd"),
    any: t("common.any"),
  };

  let selectionType;
  let eventIdInBetslip;

  const selectedItem = selectedPlayerBets.bets.find((element) => {
    if (!eventIdInBetslip) {
      eventIdInBetslip = element.event_id;
    }

    if (element.place === "any") {
      selectionType = "any";
      return element.bet_id === item.bet_id && element.place === place;
    }

    if (element.place === 1 || element.place === 2 || element.place === 3) {
      selectionType = "place";
      return element.bet_id === item.bet_id || element.place === place;
    }

    return element.bet_id === item.bet_id;
  });

  const currentPlaceIsSelected =
    selectedItem?.place === place && selectedItem?.bet_id !== item.bet_id;

  const currentRunnerIsSelected =
    selectedItem?.place !== place && selectedItem?.bet_id === item.bet_id;

  const selectionIsAny = selectionType === "place" && place === "any";
  const selectionsIsNotAny = selectionType === "any" && place !== "any";

  return (
    <div
      className={classNames("price", {
        ["pe-none"]: disable,
        disable:
          (eventIdInBetslip ? eventIdInBetslip !== eventId : false) ||
          (selectionType === "place"
            ? currentPlaceIsSelected ||
              currentRunnerIsSelected ||
              selectionIsAny
            : selectionsIsNotAny),
        active:
          selectedItem?.place === place && selectedItem?.bet_id === item.bet_id,
      })}
      onClick={() => onClick(item, place)}
    >
      {places[place]}
    </div>
  );
};
