"use client";

import { useEffect, useState } from "react";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import ProfileBack from "@/components/profileBack/ProfileBack";
import "../Deposit/Deposit.css";
import "../DepositLimit/DepositLimit.css";

const Deposit = () => {
  const [paymentUrl, setPaymentUrl] = useState("");
  const [getLinkLoading, setGetLinkLoading] = useState(false);

  const handleGatewayLink = () => {
    setGetLinkLoading(true);
    apiServices
      .post(apiUrl.GET_PAYMENT_GATEWAY_LINK, { amount: 10 })
      .then((data) => {
        if (data?.link) {
          setPaymentUrl(data?.link);
        }
        setGetLinkLoading(false);
      })
      .catch(() => {
        setGetLinkLoading(false);
      });
  };

  useEffect(() => {
    handleGatewayLink();
  }, []);

  return (
    <div className="depositLimit">
      <div className="contentPosition secondContentPosition">
        <div className="pageContent">
          <ProfileBack />
        </div>
      </div>
      {!getLinkLoading && paymentUrl ? (
        <iframe
          src={paymentUrl}
          height="80%"
          width="100%"
          title="Gateway Iframe"
          className="gateway-iframe"
        ></iframe>
      ) : (
        <div className="depositLoader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Deposit;
