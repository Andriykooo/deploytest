import React from "react";
import classNames from "classnames";
import { WarningIcon } from "@/icons/WarningIcon";
import { Button } from "@/components/button/Button";
import { useTranslations } from "@/hooks/useTranslations";

const FoundError = ({ modalClose }) => {
  const t = useTranslations();

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
          <div className="modal-body casino-modal-body session-modal session-closed bigger justify-content-center">
            <div>
              <WarningIcon />
              <h3 className="session-title smaller">{t("casino.found_bug")}</h3>
              <p className="session-p smaller">{t("casino.technical_issue")}</p>

              <Button
                className={"btnPrimary continueBtn validBtn"}
                onClick={handleClose}
                text={t("common.close")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundError;
