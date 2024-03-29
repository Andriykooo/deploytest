import { useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { useTranslations } from "next-intl";
import { ReminderIcon } from "@/utils/icons";
import { useEffect, useState } from "react";
import moment from "moment";

export const TransactionDetails = ({ data, close }) => {
  const t = useTranslations("common");
  const isMobile = useSelector((state) => state.setMobile);
  const [transactionDetails, setTransactionDetails] = useState("");
  const loggedUser = useSelector((state) => state.loggedUser);

  useEffect(() => {
    const currencySymbol = loggedUser?.user_data?.currency?.symbol || "";
    const transactionDate = moment(data?.datetime).format("DD MMM YYYY");
    const transactionTime = moment
      .utc(data?.datetime)
      .local()
      .format("hh:mm:ss A");

    let raw_amount;

    if (data?.amount?.includes("+")) {
      raw_amount = data.amount.replace("+", "");
    } else if (data?.amount?.includes("-")) {
      raw_amount = data.amount.replace("-", "");
    } else {
      raw_amount = data.amount;
    }

    setTransactionDetails({
      ...data,
      currency_symbol: currencySymbol,
      transaction_date: transactionDate,
      transaction_time: transactionTime,
      raw_amount: raw_amount,
    });
  }, [data]);

  return (
    <div
      className={isMobile ? "modal show modalFullScreen" : "modal center"}
      id="alertGamingReminderModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <div
        className={isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"}
      >
        <div className="modal-content modalCenterContent justify-content-between profile-modal">
          <div className="d-flex align-items-center flex-column transactionDetailsContent">
            <ReminderIcon className="gaming-reminder-logo" />
            <p className="depositModalLimitReminder">{data?.title}</p>
            {transactionDetails && (
              <div className="transactionDetailsContainer">
                <div className="transactionDetailsHeader">
                  {transactionDetails?.currency_symbol +
                    " " +
                    transactionDetails?.raw_amount}
                </div>

                {transactionDetails?.id && (
                  <div className="transactionDetailsRow">
                    Ref No:{" "}
                    <span className="transactionDetailsValue">
                      {transactionDetails?.id}
                    </span>
                  </div>
                )}

                {transactionDetails?.status && (
                  <div className="transactionDetailsRow">
                    Status:
                    <span className="transactionDetailsValue">
                      {transactionDetails?.status}
                    </span>
                  </div>
                )}

                {transactionDetails?.transaction_date && (
                  <div className="transactionDetailsRow">
                    Date:
                    <span className="transactionDetailsValue">
                      {transactionDetails?.transaction_date}
                    </span>
                  </div>
                )}

                {transactionDetails?.transaction_time && (
                  <div className="transactionDetailsRow">
                    Time:
                    <span className="transactionDetailsValue">
                      {transactionDetails?.transaction_time}
                    </span>
                  </div>
                )}

                {transactionDetails?.raw_amount && (
                  <div className="transactionDetailsRow">
                    Amount:
                    <span className="transactionDetailsValue">
                      {transactionDetails?.currency_symbol +
                        transactionDetails?.raw_amount}
                    </span>
                  </div>
                )}

                {transactionDetails?.currency && (
                  <div className="transactionDetailsRow">
                    Currency:
                    <span className="transactionDetailsValue">
                      {transactionDetails?.currency}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="d-flex align-items-center flex-column w-100">
            <Button
              text={t("close")}
              onClick={close}
              className={"gaming-reminder-accept-button"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
