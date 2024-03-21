import React, { useState } from "react";
import classNames from "classnames";
import { CasinoXIcon, Timeout } from "../../utils/icons";
import { Button } from "@/components/button/Button";
import { apiServices } from "@/utils/apiServices";
import { useTranslations } from "next-intl";
import { apiUrl } from "@/utils/constants";
import { setNotifyCasinoSession } from "@/store/actions";
import { useDispatch } from "react-redux";
import { Loader } from "@/components/loaders/Loader";

const SessionTimeout = ({ modalClose, game, sessionId, gameId }) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleOnContinue = () => {
    setLoading(true);
    const headers = {};

    if (process.env.NEXT_PUBLIC_STAGE === "development") {
      headers["x-env"] = "dev";
    }

    if (process.env.NEXT_PUBLIC_STAGE === "staging") {
      headers["x-env"] = "staging";
    }

    apiServices
      .post(
        apiUrl.CONTINUE_CASINO,
        { session_id: sessionId, game_id: gameId },
        true,
        {
          headers: headers,
        }
      )
      .then(() => {
        dispatch(setNotifyCasinoSession(null));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    dispatch(setNotifyCasinoSession(null));
    modalClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={classNames("fade modal show casino-modal casino-modal-modal")}
      tabIndex="-1"
    >
      <div className="modal-dialog casino-modal-dialog">
        <div className={classNames("modal-content casino-modal-content")}>
          <div className="modal-header casino-modal-header">
            <span>{game?.title}</span>
            <div className="casino-modal-header_buttons">
              <div onClick={handleClose}>
                <CasinoXIcon />
              </div>
            </div>
          </div>
          <div className="modal-body casino-modal-body session-modal session-timeout">
            <div>
              <Timeout />
              <h3 className="session-title">{t("casino.session_timeout")}</h3>
              <p className="session-p">{t("casino.casino_game_session")}</p>
              <Button
                className={"btnPrimary continueBtn validBtn"}
                onClick={handleOnContinue}
                text={loading ? <Loader /> : t("common.continue")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;
