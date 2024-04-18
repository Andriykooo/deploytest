import React from "react";
import classNames from "classnames";
import { WarningIcon } from "@/icons/WarningIcon";
import { Button } from "@/components/button/Button";
import { useTranslations } from "@/hooks/useTranslations";
import { useCustomRouter } from "@/hooks/useCustomRouter";

const InsufficentBalance = ({ modalClose }) => {
  const t = useTranslations();
  const router = useCustomRouter();

  const handleClose = () => {
    modalClose();
  };

  const handleDeposit = () => {
    router.push("/settings/deposit");
    modalClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={classNames("fade modal show casino-modal casino-modal-modal ")}
      tabIndex="-1"
    >
      <div className="modal-dialog casino-modal-dialog">
        <div className={classNames("modal-content casino-modal-content")}>
          <div className="modal-body casino-modal-body session-modal session-closed bigger">
            <div>
              <WarningIcon />
              <h3 className="session-title smaller">
                {t("casino.insufficient_balance")}
              </h3>
              <p className="session-p smaller">
                {t("casino.insufficient_balance_p")}
              </p>
              <div className="d-flex align-item-center justify-space-between gap-5 buttons-container">
                <Button
                  className={"btnPrimary borderedButton "}
                  onClick={handleClose}
                  text={t("common.cancel")}
                />
                <Button
                  className={"btnPrimary continueBtn validBtn"}
                  onClick={handleDeposit}
                  text={t("common.deposit_now")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsufficentBalance;
