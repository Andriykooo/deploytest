import { CasinoXIcon } from "@/utils/icons";
import "./GameListModal.css";
import { useSelector } from "react-redux";
import Image from "next/image";
import { images } from "@/utils/imagesConstant";
import { useTranslations } from "next-intl";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { Button } from "@/components/button/Button";

export const GameListModal = ({ onClose, game, playGame }) => {
  
  const t = useTranslations();
  const isMobile = useSelector((state) => state.setMobile);
  const settings = useSelector((state) => state.settings);
  const symbol = useSelector(
    (state) => state.loggedUser?.user_data?.currency?.symbol
  );

  const { min_bet, max_bet, return_to_player } = game.details || {};

  const minBetToDisplay = `${
    symbol || settings?.default_currency_symbol
  }${formatNumberWithDecimal(min_bet)?.replace(/\.00$/, "")}`;
  const maxBetToDisplay = `${
    symbol || settings?.default_currency_symbol
  }${formatNumberWithDecimal(max_bet)?.replace(/\.00$/, "")}`;
  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fade modal show casino-modal"
        tabIndex="-1"
      >
        <div className="modal-dialog casino-modal-dialog gameList-modal-dialog">
          <div className="modal-content gameList-modal-content">
            <div className="modal-header gameList-modal-header">
              <span>{game?.title}</span>
              <div onClick={() => onClose()}>
                <CasinoXIcon />
              </div>
            </div>
            <div className="modal-body gameList-modal-body">
              <div className="img-description-container">
              <div className="modal-game-image">
                <Image objectFit="contain" fill alt={game?.title} src={isMobile? game.mobile_image_url : game.web_image_url} />
              </div>
              <div className="game-description">{game.details?.description}</div>
              </div>
              <div className="game-content-bottom">
                <div className="dashedLine">
                  <Image src={images.dashedLine} alt="horse-racing" fill />
                </div>
                <div className="modalList-details">
                  {!!min_bet && (
                    <div className="infoItem-modal">
                      <h3>{t("casino.minimum_bet")}</h3>
                      <p>{minBetToDisplay}</p>
                    </div>
                  )}
                  {!!max_bet && (
                    <div className="infoItem-modal">
                      <h3>{t("casino.maximum_bet")}</h3>
                      <p>{maxBetToDisplay}</p>
                    </div>
                  )}
                  {!!return_to_player && (
                    <div className="infoItem-modal">
                      <h3>{t("casino.return_to_player")}</h3>
                      <p>{`${parseFloat(return_to_player)}%`}</p>
                    </div>
                  )}
                </div>
                <div className="button-play-now">
                  <Button
                    text={t("common.play_now")}
                    className="btnPrimary play-now"
                    onClick={() => playGame(game)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isMobile && <div className="fade modal-backdrop show"></div>}
    </>
  );
};
