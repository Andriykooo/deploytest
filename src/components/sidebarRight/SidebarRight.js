"use client";

import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBet,
  removeBetAmount,
  removeReturnValue,
  setBetTicker,
  setLoggedUser,
} from "../../store/actions";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { CloseIcon, EmptyFolder, XIcon } from "../../utils/icons";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import { BetSlipAds } from "./BetSlipAds";
import { SelectOfMultipleBets } from "./SelectBetOfMultipleBets";
import { SelectedBet } from "./SelectedBet";

export const SidebarRight = ({ data }) => {
  const dispatch = useDispatch();
  const isTablet = useSelector((state) => state.isTablet);
  const loggedUser = useSelector((state) => state.loggedUser);
  const selectedBets = useSelector((state) => state.selectedBets);
  const betTicker = useSelector((state) => state.betTicker);

  const [myBets, setMyBets] = useState(false);
  const [selectedButton, setSelectedButton] = useState(1);
  const [showExtraOdds, setShowExtraOdds] = useState(true);
  const [placeBetIsLoading, setPlaceBetIsLoading] = useState(false);
  const emptyBetSlip = {
    singles: [],
    combinations: [],
    total_stakes: 0,
    total_payout: 0,
  };
  const [betSlipResponse, setBetSlipResponse] = useState(emptyBetSlip);

  const myBetsArray = ["All", "Open", "Cash Out", "Settled"];

  const handleClick = () => {
    if (showExtraOdds === true) {
      setShowExtraOdds(false);
    } else setShowExtraOdds(true);
  };

  const handleClickBets = (type) => {
    if (type === "betslip") {
      setMyBets(false);
    } else setMyBets(true);
  };

  const handleButtonClick = (buttonNumber) => {
    setSelectedButton(buttonNumber);
  };

  useEffect(() => {
    dispatch(removeBetAmount("all"));
    dispatch(removeReturnValue("all"));
  }, []);

  let ajaxRequest;

  const urlGenerateBetSlips = apiUrl.GET_BET_SLIP;

  useEffect(() => {
    if (selectedBets?.bets?.length == 0) return;
    setMyBets(false);

    // Stake
    let tmp = { ...betSlipResponse };
    selectedBets?.bets?.forEach((selected_row) => {
      tmp.singles.forEach((single_row) => {
        if (selected_row.bet_id === single_row.bet_id) {
          single_row.stake = selected_row.stake;
        }
      });
    });
    // Combinations
    Object.keys(selectedBets.stakes).forEach((key) => {
      tmp.combinations.forEach((combination_row) => {
        if (combination_row.type === key) {
          combination_row.stake = selectedBets.stakes[key];
        }
      });
    });
    tmp.action = "check";
    setBetSlipResponse(tmp);
    ajaxRequest = setTimeout(function () {
      apiServices
        .post(urlGenerateBetSlips, selectedBets)
        .then((resp) => {
          setBetSlipResponse(resp);
        })
        .catch((err) => {
          console.log(err);
          alertToast({
            message: err?.response?.data?.message,
          });
        });
    }, 500);

    return () => {
      clearTimeout(ajaxRequest);
    };
  }, [selectedBets]);

  const getUserData = () => {
    apiServices.get(apiUrl.USER).then((response) => {
      dispatch(setLoggedUser({ ...loggedUser, user_data: response }));
    });
  };

  useEffect(() => {
    if (!betTicker?.status) return;
    let tmp = { ...selectedBets };
    tmp.action = "place";
    tmp.bet_referral_id = betTicker?.bet_referral_id;
    placeBetRequest(tmp);
  }, [betTicker]);

  const placeBetsHandler = () => {
    if (selectedBets?.bets?.length == 0) return;
    setPlaceBetIsLoading(true);
    let tmp = { ...selectedBets };
    tmp.action = "place";
    placeBetRequest(tmp);
  };

  const placeBetRequest = (tmp) => {
    apiServices
      .post(urlGenerateBetSlips, tmp)
      .then((data) => {
        setPlaceBetIsLoading(false);
        console.log(data);
        if (data.status == "success") {
          if (data.data.mode == "pending") {
            alertToast({
              message: data.message,
            });
          } else if (data.data.mode == "rejected") {
            alertToast({
              message: data.message,
            });
          } else if (data.data.mode == "accepted") {
            setBetSlipResponse(emptyBetSlip);
            dispatch(removeBet("all"));
            dispatch(removeBetAmount("all"));
            getUserData();
            dispatch(
              setBetTicker({
                status: "",
                bet_referral_id: "",
              })
            );
          }
        } else {
          alertToast({
            message: data.message,
          });
        }
      })
      .catch((err) => {
        alertToast({
          message: err?.response?.data?.message,
        });
        setPlaceBetIsLoading(false);
      });
  };

  return (
    <div className={"bet-slip-container"}>
      <div className="slip-bets-title slips-bets-title-container">
        {selectedBets?.length > 0 ? (
          <span className="numberOfBetsStyle">{selectedBets?.length}</span>
        ) : (
          ""
        )}
        <span
          className={
            selectedBets?.length < 1 && isTablet
              ? "betsStyle betStyleEmpty"
              : "betsStyle "
          }
        >
          Bets
        </span>
        {isTablet && (
          <span
            className="betsClose"
            onClick={() => {
              if (document.querySelector(".bet-slip-container")) {
                let actualDisplay = document.querySelector(
                  ".bet-slip-container"
                ).style.display;
                if (actualDisplay === "block") {
                  document.querySelector(".bet-slip-container").style.display =
                    "none";
                } else {
                  document.querySelector(".bet-slip-container").style.display =
                    "block";
                }
              }
            }}
          >
            <CloseIcon />
          </span>
        )}
      </div>
      <div className="slip-bets-title">
        <button
          className={classNames("bet-slip-description", { active: !myBets })}
          onClick={() => handleClickBets("betslip")}
        >
          <span
            className={classNames({
              betStyleEmpty: selectedBets?.length < 1 && isTablet,
            })}
          >
            BETSLIP
          </span>
        </button>
        <button
          className={classNames("bet-slip-description", { active: myBets })}
          onClick={() => handleClickBets("mybets")}
        >
          MY BETS
        </button>
      </div>
      {!myBets ? (
        selectedBets?.bets?.length > 0 ? (
          <>
            <div
              className="remove-all-bets"
              onClick={() => {
                dispatch(
                  setBetTicker({
                    status: "",
                    bet_referral_id: "",
                  })
                );
                setBetSlipResponse({ ...emptyBetSlip });
                dispatch(removeBet("all"));
                dispatch(removeBetAmount("all"));
              }}
            >
              <XIcon marginTop={2} />
              <span className="remove-text">Remove all bets</span>
            </div>
            <div className="selected-bets">
              {betTicker.status == "rejected" && (
                <div style={{ backgroundColor: "red" }}>
                  Bet Slip was rejected
                </div>
              )}
              {betTicker.status == "approved" && (
                <div style={{ backgroundColor: "green" }}>
                  Bet Slip was Approved
                </div>
              )}
              {/* Generate Singles  */}
              {betSlipResponse?.singles &&
                betSlipResponse?.singles?.map((row) => {
                  return <SelectedBet row={row} key={row.bet_id} />;
                })}
              {/* Generate Multiples  */}
              {betSlipResponse?.combinations.map((row) => {
                return <SelectOfMultipleBets row={row} key={row.bet_id} />;
              })}
              <div className="showOrHideMultiples" onClick={handleClick}></div>
            </div>
            <div className="totals-container">
              {/* Total Stakes */}
              <span>Total stakes: </span>
              <span style={{ color: "#FDC500" }}>
                {betSlipResponse?.total_stakes
                  ? Number(betSlipResponse?.total_stakes).toFixed(2)
                  : "0.00"}
              </span>
            </div>
            <div className="totals-container">
              {/* Total Returns */}
              <span>Total returns:</span>
              <span>
                {betSlipResponse?.total_payout
                  ? Number(betSlipResponse?.total_payout).toFixed(2)
                  : "0.00"}
              </span>
            </div>
            {!loggedUser?.user_data ? (
              <div className="place-bet-container">
                <Link href="/login">
                  <Button
                    className={"btnPrimary place-bet-button"}
                    text={"LOG IN TO PLACE BET"}
                  />
                </Link>
              </div>
            ) : (
              <div className="place-bet-container">
                <Button
                  className={"btnPrimary place-bet-button"}
                  text={
                    placeBetIsLoading ? (
                      <Loader />
                    ) : (
                      "PLACE " +
                      betSlipResponse?.total_stakes.toFixed(2) +
                      " EUR"
                    )
                  }
                  onClick={placeBetsHandler}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="empty-slip">
              <span className="empty-slip-text mb">
                Your bet slip is empty!
              </span>
              <EmptyFolder />
              <span className="empty-slip-text mt">
                Make some selections and they will show up here
              </span>
            </div>
            {!isTablet && <BetSlipAds sidebarRightData={data} />}
          </>
        )
      ) : (
        <>
          <div className="my-bets-container">
            {myBetsArray?.map((buttonValue, index) => {
              const buttonNumber = index + 1;
              return (
                <button
                  key={buttonNumber}
                  onClick={() => handleButtonClick(buttonNumber)}
                  className={
                    selectedButton === buttonNumber
                      ? "buttons-of-bets selected-myBets"
                      : "buttons-of-bets"
                  }
                >
                  {buttonValue}
                </button>
              );
            })}
          </div>
          <div className="empty-slip">
            <span className="empty-slip-text mb">Your bet slip is empty!</span>
            <EmptyFolder />
            <span className="empty-slip-text mt">
              Make some selections and they will show up here
            </span>
          </div>
        </>
      )}
    </div>
  );
};
