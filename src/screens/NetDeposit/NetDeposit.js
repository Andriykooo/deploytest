"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader } from "@/components/loaders/Loader";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import "../DepositLimit/DepositLimit.css";
import "../NetDeposit/NetDeposit.css";
import "../RealityCheck/RealityCheck.css";
import PreferencesDropdown from "@/components/preferencesDropdown/PreferencesDropdown";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";

const NetDeposit = () => {
  const [netAmount, setNetAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState(-1);
  const onBoarding = useSelector((state) => state.on_boarding);
  const netDepositOptions = onBoarding?.setting_options;

  const getNetDepositAmount = (type) => {
    var days = type ? type : "-1";
    setIsLoading(true);
    apiServices
      .get(apiUrl.GET_NET_DEPOSIT_AMOUNT + `?days=${days}`)
      .then((result) => {
        setNetAmount(result?.amount);
        setIsLoading(false);
        handleShow(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleSetLimit = (limit) => {
    getNetDepositAmount(limit);
    setSelectedLimit(limit);
  };

  useEffect(() => {
    getNetDepositAmount();
  }, []);

  const options = netDepositOptions?.net_deposit_options || [
    {
      name: "Today",
      value: "1",
    },
    {
      name: "Last 7 Days",
      value: "7",
    },
    {
      name: "Last 30 Days",
      value: "30",
    },
    {
      name: "Last 3 Months",
      value: "90",
    },
    {
      name: "Last Year",
      value: "365",
    },
    {
      name: "All Time",
      value: "-1",
    },
  ];

  var netDepositText = "All time";
  if (selectedLimit === -1) {
    netDepositText = "All time";
  } else if (selectedLimit === 1) {
    netDepositText = "Today";
  } else if (selectedLimit === 7) {
    netDepositText = "Last 7 Days";
  } else if (selectedLimit === 30) {
    netDepositText = "Last 30 Days";
  } else if (selectedLimit === 90) {
    netDepositText = "Last 3 Months";
  } else if (selectedLimit === 365) {
    netDepositText = "Last Year";
  }

  const [modalShow, setModalShow] = useState(false);

  const handleShow = (type) => {
    if (type !== undefined) {
      setModalShow(type);
    } else {
      setModalShow(!modalShow);
    }
  };

  return (
    <div className="depositLimit netDepositLimit">
      <div className="pageContent max-width-container">
        <PreferencesTitle title="Net Deposit" marginBottomSize="sm" />
        <p className="menuText">
          Net deposit amount shows the sum of all withdrawals minus deposits
          over a period of time.
        </p>
        <div className="row selectDepositDiv mb-3">
          <p className="depositText col-6">Net Deposit Period</p>
          <PreferencesDropdown
            data={{ data: options, show: modalShow, title: "Net Deposit" }}
            selectedItem={selectedLimit}
            handleToggle={handleShow}
            handleSelect={(limit) => handleSetLimit(limit)}
            placeholder={netDepositText}
            btnTitle="Set period"
            modalOnMobile
            handleSubmit={handleSetLimit}
          />
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <p className="netDepositValue">{netAmount}</p>
        )}
      </div>
    </div>
  );
};

export default NetDeposit;
