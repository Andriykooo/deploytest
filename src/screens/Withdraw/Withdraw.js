"use client";

import ProfileMenu from "@/components/profileMenu/ProfileMenu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { theme } from "../../utils/config";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import "../Withdraw/Withdraw.css";

const Withdraw = () => {
  const [selectedLimit, setSelectedLimit] = useState(-1);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [getLinkLoading, setGetLinkLoading] = useState(false);
  const [valueOfInput, setValueOfInput] = useState("");
  const [validButton, setValidButton] = useState(false);
  const router = useRouter();

  const amount = [
    { value: "20", label: "20" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
    { value: "200", label: "200" },
    { value: "500", label: "500" },
  ];

  const handleGatewayLink = () => {
    setGetLinkLoading(true);
    apiServices
      .get(`${apiUrl.GET_WITHDRAW_GATEWAY_LINK}?amount=${valueOfInput}`)
      .then((data) => {
        if (data?.url) {
          setPaymentUrl(data?.url);
        }
        setTimeout(() => setGetLinkLoading(false), 600);
      })
      .catch(() => {
        setGetLinkLoading(false);
      });
  };

  useEffect(() => {
    if (valueOfInput > 0) {
      setValidButton(true);
    } else setValidButton(false);
  }, [valueOfInput]);

  const handleChangeButton = (e) => {
    let value = e.target.value;
    if (!value) {
      setSelectedLimit(-1);
    }
    setValueOfInput(value);
  };

  return (
    <>
      <div className="backgroundLinear">
        <div className="d-none d-lg-block">
          <ProfileMenu sideBarMenu page="withdraw" active={"active"} />
        </div>

        <div className="depositLimit">
          <div className="pageContent">
            <div className="d-flex d-lg-none">
              <div className="d-flex ">
                <Image
                  src={images.goBackArrow}
                  alt="Go back"
                  className="goBackArrow ms-0 mb-3"
                  onClick={() => router.push("/profile")}
                />
              </div>
            </div>
            {!paymentUrl ? (
              <>
                <p className="menuTitle d-flex flex-row ">Top up your wallet</p>
                <div className="col-md-6"></div>
                <div className="deposit-form span-sm-0">
                  <p
                    style={{
                      color: "white",
                      fontFamily: theme?.fonts?.fontRegular,
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "22.4px",
                    }}
                  >
                    {" "}
                    Enter or select the amount in GBP
                  </p>
                  <input
                    type="text"
                    className="deposit-input"
                    onChange={(e) => handleChangeButton(e)}
                    value={valueOfInput}
                    placeholder="0.00"
                  />

                  <div className="price-inputs">
                    {amount.map((value, index) => {
                      return (
                        <div
                          key={index}
                          data-id={index}
                          className={
                            selectedLimit === value.label
                              ? "selectDecimalDeposit selectedOddDeposit d-flex mb-3"
                              : "selectDecimalDeposit selectedOddDeposit2 d-flex mb-3"
                          }
                          onClick={() => {
                            setValueOfInput(value.label);
                            if (selectedLimit === value.label) {
                              setSelectedLimit(0);
                            } else {
                              setSelectedLimit(value.label);
                            }
                          }}
                        >
                          <p className="m-3 decimalText">{value.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="button-div">
                  <Button
                    type="submit"
                    onClick={() => {
                      handleGatewayLink();
                    }}
                    className={
                      validButton
                        ? "submit-button-deposit btnPrimary"
                        : "submit-button-deposit"
                    }
                    text={getLinkLoading ? <Loader /> : "Authorise"}
                  />
                </div>
              </>
            ) : (
              <>
                {!getLinkLoading ? (
                  <iframe
                    src={paymentUrl}
                    height="80%"
                    width="100%"
                    title="Gateway Iframe"
                    className="gateway-iframe"
                  ></iframe>
                ) : (
                  <div className="withdrawLoader">
                    <Loader />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Withdraw;
