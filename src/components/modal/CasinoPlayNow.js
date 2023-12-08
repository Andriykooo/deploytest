import classNames from "classnames";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  CasinoXIcon,
  CompressIcon,
  ExpandIcon,
} from "../../utils/icons";
export const CasinoPlayNow = ({ game, setGame, gameUrl }) => {
  const isMobile = useSelector((state) => state.setMobile);
  const isTablet = useSelector((state) => state.isTablet);

  const [fullScreen, setFullScreen] = useState(true);

  const handleClose = () => {
    setGame(null);
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
          <div className={classNames("modal-content casino-modal-content")}>
            <div className="modal-header casino-modal-header">
              <span>{game?.title}</span>
              <div>
                {!isTablet && (
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
              {gameUrl && (
                <iframe
                  src={gameUrl}
                  title={"casino-game-iframe"}
                  className={"casino-game-iframe"}
                />)}
            </div>
          </div>
        </div>
      </div>
      {!isMobile && <div className="fade modal-backdrop show"></div>}
    </>
  );
};
