"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl, depositSteps } from "../../utils/constants";
import ProfileBack from "@/components/profileBack/ProfileBack";
import "../Deposit/Deposit.css";
import "../DepositLimit/DepositLimit.css";
import DepositLimitComponent from "@/components/DepositLimitComponent/DepositLimitComponent";
import DepositAmountForm from "@/components/DepositAmountForm/DepositAmountForm";

const Deposit = () => {
  const [paymentUrl, setPaymentUrl] = useState("");
  const [getLinkLoading, setGetLinkLoading] = useState(true);
  const [step, setStep] = useState();
  const [amount, setAmount] = useState(0);

  const getGatewayLink = useCallback((value) => {
    apiServices
      .post(apiUrl.GET_PAYMENT_GATEWAY_LINK, { amount: value }, !!value)
      .then((data) => {
        if (data?.link) {
          setStep(depositSteps.deposit);
          setPaymentUrl(data?.link);
        }
        setGetLinkLoading(false);
      })
      .catch((e) => {
        if (e.response.data.error.code === 1015) {
          setStep(depositSteps.limit);
        } else {
          setStep(depositSteps.amount);
        }
        setGetLinkLoading(false);
      });
  }, []);

  const onSetAmount = () => {
    setGetLinkLoading(true);
    getGatewayLink(amount);
  };

  useEffect(() => {
    getGatewayLink();
  }, []);

  switch (step) {
    case depositSteps.limit:
      return (
        <DepositLimitComponent
          onSetLimit={() => setStep(depositSteps.amount)}
          backRoute="/profile"
        />
      );

    case depositSteps.amount:
      return (
        <DepositAmountForm
          onSetAmount={() => onSetAmount()}
          isLoading={getLinkLoading}
          setAmount={setAmount}
          amount={amount}
        />
      );

    case depositSteps.deposit:
      return (
        <div className="depositLimit">
          <div className="contentPosition secondContentPosition">
            <div className="pageContent">
              <ProfileBack />
            </div>
          </div>
          {getLinkLoading ? (
            <div className="depositLoader">
              <Loader />
            </div>
          ) : (
            <iframe
              src={paymentUrl}
              height="80%"
              width="100%"
              title="Gateway Iframe"
              className="gateway-iframe"
            ></iframe>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default Deposit;
