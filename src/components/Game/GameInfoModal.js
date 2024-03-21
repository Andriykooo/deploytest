"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { Button } from "../button/Button";
import "./GameInfoModal.css";
import { useSelector } from "react-redux";

export const GameInfoModal = ({ onClose, modalInfo }) => {
  const t = useTranslations();
  const modalRef = useRef(null);
  const settings = useSelector((state) => state.settings);
  const symbol = useSelector(
    (state) => state.loggedUser?.user_data?.currency?.symbol
  );

  useEffect(() => {
    const handleScroll = () => {
      onClose();
    };

    if (modalInfo) {
      document.body.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.body.removeEventListener("scroll", handleScroll);
    };
  }, [modalInfo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!modalInfo) {
    return null;
  }

  const { min_bet, max_bet, reels, return_to_player, volatility, lines } =
    modalInfo.details || {};

  const minBetToDisplay = `${
    symbol || settings?.default_currency_symbol
  }${formatNumberWithDecimal(min_bet)?.replace(/\.00$/, "")}`;
  const maxBetToDisplay = `${
    symbol || settings?.default_currency_symbol
  }${formatNumberWithDecimal(max_bet)?.replace(/\.00$/, "")}`;

  return (
    <div
      className="infoModal"
      style={{ left: modalInfo.position.x, top: modalInfo.position.y }}
      ref={modalRef}
    >
      <h2>{modalInfo.title}</h2>
      <div className="infoContainer">
        {!!min_bet && (
          <div className="infoItem">
            <h3>{t("casino.min_bet")}</h3>
            <p>{minBetToDisplay}</p>
          </div>
        )}
        {!!max_bet && (
          <div className="infoItem">
            <h3>{t("casino.max_bet")}</h3>
            <p>{maxBetToDisplay}</p>
          </div>
        )}
        {!!return_to_player && (
          <div className="infoItem">
            <h3>{t("casino.rtp")}</h3>
            <p>{`${parseFloat(return_to_player)}%`}</p>
          </div>
        )}
        {!!reels && (
          <div className="infoItem">
            <h3>{t("casino.reels")}</h3>
            <p>{reels}</p>
          </div>
        )}
        {!!lines && (
          <div className="infoItem">
            <h3>{t("casino.lines")}</h3>
            <p>{formatNumberWithDecimal(lines).replace(/\.00$/, "")}</p>
          </div>
        )}
        {!!volatility && (
          <div className="infoItem">
            <h3>{t("casino.volatility")}</h3>
            <p>{volatility}</p>
          </div>
        )}
      </div>
      <Button
        text={t("common.play_now")}
        className="btnPrimary btnPlayNow"
        onClick={modalInfo.playGame}
      />
    </div>
  );
};
