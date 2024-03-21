import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CasinoXIcon, CompressIcon, ExpandIcon } from "../../utils/icons";
import { apiServices } from "@/utils/apiServices";
import { useParams } from "next/navigation";
import { apiUrl, casinoSessionTypes } from "@/utils/constants";
import { getLocalStorageItem } from "@/utils/localStorage";
import { setNotifyCasinoSession } from "@/store/actions";
import { CasinoLogin } from "./CasinoLogin/CasinoLogin";
import SessionTimeout from "./SessionTimeout";
import SessionClosed from "./SessionClosed";
import InsufficentBalance from "./InsufficientBalance";
import FoundError from "./FoundError";
import { nextWindow } from "@/utils/nextWindow";
import { useDispatch } from "react-redux";

import "./CasinoPlayNow.css";

export const CasinoPlayNow = ({ game, onClose }) => {
  const params = useParams();
  const dispatch = useDispatch();

  const isMobile = useSelector((state) => state.setMobile);
  const isTablet = useSelector((state) => state.isTablet);
  const loggedUser = useSelector((state) => state.loggedUser);
  const [casinoSessionInfo, setCassinoSessionInfo] = useState({
    type: "",
    session_id: "",
  });
  const notifyCasinoSession = useSelector((state) => state.notifyCasinoSession);

  const [fullScreen, setFullScreen] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [gameUrl, setGameUrl] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [isSessionClose, setIsSessionClosed] = useState(false);
  const [insufficientBalance, setInSufficientBalance] = useState(false);
  const [foundError, setFoundError] = useState(false);
  let session_id = null;

  const isLoggedIn = loggedUser && getLocalStorageItem("access_token");

  // Check if the users device is tablet
  const userAgent = navigator.userAgent.toLowerCase();
  const isDeviceTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      userAgent
    );

  const loadGame = async () => {
    const payload = {
      game_id: game?.id,
      language: params.lng,
      platform: "WEB",
      minimode: isMobile || isTablet || isDeviceTablet ? "1" : "0",
      playMode: "LIVE",
    };

    const headers = {};

    if (process.env.NEXT_PUBLIC_STAGE === "development") {
      headers["x-env"] = "dev";
    }

    if (process.env.NEXT_PUBLIC_STAGE === "staging") {
      headers["x-env"] = "staging";
    }

    return await apiServices
      .post(apiUrl.OPEN_CASINO_GAME, payload, false, {
        headers: headers,
      })
      .then((response) => {
        setGameUrl(response?.data?.gameURL);
        setSessionId(response?.data?.session_id);
        session_id = response?.data?.session_id;
        return response;
      })
      .catch((e) => {
        return e;
      });
  };

  const onCloseGame = () => {
    const headers = {};

    if (process.env.NEXT_PUBLIC_STAGE === "development") {
      headers["x-env"] = "dev";
    }

    if (process.env.NEXT_PUBLIC_STAGE === "staging") {
      headers["x-env"] = "staging";
    }

    dispatch(setNotifyCasinoSession(null));

    apiServices.post(apiUrl.CLOSE_CASINO, { session_id }, true, {
      headers: headers,
    });
  };

  const handleClose = () => {
    onClose(null);
  };

  const handleOnLogin = () => {
    setIsLoginOpen(false);
    onLoad();
  };

  const onLoad = async () => {
    const data = await loadGame();
    const status = data?.response?.status;
    const success = data?.success;

    if (status === 406) {
      setInSufficientBalance(true);
    } else if (status === 451) {
      setIsSessionClosed(true);
    } else if (success) {
      nextWindow.onbeforeunload = () => {
        onCloseGame();
        return false;
      };
    } else {
      setFoundError(true);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);

      return;
    }

    onLoad();

    return () => {
      nextWindow.onbeforeunload = null;
      dispatch(setNotifyCasinoSession(null));
      if (session_id) onCloseGame();
    };
  }, []);

  useEffect(() => {
    if (
      notifyCasinoSession?.type == casinoSessionTypes.CLOSE_CASINO_SESSION ||
      notifyCasinoSession?.type == casinoSessionTypes.CLOSE_ALL_CASINO_SESSIONS
    ) {
      handleClose();
      return;
    }
    if (notifyCasinoSession?.type == casinoSessionTypes.NOTIFY_CASINO_SESSION) {
      setCassinoSessionInfo({
        type: notifyCasinoSession?.type,
        session_id: notifyCasinoSession?.session_id,
      });
      return;
    }
    setCassinoSessionInfo({
      type: "",
      session_id: "",
    });
  }, [notifyCasinoSession]);

  return (
    <>
      {isLoggedIn && (
        <>
          <div
            role="dialog"
            aria-modal="true"
            className={classNames("fade modal show casino-modal", {
              "casino-full-screen": fullScreen,
              "casino-hide":
                casinoSessionInfo?.session_id === sessionId ||
                isSessionClose ||
                insufficientBalance ||
                foundError,
            })}
            tabIndex="-1"
          >
            <div className="modal-dialog casino-modal-dialog">
              <div className={classNames("modal-content casino-modal-content")}>
                <div className="modal-header casino-modal-header">
                  <span>{game?.title}</span>
                  <div className="casino-modal-header_buttons">
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
                    <div onClick={handleClose}>
                      <CasinoXIcon />
                    </div>
                  </div>
                </div>
                <div className="modal-body casino-modal-body">
                  {gameUrl && (
                    <iframe
                      src={gameUrl}
                      title={"casino-game-iframe"}
                      className={"casino-game-iframe"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {!isMobile && <div className="fade modal-backdrop show"></div>}
          {casinoSessionInfo?.session_id === sessionId && (
            <SessionTimeout
              game={game}
              modalClose={handleClose}
              sessionId={sessionId}
              gameId={game?.id}
            />
          )}

          {isSessionClose && <SessionClosed modalClose={handleClose} />}

          {insufficientBalance && (
            <InsufficentBalance modalClose={handleClose} />
          )}

          {foundError && <FoundError modalClose={handleClose} />}
        </>
      )}
      {isLoginOpen && !isLoggedIn && (
        <CasinoLogin
          onClose={handleClose}
          onLogin={handleOnLogin}
          bgImage={game?.web_image_url}
        />
      )}
    </>
  );
};
