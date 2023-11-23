"use client";

import { useTranslations } from "next-intl";
import "./GameInfoModal.css";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { Button } from "../button/Button";

export const GAME_INFO_WIDTH = 268;
export const GAME_INFO_HEIGHT = 248;

const InfoModal = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #262522;
    width: ${GAME_INFO_WIDTH}px;
    height: fit-content;
    border-radius: 10px;
    padding: 20px 24px;
    position: fixed;
    left: ${({ position }) => position?.x}px;
    top: ${({ position }) => position?.y}px;
    z-index: 11;
  `

export const GameInfoModal = ({ onClose, modalInfo }) => {
    const t = useTranslations();
    const modalRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            onClose();
        }

        if (modalInfo) {
            document.body.addEventListener('scroll', handleScroll);
        }

        return () => {
            document.body.removeEventListener('scroll', handleScroll);
        }
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

    const {
        min_bet,
        max_bet,
        reels,
        return_to_player,
        volatility,
        lines,
    } = modalInfo.details || {};

    return (
        <InfoModal position={modalInfo.position} className="infoModalContainer" ref={modalRef}>
            <h2>{modalInfo.title}</h2>
            <div className="infoContainer">
                {!!min_bet && (
                    <div className="infoItem">
                        <h3>{t("casino.min_bet")}</h3>
                        <p>{formatNumberWithDecimal(min_bet)}</p>
                    </div>
                )}
                {!!max_bet && (
                    <div className="infoItem">
                        <h3>{t("casino.max_bet")}</h3>
                        <p>{formatNumberWithDecimal(max_bet)}</p>
                    </div>
                )}
                {!!return_to_player && (
                    <div className="infoItem">
                        <h3>{t("casino.rtp")}</h3>
                        <p>{parseFloat(return_to_player)}</p>
                    </div>
                )}
                {!!reels && (
                    <div className="infoItem">
                        <h3>{t("casino.reels")}</h3>
                        <p>{reels}</p>
                    </div>
                )}
                {!!volatility && (
                    <div className="infoItem">
                        <h3>{t("casino.volatility")}</h3>
                        <p>{volatility}</p>
                    </div>
                )}
                {!!lines && (
                    <div className="infoItem">
                        <h3>{t("casino.lines")}</h3>
                        <p>{lines}</p>
                    </div>
                )}
            </div>
            <Button text={t("common.play_now")} className="btnPrimary btnPlayNow" onClick={modalInfo.playGame} />
        </InfoModal>
    );
};