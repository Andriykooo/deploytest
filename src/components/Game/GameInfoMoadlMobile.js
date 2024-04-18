import { useTranslations } from "@/hooks/useTranslations";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { Button } from "../button/Button";
import { useSelector } from "react-redux";
import { CloseMenu } from "@/icons/CloseMenu";
import "./GameInfoMoadlMobile.css";

export const GameInfoMoadlMobile = ({ onClose, modalInfo }) => {
  const t = useTranslations();
  const settings = useSelector((state) => state.settings);
  const symbol = useSelector(
    (state) => state.loggedUser?.user_data?.currency?.symbol
  );

  const { min_bet, max_bet, reels, return_to_player, volatility, lines } =
    modalInfo.details || {};

  return (
    <div
      className="modal game-info-mobile"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block", padding: "0" }}
    >
      <div className="modal-content game-info-modal-content">
        <div className="d-flex justify-content-center periodLine"></div>
        <div className="modal-head">
          <h2>{modalInfo.title}</h2>
          <CloseMenu
            width="24px"
            height="24px"
            onClick={() => {
              onClose();
            }}
          />
        </div>
        <div className="px-3 w-100">
          <div className="dashedDiv" />
        </div>
        <div className="preferencesModalMobile-list game-modal-mobile">
          <div className="info-modal-content">
            {!!min_bet && (
              <div className="info-item-mobile">
                <h3>{t("casino.min_bet")}</h3>
                <p>{`${formatNumberWithDecimal(min_bet).replace(/\.00$/, "")}${
                  symbol || settings?.default_currency_symbol
                }`}</p>
              </div>
            )}
            {!!max_bet && (
              <div className="info-item-mobile">
                <h3>{t("casino.max_bet")}</h3>
                <p>{`${formatNumberWithDecimal(min_bet).replace(/\.00$/, "")}${
                  symbol || settings?.default_currency_symbol
                }`}</p>
              </div>
            )}
            {!!return_to_player && (
              <div className="info-item-mobile">
                <h3>{t("casino.rtp")}</h3>
                <p>{`${parseFloat(return_to_player)}%`}</p>
              </div>
            )}
            {!!reels && (
              <div className="info-item-mobile">
                <h3>{t("casino.reels")}</h3>
                <p>{reels}</p>
              </div>
            )}
            {!!lines && (
              <div className="info-item-mobile">
                <h3>{t("casino.lines")}</h3>
                <p>{formatNumberWithDecimal(lines).replace(/\.00$/, "")}</p>
              </div>
            )}
            {!!volatility && (
              <div className="info-item-mobile">
                <h3>{t("casino.volatility")}</h3>
                <p>{volatility}</p>
              </div>
            )}
          </div>
          <Button
            text={t("common.play_now")}
            className="btnPrimary btnPlayNow-mobile"
            onClick={() => {
              modalInfo.playGame();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
