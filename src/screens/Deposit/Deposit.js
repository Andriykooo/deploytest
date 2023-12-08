"use client";

import { useCallback, useState } from "react";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import DepositLimitComponent from "@/components/DepositLimitComponent/DepositLimitComponent";
import DepositAmountForm from "@/components/DepositAmountForm/DepositAmountForm";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "@/store/actions";
import "../Deposit/Deposit.css";

const Deposit = () => {
  const user = useSelector((state) => state.loggedUser);
  const dispatch = useDispatch();

  const [paymentUrl, setPaymentUrl] = useState("");
  const [getLinkLoading, setGetLinkLoading] = useState(false);
  const [step, setStep] = useState("amount");
  const [amount, setAmount] = useState(0);
  const [isLodaing, setIsLoading] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);
  const [skip, setSkip] = useState(!user?.user_data?.deposit_limit_initiated);
  const onBoarding = useSelector((state) => state.on_boarding);

  const setLimitInitialDeposit = onBoarding?.countries?.find(
    ({ cca2 }) => cca2 == user?.user_data?.country
  )?.set_limit_initial_deposit;

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

  const onSkip = () => {
    const body = {
      deposit_limit_initiated: true,
    };
    setStepLoading(true);
    apiServices.put(apiUrl.SETTINGS, body).then(() => {
      dispatch(
        setLoggedUser({
          ...user,
          user_data: {
            ...user.user_data,
            deposit_limit_initiated: true,
          },
        })
      );
      setSkip(false);
      setStepLoading(false);
    });
  };

  if (isLodaing || !user) {
    return (
      <div className="depositLimit">
        <Loader />
      </div>
    );
  }

  if (setLimitInitialDeposit && skip) {
    return (
      <DepositLimitComponent
        onSetLimit={() => setStep("amount")}
        backRoute="/profile"
        skipBtn
        loading={stepLoading}
        onSkip={() => onSkip()}
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
      <div className="paymentIframe">
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
