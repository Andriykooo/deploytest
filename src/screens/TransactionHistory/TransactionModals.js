import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { images } from "../../utils/imagesConstant";

const TransactionModals = ({ type }) => {
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
            text={"Placed"}
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
                    <img alt="img-modalCheck" src={images.modalCheck} className="mb-4" />
                    <p className="modal-title mt-3" id="exampleModalLabel">
                      Bet Placed (#3243)
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
                  <p className="fundsMsgModal placed">Stake: 50.00</p>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <Button type="button" className={"btn finishBtn col-8"} text={"Close"}/>
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
            text={"Pushed"}
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
                    <img alt="img-modalCheck" src={images.modalCheck} className="mb-4" />
                    <p className="modal-title mt-3" id="exampleModalLabel">
                      Bet Pushed (#1223)
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
                  <p className="fundsMsgModal placed">Stake: 50.00</p>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <Button type="button" className={"btn finishBtn col-8"} text={"Close"}/>
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
            text={"Cancelled"}
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
                    <img alt="img-modalCheck" src={images.modalCheck} className="mb-4" />
                    <p className="modal-title mt-3" id="exampleModalLabel">
                      Bet Cancelled (#3243)
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
                  <p className="fundsMsgModal placed">Stake: 50.00</p>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <Button type="button" className="btn finishBtn col-8" text={"Close"}/>
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
            text={"Deposit"}
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
                    <img alt="img-modalCheck" src={images.modalCheck} className="mb-4" />
                    <p className="modal-title mt-3" id="exampleModalLabel">
                      Deposit
                    </p>
                  </div>
                </div>
                <div className="modal-body">
                  <p className="fundsMsgModal placed depositSum ">$ 100</p>
                  <p className="fundsMsgModal">Has been deposited by card</p>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <Button type="button" className="btn finishBtn col-8" text={"Close"}/>
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
            text={"Withdraw"}
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
                    <img alt="img-modalCheck" src={images.modalCheck} className="mb-4" />
                    <p className="modal-title mt-3" id="exampleModalLabel">
                      Withdrawal
                    </p>
                  </div>
                </div>
                <div className="modal-body">
                  <p className="fundsMsgModal placed depositSum ">$ 57</p>
                  <p className="fundsMsgModal">Has been withdrawned to card</p>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <Button type="button" className="btn finishBtn col-8" text={"Close"}/>
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
