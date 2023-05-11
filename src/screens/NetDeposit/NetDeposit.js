import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button/Button";
import Header from "../../components/header/Header";
import { Loader } from "../../components/loaders/Loader";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";

const NetDeposit = () => {
  const [loader, setLoader] = useState(true);
  const [netAmount, setNetAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState(0);
  const isMobile = useSelector((state) => state.setMobile);
  const onBoarding = useSelector((state) => state.on_boarding);
  const netDepositOptions = onBoarding?.setting_options;

  const getNetDepositAmount = (type) => {
    var days = type ? type : "-1";
    setIsLoading(true);
    apiServices
      .get(apiUrl.NEXT_PUBLIC_GET_NET_DEPOSIT_AMOUNT + `?days=${days}`)
      .then((result) => {
        setNetAmount(result?.amount);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleSetLimit = () => {
    getNetDepositAmount(selectedLimit);
  };

  useEffect(() => {
    setLoader(true);

    setTimeout(() => {
      getNetDepositAmount();
      setLoader(false);
    }, 1500);
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
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);

  const handleShow = () => {
    setModalShow(!modalShow);
  };

  return (
    <>
      <Header />
      <div className="backgroundLinear ">
        <div className="d-none d-lg-block">
          <ProfileMenu sideBarMenu page="net_deposit" active={"active"} />
        </div>
        <div className="depositLimit  netDepositLimit">
          <div className="pageContent max-width-container">
            <div className="d-flex d-lg-none">
              <div className="d-flex ">
                <img
                  src={images.goBackArrow}
                  alt="Go back"
                  className="goBackArrow ms-0 "
                  onClick={() => navigate("/profile")}
                />
              </div>
            </div>
            <div className={!modalShow ? "" : "modal-overlay"}>
              <div
                className={
                  !modalShow
                    ? "modal fade"
                    : "modal modal-open fade show netShow"
                }
                id="limitModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div
                  className={
                    isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"
                  }
                >
                  <div className="modal-content modalCenterContent">
                    <p className="d-flex justify-content-center depositModalLimit">
                      Net Deposit
                    </p>
                    <img
                      src={images.closeIcon}
                      className="closeIconSus"
                      alt="Close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setSelectedLimit(0);
                        setModalShow(!modalShow);
                      }}
                    />
                    {options.map((value, index) => {
                      return (
                        <div
                          key={index}
                          data-id={index}
                          className={
                            selectedLimit === value.value
                              ? "selectDecimal selectedOdd d-flex mb-3"
                              : "selectDecimal d-flex mb-3"
                          }
                          onClick={() => {
                            if (selectedLimit === value.value) {
                              setSelectedLimit(0);
                            } else {
                              setSelectedLimit(value.value);
                            }
                          }}
                        >
                          <div className="selectDecimal">
                            <p className="m-3 decimalText">{value.name}</p>
                          </div>
                          {selectedLimit === value.value && (
                            <img
                              src={images.validated}
                              alt="selected"
                              className="oddsSelected"
                            />
                          )}
                        </div>
                      );
                    })}

                    <div className="modal-footer limit d-flex justify-content-center">
                      <Button
                        type="button"
                        className={
                          selectedLimit !== 0
                            ? "btn btnPrimary finishBtn setLimitBtn col-8"
                            : "btn finishBtn disabled setLimitBtn col-8"
                        }
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => {
                          handleSetLimit();
                          setModalShow(!modalShow);
                        }}
                        text={"Set Period"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="menuTitle ">Net Deposit </p>
            <p className="menuText">
              Net deposit amount shows the sum of all withdrawals minus deposits
              over a period of time.
            </p>
            <div className="row selectDepositDiv ">
              <p className="depositText col-6">Net Deposit Period</p>
              <div className="col-6">
                <Button
                  type="button"
                  className="setLimit"
                  text={
                    <>
                      {loader ? (
                        <div className="d-flex justify-content-between">
                          <Skeleton
                            variant="rectangular"
                            className="my-2 depositSkeleton"
                            animation="wave"
                          />
                        </div>
                      ) : (
                        <span className="depositTextDisplay">
                          {netDepositText}
                        </span>
                      )}
                      <img
                        src={images.arrowIcon}
                        className="depositLimitArrow"
                        alt="Click"
                      />
                    </>
                  }
                  onClick={handleShow}
                />
              </div>
            </div>
            {isLoading ? (
              <Loader />
            ) : (
              <p className="netDepositValue">{netAmount}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NetDeposit;
