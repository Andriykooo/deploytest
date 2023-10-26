import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { images } from "../../utils/imagesConstant";
import Image from "next/image";
import { useTranslations } from "next-intl";
const TransactionModals = ({ type }) => {
  const t = useTranslations();
  const isMobile = useSelector((state) => state.setMobile);
  return (
    <div>
      {type === "placed" ? (
        <>
          {/* Bet Placed Modal  */}
          <Button
            type="button"
            className={"btn btnPrimary col-4"}
            data-bs-toggle="modal"
            data-bs-target="#betPlacedModal"
            text={t("transaction_history.placed")}
          />
          <div
            className="modal fade"
            id="betPlacedModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div
              className={
                isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"
              }
            >
              <div className="modal-content">
                <div className="modal-header">
                  <div className="checkAndTitle">
                    <Image
                      alt="img-modalCheck"
                      src={images.modalCheck}
                      className="mb-4"
                    />
                    <p className="modal-title mt-3" id="exampleModalLabel">
                      {t("transaction_history.bet_placed")} (#3243)
                    </p>
                  </div>
                </div>
                <div className="modal-body">
                  <p className="fundsMsgModal placed">
                    Football - England Premiership League Liverpool vs Arsenal
                  </p>
                  <p className="fundsMsgModal">
                    Liverpool to win the match (90 min.)
                  </p>
                  <p className="fundsMsgModal placed">
                    {t("common.stake")}: 50.00
                  </p>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <Button
                    type="button"
                    className={"btn finishBtn col-8"}
                    text={t("common.close")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End of modal  */}
        </>
      ) : (
        ""
      )}
      {type === "pushed" ? (
        <>
          {/* Bet Pushed Modal  */}
          <Button
            type="button"
            className={"btn btnPrimary col-4"}
            data-bs-toggle="modal"
            data-bs-target="#betPushedModal"
            text={t("pushed")}
          />
          <div
            className="modal fade"
            id="betPushedModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div
              className={
                isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"
              }
            >
              <div className="modal-content">
                <div className="modal-header">
                  <div className="checkAndTitle">
                    <Image
                      alt="img-modalCheck"
                      src={images.modalCheck}
                      className="mb-4"
                    />
                    <p className="modal-title mt-3" id="exampleModalLabel">
                      {t("bet_pushed")} (#1223)
                    </p>
                  </div>
                </div>
                <div className="modal-body">
                  <p className="fundsMsgModal placed">
                    Football - England Premiership League Liverpool vs Arsenal
                  </p>
                  <p className="fundsMsgModal">
                    Liverpool to win the match (90 min.)
                  </p>
                  <p className="fundsMsgModal placed">
                    {t("common.stake")}: 50.00
                  </p>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <Button
                    type="button"
                    className={"btn finishBtn col-8"}
                    text={t("common.close")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End of modal  */}
        </>
      ) : (
        ""
      )}

      {type === "cancelled" ? (
        <>
          {/* Bet Cancelled Modal  */}
          <Button
            type="button"
            className={"btn btnPrimary col-4"}
            data-bs-toggle="modal"
            data-bs-target="#betCancelledModal"
            text={t("cancelled")}
          />
          <div
            className="modal fade"
            id="betCancelledModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div
              className={
                isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"
              }
            >
              <div className="modal-content">
                <div className="modal-header">
                  <div className="checkAndTitle">
                    <Image
                      alt="img-modalCheck"
                      src={images.modalCheck}
                      className="mb-4"
                    />
                    <p className="modal-title mt-3" id="exampleModalLabel">
                      {t("bet_cancelled")} (#3243)
                    </p>
                  </div>
                </div>
                <div className="modal-body">
                  <p className="fundsMsgModal placed">
                    Football - England Premiership League Liverpool vs Arsenal
                  </p>
                  <p className="fundsMsgModal">
                    Liverpool to win the match (90 min.)
                  </p>
                  <p className="fundsMsgModal placed">
                    {t("common.stake")}: 50.00
                  </p>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <Button
                    type="button"
                    className="btn finishBtn col-8"
                    text={t("common.close")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End of modal  */}
        </>
      ) : (
        ""
      )}
      {type === "deposit" ? (
        <>
          {/* Deposit Modal  */}
          <Button
            type="button"
            className={"btn btnPrimary col-4"}
            data-bs-toggle="modal"
            data-bs-target="#depositModal"
            text={t("common.deposit")}
          />
          <div
            className="modal fade"
            id="depositModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div
              className={
                isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"
              }
            >
              <div className="modal-content">
                <div className="modal-header">
                  <div className="checkAndTitle">
                    <Image
                      alt="img-modalCheck"
                      src={images.modalCheck}
                      className="mb-4"
                    />
                    <p className="modal-title mt-3" id="exampleModalLabel">
                      {t("common.deposit")}
                    </p>
                  </div>
                </div>
                <div className="modal-body">
                  <p className="fundsMsgModal placed depositSum ">$ 100</p>
                  <p className="fundsMsgModal">{t("deposited_by_card")}</p>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <Button
                    type="button"
                    className="btn finishBtn col-8"
                    text={t("common.close")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End of modal  */}
        </>
      ) : (
        ""
      )}
      {type === "withdraw" ? (
        <>
          {/* Withdrawal Modal  */}
          <Button
            type="button"
            className={"btn btnPrimary col-4"}
            data-bs-toggle="modal"
            data-bs-target="#withdrawalModal"
            text={t("common.withdraw")}
          />
          <div
            className="modal fade"
            id="withdrawalModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div
              className={
                isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"
              }
            >
              <div className="modal-content">
                <div className="modal-header">
                  <div className="checkAndTitle">
                    <Image
                      alt="img-modalCheck"
                      src={images.modalCheck}
                      className="mb-4"
                    />
                    <p className="modal-title mt-3" id="exampleModalLabel">
                      {t("withdrawal")}
                    </p>
                  </div>
                </div>
                <div className="modal-body">
                  <p className="fundsMsgModal placed depositSum ">$ 57</p>
                  <p className="fundsMsgModal">{t("withdrawn_to_card")}</p>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <Button
                    type="button"
                    className="btn finishBtn col-8"
                    text={t("common.close")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End of modal  */}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default TransactionModals;
