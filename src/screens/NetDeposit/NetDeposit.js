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
import { useClientTranslation } from "@/app/i18n/client";

const NetDeposit = () => {
  const { t } = useClientTranslation(["net_deposit", "common"]);
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
      name: t("common:today"),
      value: "1",
    },
    {
      name: t("last_7_days"),
      value: "7",
    },
    {
      name: t("last_30_days"),
      value: "30",
    },
    {
      name: t("last_3_months"),
      value: "90",
    },
    {
      name: t("last_year"),
      value: "365",
    },
    {
      name: t("all_time"),
      value: "-1",
    },
  ];

  var netDepositText = t("all_time");
  if (selectedLimit === -1) {
    netDepositText = t("all_time");
  } else if (selectedLimit === 1) {
    netDepositText = t("common:today");
  } else if (selectedLimit === 7) {
    netDepositText = t("last_7_days");
  } else if (selectedLimit === 30) {
    netDepositText = t("last_30_days");
  } else if (selectedLimit === 90) {
    netDepositText = t("last_3_months");
  } else if (selectedLimit === 365) {
    netDepositText = t("last_year");
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
        <PreferencesTitle title={t("common:net_deposit")} marginBottomSize="sm" />
        <p className="menuText">{t("net_deposit_description")}</p>
        <div className="row selectDepositDiv mb-3">
          <p className="depositText col-6">{t("net_deposit_period")}</p>
          <PreferencesDropdown
            data={{ data: options, show: modalShow, title: t("common:net_deposit") }}
            selectedItem={selectedLimit}
            handleToggle={handleShow}
            handleSelect={(limit) => handleSetLimit(limit)}
            placeholder={netDepositText}
            btnTitle={t("set_period")}
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
