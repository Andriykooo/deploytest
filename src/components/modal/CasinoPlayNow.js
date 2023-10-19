import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import {
  CasinoXIcon,
  CompressIcon,
  ExpandIcon,
  PlayIcon,
} from "../../utils/icons";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import { addLocalStorageItem } from "@/utils/localStorage";

export const CasinoPlayNow = ({ game, setGame }) => {
  const router = useRouter();

  const loggedUser = useSelector((state) => state.loggedUser);
  const isMobile = useSelector((state) => state.setMobile);

  const [fullScreen, setFullScreen] = useState(false);
  const [gameUrl, setGameUrl] = useState("");
  const [loadingType, setLoadingType] = useState(false);

  const handleClose = () => {
    setGame(null);
  };

  const playGame = (game, type) => {
    if (!loggedUser) {
      addLocalStorageItem("nextUrlPath", "casino");
      router.push("/login");

      return;
    }

    const payload = {
      game_id: game?.id,
      language: "en",
      platform: "WEB",
      minimode: isMobile ? "1" : "0",
      playMode: type,
    };

    setLoadingType(type);

    apiServices
      .post(apiUrl.OPEN_CASINO_GAME, payload)
      .then((response) => {
        setGameUrl(response?.data?.gameURL);
      })
      .catch(() => {
        setLoadingType("");
      });
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className={classNames("fade modal show casino-modal", {
          "casino-full-screen": fullScreen,
        })}
        tabIndex="-1"
      >
        <div className="modal-dialog casino-modal-dialog">
          <div className="modal-content casino-modal-content">
            <div className="modal-header casino-modal-header">
              <span>{game?.name}</span>
              <div>
                {!isMobile && (
                  <>
                    {fullScreen ? (
                      <CompressIcon
                        className={"compress-icon"}
                        onClick={() => {
                          setFullScreen(!fullScreen);
                        }}
                      />
                    ) : (
                      <ExpandIcon
                        className={"compress-icon"}
                        onClick={() => {
                          setFullScreen(!fullScreen);
                        }}
                      />
                    )}
                  </>
                )}
                <span onClick={handleClose}>
                  <CasinoXIcon />
                </span>
              </div>
            </div>
            <div className="modal-body casino-modal-body">
              {gameUrl ? (
                <iframe
                  src={gameUrl}
                  title={"casino-game-iframe"}
                  className={"casino-game-iframe"}
                />
              ) : (
                <>
                  <div
                    className="casino-game-cover"
                    style={{
                      backgroundImage: `url(${game?.image_url})`,
                    }}
                  >
                    <PlayIcon className="play-icon" />
                  </div>
                  <div className="casino-game-description">
                    <p className="m-0">{game?.details?.description}</p>
                  </div>
                  <div className="casino-game-info">
                    <div className="casino-game-bet">
                      <div className="casino-game-amount">
                        <span className="amount-title">Minimum Bet:</span>
                        <span className="amount-value">
                          {loggedUser && game?.min_bet
                            ? loggedUser?.user_data?.currency?.symbol
                            : "-"}
                          {game?.min_bet
                            ? parseFloat(game?.min_bet).toFixed(2)
                            : ""}
                        </span>
                      </div>
                      <div className="casino-game-amount">
                        <span className="amount-title">Maximum Bet:</span>
                        <span className="amount-value">
                          {loggedUser && game?.max_bet
                            ? loggedUser?.user_data?.currency?.symbol
                            : "-"}
                          {game?.max_bet
                            ? parseFloat(game?.max_bet).toFixed(2)
                            : ""}
                        </span>
                      </div>
                      <div className="casino-game-amount">
                        <span className="amount-title">Return to player:</span>
                        <span className="amount-value">
                          {game?.return_to_player
                            ? parseFloat(game?.return_to_player) + "%"
                            : "-"}
                        </span>
                      </div>
                    </div>
                    <div className="casino-game-play">
                      <Button
                        className={"btnPrimary casino-play-now"}
                        onClick={() => {
                          !loadingType && playGame(game, "LIVE");
                        }}
                        text={loadingType === "LIVE" ? <Loader /> : "Play Now"}
                      />
                      {game?.demo_game_available === "1" && (
                        <Button
                          className={"casino-try-free"}
                          onClick={() => {
                            !loadingType && playGame(game, "DEMO");
                          }}
                          text={
                            loadingType === "DEMO" ? <Loader /> : "Try For Free"
                          }
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isMobile && <div className="fade modal-backdrop show"></div>}
    </>
  );
};
