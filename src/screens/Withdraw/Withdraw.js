"use client";

import ProfileBack from "@/components/profileBack/ProfileBack";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import Information from "@/components/information/Information";
import classNames from "classnames";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { useTranslations } from "next-intl";
import "../Withdraw/Withdraw.css";

const Withdraw = () => {
  const t = useTranslations();
  const [paymentUrl, setPaymentUrl] = useState("");
  const [getLinkLoading, setGetLinkLoading] = useState(false);
  const [valueOfInput, setValueOfInput] = useState("");
  const [validButton, setValidButton] = useState(false);
  const userBalance = useSelector(
    (state) => state.loggedUser?.user_data?.balance || 0
  );
  const userCurrency = useSelector(
    (state) => state.loggedUser?.user_data.currency?.symbol || ""
  );
  const isTablet = useSelector((state) => state.isTablet);

  const handleGatewayLink = () => {
    setGetLinkLoading(true);
    apiServices
      .post(apiUrl.GET_WITHDRAW_GATEWAY_LINK, { amount: valueOfInput })
      .then((data) => {
        if (data?.link) {
          setPaymentUrl(data?.link);
        }
      })
      .finally(() => {
        setGetLinkLoading(false);
      });
  };

  useEffect(() => {
    if (valueOfInput > 0) {
      setValidButton(true);
    } else setValidButton(false);
  }, [valueOfInput]);

  const handleChangeInput = (e) => {
    setValueOfInput(e.target.value);
  };

  if (paymentUrl) {
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

  return (
    <div className="depositLimit">
      <div
        className={classNames("pageContent", {
          "max-width-container": !isTablet,
        })}
      >
        <ProfileBack />

        <PreferencesTitle
          title={t("common.withdraw")}
          showBack={false}
          marginBottomSize="sm"
        />
        <Information
          className="withdrawInformation"
          text={t("withdraw.withdrawal_restrictions_message")}
        />
        <div className="deposit-form span-sm-0">
          <div>
            <p className="withdraw-enter-text">
              {t("withdraw.withdrawal_amount_prompt")}
            </p>
            <div className="withdraw-input-container">
              <input
                type="text"
                className="deposit-input"
                onChange={(e) => handleChangeInput(e)}
                value={valueOfInput}
                placeholder="0.00"
              />
              <button
                className="max-button"
                onClick={() => setValueOfInput(userBalance)}
              >
                {t("withdraw.max")}
              </button>
            </div>
            <p className="user-balance">
              {t("withdraw.balance")} {userCurrency}{" "}
              {formatNumberWithDecimal(userBalance)}
            </p>
          </div>
          <div className="preferences-button-container">
            <Button
              type="submit"
              onClick={() => {
                handleGatewayLink();
              }}
              className={classNames("submit-button-deposit", {
                btnPrimary: validButton,
                "btn finishBtn disabled setLimitBtn col-8": !validButton,
              })}
              text={getLinkLoading ? <Loader /> : t("common.authorise")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
