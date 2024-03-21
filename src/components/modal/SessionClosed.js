import React, { useState } from "react";
import classNames from "classnames";
import { WarningIcon } from "../../utils/icons";
import { Button } from "@/components/button/Button";
import { apiServices } from "@/utils/apiServices";
import { useTranslations } from "next-intl";
import { apiUrl } from "@/utils/constants";
import { Loader } from "@/components/loaders/Loader";

const SessionClosed = ({ modalClose }) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const handleOnCloseAll = () => {
    setLoading(true);
    const headers = {};

    if (process.env.NEXT_PUBLIC_STAGE === "development") {
      headers["x-env"] = "dev";
    }

    if (process.env.NEXT_PUBLIC_STAGE === "staging") {
      headers["x-env"] = "staging";
    }

    apiServices
      .post(apiUrl.CLOSE_SESSIONS, {}, true, {
        headers: headers,
      })
      .then(() => {
        modalClose();
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
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
          <div className="modal-body casino-modal-body session-modal session-closed bigger">
            <div>
              <WarningIcon />
              <h3 className="session-title smaller">
                {t("casino.another_open_session")}
              </h3>
              <p className="session-p smaller">
                {t("casino.open_session_opend")}
              </p>
              <div className="d-flex align-item-center justify-space-between gap-5 buttons-container">
                <Button
                  className={"btnPrimary borderedButton "}
                  onClick={handleClose}
                  text={t("common.cancel")}
                />
                <Button
                  className={"btnPrimary continueBtn validBtn"}
                  onClick={handleOnCloseAll}
                  text={loading ? <Loader /> : t("casino.close_all_sessions")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionClosed;
