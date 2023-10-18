"use client";

import { useCallback, useState } from "react";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl, depositSteps } from "../../utils/constants";
import ProfileBack from "@/components/profileBack/ProfileBack";
import "../Deposit/Deposit.css";
import "../DepositLimit/DepositLimit.css";
import DepositLimitComponent from "@/components/DepositLimitComponent/DepositLimitComponent";
import DepositAmountForm from "@/components/DepositAmountForm/DepositAmountForm";
import { useSelector } from "react-redux";

const Deposit = () => {
  const user = useSelector((state) => state.loggedUser);

  const [paymentUrl, setPaymentUrl] = useState("");
  const [getLinkLoading, setGetLinkLoading] = useState(false);
  const [step, setStep] = useState("amount");
  const [amount, setAmount] = useState(0);
  const [isLodaing, setIsLoading] = useState(false);
  const [skip, setSkip] = useState(!user?.user_data?.deposit_limit_initiated);

  const getGatewayLink = useCallback((value) => {
    setGetLinkLoading(true);

    apiServices
      .post(apiUrl.GET_PAYMENT_GATEWAY_LINK, { amount: value }, !!value)
      .then((data) => {
        if (data?.link) {
          setStep("deposit");
          setPaymentUrl(data?.link);
        }
        setGetLinkLoading(false);
      })
      .catch((e) => {
        if (e.response.data.error.code === 1015) {
          setStep("limit");
        } else {
          setStep("amount");
        }
        setGetLinkLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onSetAmount = () => {
    setGetLinkLoading(true);
    getGatewayLink(amount);
  };

  if (isLodaing || !user) {
    return (
      <div className="depositLimit">
        <Loader />
      </div>
    );
  }

  if (skip) {
    return (
      <DepositLimitComponent
        onSetLimit={() => setStep("amount")}
        backRoute="/profile"
        skipBtn
        onSkip={() => setSkip(false)}
      />
    );
  }

  if (step === "amount") {
    return (
      <DepositAmountForm
        onSetAmount={() => onSetAmount()}
        isLoading={getLinkLoading}
        setAmount={setAmount}
        amount={amount}
      />
    );
  }

  if (step === "deposit") {
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
  }

  return null;
};

export default Deposit;
