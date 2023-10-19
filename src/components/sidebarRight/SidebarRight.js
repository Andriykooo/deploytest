"use client";

import classNames from "classnames";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBet,
  removeBetAmount,
  removeReturnValue,
  setBetTicker,
  setLoggedUser,
  setUpdatedBetslipSelections,
  setUpdatedSelections,
} from "../../store/actions";
import { alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import {
  ClockIcon,
  CloseIcon,
  EmptyFolder,
  OkIcon,
  XIcon,
} from "../../utils/icons";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import { Warning } from "../warning/Warning";
import { BetSlipAds } from "./BetSlipAds";
import { SelectOfMultipleBets } from "./SelectBetOfMultipleBets";
import { SelectedBet } from "./SelectedBet";
import { SocketContext } from "@/context/socket";
import { v4 as uuidv4 } from "uuid";
import { MyBets } from "./MyBets";
import { getUserApi } from "@/utils/apiQueries";

export const SidebarRight = () => {
  const dispatch = useDispatch();
  const isTablet = useSelector((state) => state.isTablet);
  const loggedUser = useSelector((state) => state.loggedUser);
  const selectedBets = useSelector((state) => state.selectedBets);
  const betTicker = useSelector((state) => state.betTicker);
  const settings = useSelector((state) => state.settings);
  const updatedBetslipSelections = useSelector(
    (state) => state.updatedBetslipSelections
  );
  const { gamingSocket } = useContext(SocketContext);
  const [myBets, setMyBets] = useState(false);
  const [placeBetIsLoading, setPlaceBetIsLoading] = useState(false);
  const [timer, setTimer] = useState(-1);
  const emptyBetSlip = {
    singles: [],
    combinations: [],
    total_stakes: 0,
    total_payout: 0,
  };
  const [betSlipResponse, setBetSlipResponse] = useState(emptyBetSlip);
  const handleClickBets = (type) => {
    if (type === "betslip") {
      setMyBets(false);
    } else setMyBets(true);
  };

  useEffect(() => {
    dispatch(removeBetAmount("all"));
    dispatch(removeReturnValue("all"));

    if (selectedBets.bets.length > 0) {
      selectedBets.bets.forEach((bet) => {
        gamingSocket.emit("subscribe_market", {
          value: bet.bet_id,
        });
      });

      gamingSocket.on("selection_updated", (response) => {
        dispatch(setUpdatedSelections(response));
      });
    }

    return () => {
      gamingSocket.off("selection_updated");

      if (selectedBets.bets.length > 0) {
        selectedBets.bets.forEach((bet) => {
          gamingSocket.emit("unsubscribe_market", {
            value: bet.bet_id,
            action_id: uuidv4(),
          });
        });
      }
    };
  }, []);

  const urlGenerateBetSlips = apiUrl.GET_BET_SLIP;

  useEffect(() => {
    if (selectedBets?.bets?.length === 0) {
      setBetSlipResponse({ ...emptyBetSlip });

      return;
    }
    setMyBets(false);
    // Stake
    let tmp = { ...betSlipResponse };
    let racingBetsCounter = 0;

    const bets = [];
    const unnamed_favorite = [];

    selectedBets?.bets?.forEach((selected_row) => {
      if (selected_row.place) {
        racingBetsCounter++;
      }

      tmp.singles.forEach((single_row) => {
        if (selected_row.bet_id === single_row.bet_id) {
          single_row.stake = selected_row.stake;
        }
      });
      const { place, trading_status, ...bet } = selected_row;

      if (selected_row.trading_status.toLowerCase() === "open") {
        bets.push(bet);
      }

      if (selected_row.trading_status === "unnamed_favorite") {
        const { bet_id, ...unnamedFavoriteBet } = bet;

        unnamed_favorite.push({ event_id: bet_id, ...unnamedFavoriteBet });
      }
    });

    tmp.action = "check";
    setBetSlipResponse(tmp);

    const payload = {
      stakes: selectedBets.stakes,
      bets,
      action: "check",
    };

    if (racingBetsCounter === 2) {
      payload.forecast = true;
    }

    if (racingBetsCounter === 3) {
      payload.tricast = true;
    }

    if (unnamed_favorite.length > 0) {
      payload.unnamed_favorite = unnamed_favorite;
    }

    apiServices
      .post(urlGenerateBetSlips, payload)
      .then((response) => {
        if (betSlipResponse.singles.length === 0) {
          dispatch(
            setBetTicker({
              status: "",
              bet_referral_id: "",
            })
          );
        }

        setBetSlipResponse(response);
      })
      .catch((err) => {
        alertToast({
          message: err?.response?.data?.message,
        });
      });
  }, [selectedBets, updatedBetslipSelections]);

  const getUserData = () => {
    getUserApi(dispatch).then((response) => {
      dispatch(setLoggedUser({ ...loggedUser, user_data: response }));
    });
  };

  const updateBetStatus = (status) => {
    apiServices
      .put(apiUrl.UPDATE_BET_STATUS, {
        bet_referral_id: betTicker?.bet_referral_id,
        newStatus: status,
      })
      .then(() => {
        getUserData();
        dispatch(
          setBetTicker({
            status,
            bet_referral_id: "",
          })
        );
      })
      .catch((err) => {
        alertToast({
          message: err?.response?.data?.message,
        });
      })
      .finally(() => {
        if (status === "accepted") {
          setBetSlipResponse(emptyBetSlip);
          dispatch(removeBet("all"));
          dispatch(removeBetAmount("all"));
        }
      });
  };
  useEffect(() => {
    if (!betTicker?.status) return;
    if (betTicker.status === "pending") return;
    if (betTicker.status === "approved") {
      setBetSlipResponse(emptyBetSlip);
      dispatch(removeBet("all"));
      dispatch(removeBetAmount("all"));
      getUserData();
    }
    let rejectInterval;

    if (betTicker.status === "new_offer" && betTicker.bet_slip) {
      setBetSlipResponse(betTicker.bet_slip);
      setTimer(betTicker.bet_slip.expireSeconds);
      rejectInterval = setInterval(() => {
        setTimer((prev) => {
          return prev - 1;
        });
      }, 1000);
    } else if (selectedBets.action !== "check") {
      let tmp = { ...selectedBets };
      tmp.action = "place";
      tmp.bet_referral_id = betTicker?.bet_referral_id;
      placeBetRequest(tmp);
    }
    return () => {
      clearInterval(rejectInterval);
    };
  }, [betTicker]);

  useEffect(() => {
    if (timer === 0) {
      updateBetStatus("rejected");
    }
  }, [timer]);

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
        if (data.status == "success") {
          if (data.data.mode == "pending") {
            dispatch(setBetTicker(data));
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
                status: "accepted",
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

  const insufficientBalance =
    loggedUser?.user_data?.balance === 0 ||
    loggedUser?.user_data?.balance < betSlipResponse?.total_stakes;
  const balanceInequality =
    loggedUser?.user_data?.balance && betSlipResponse?.total_stakes
      ? betSlipResponse?.total_stakes - loggedUser?.user_data?.balance
      : 0;

  const priseChanged = Object.values(updatedBetslipSelections).length > 0;

  const renderBetButtons = () => {
    if (betTicker?.status === "new_offer") {
      return (
        <div className="btnsGroup">
          <Button
            className={"btnPrimary place-bet-button rounded-0"}
            text={placeBetIsLoading ? <Loader /> : "ACCEPT"}
            onClick={() => updateBetStatus("accepted")}
          />
          <Button
            className={"btnSecondary place-bet-button rounded-0"}
            text={placeBetIsLoading ? <Loader /> : "REJECT"}
            onClick={() => updateBetStatus("rejected")}
          />
        </div>
      );
    }
    if (betTicker?.data?.mode === "pending") {
      return (
        <div className="place-bet-container">
          <Button
            className={"btnPrimary place-bet-button"}
            text="PENDING TRADER REVIEW"
            disabled
          />
        </div>
      );
    }

    if (
      betSlipResponse?.singles?.length > 0 &&
      betSlipResponse?.total_stakes === 0
    ) {
      return (
        <div className="place-bet-container">
          <Button
            className={"btnAction"}
            text="PLEASE ENTER A STAKE"
            disabled
          />
        </div>
      );
    }

    if (priseChanged) {
      return (
        <div className="place-bet-container">
          <Button
            className={"btnAction"}
            text="ACCEPT PRICE CHANGES"
            onClick={() => {
              dispatch(setUpdatedBetslipSelections({}));
            }}
          />
        </div>
      );
    }

    if (insufficientBalance) {
      return (
        <div className="place-bet-container">
          <Link href="/profile/deposit">
            <Button
              className={"btnPrimary place-bet-button"}
              text="PLEASE DEPOSIT"
            />
          </Link>
        </div>
      );
    }

    if (
      betSlipResponse?.singles?.length > 0 &&
      betSlipResponse?.total_stakes > 0
    ) {
      return (
        <div className="place-bet-container">
          <Button
            className={"btnPrimary place-bet-button"}
            text={
              placeBetIsLoading ? (
                <Loader />
              ) : (
                "PLACE " +
                Number(
                  betSlipResponse?.new_total_stakes ||
                    betSlipResponse?.total_stakes
                ).toFixed(2) +
                ` ${
                  loggedUser?.user_data?.currency?.abbreviation ||
                  settings?.defaultCurrency
                }`
              )
            }
            onClick={placeBetsHandler}
          />
        </div>
      );
    }
  };

  const stakesAndReturns = () => (
    <>
      <div className="totals-container">
        {/* Total Stakes */}
        <span>Total stakes: </span>
        <span style={{ color: "#FDC500" }}>
          {betSlipResponse?.new_total_stakes
            ? Number(betSlipResponse?.new_total_stakes).toFixed(2)
            : betSlipResponse?.total_stakes
              ? Number(betSlipResponse?.total_stakes).toFixed(2)
              : "0.00"}
        </span>
      </div>

      <div className="totals-container">
        {/* Total Returns */}
        <span>Total returns:</span>
        <span>
          {betSlipResponse?.new_total_payout
            ? Number(betSlipResponse?.new_total_payout).toFixed(2)
            : betSlipResponse?.total_payout
              ? Number(betSlipResponse?.total_payout).toFixed(2)
              : "0.00"}
        </span>
      </div>
    </>
  );

  return (
    <div className={"bet-slip-container"}>
      <div className="bet-slip-content">
        <div className="slip-bets-title slips-bets-title-container">
          <span
            className={
              selectedBets?.bets?.length < 1 && !isTablet
                ? "betsStyle betStyleEmpty"
                : "betsStyle"
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
                    document.querySelector(
                      ".bet-slip-container"
                    ).style.display = "none";
                  } else {
                    document.querySelector(
                      ".bet-slip-container"
                    ).style.display = "block";
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
          <>
            {selectedBets?.bets?.length > 0 &&
              betSlipResponse?.singles?.length > 0 ? (
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
                  {betTicker.status === "new_offer" &&
                    betTicker?.bet_slip.expireSeconds &&
                    timer > 0 &&
                    (
                      <div className="offer-timer">
                        <div className="offer-icon">
                          <ClockIcon />
                        </div>
                        <span className="offer-message">
                          New Trader Offer <br />
                          This offer will expire in {timer}s
                        </span>
                      </div>
                    )}
                  {/* Generate Singles  */}
                  {betSlipResponse?.singles?.length > 0 &&
                    betSlipResponse?.singles?.map((row) => {
                      return <SelectedBet row={row} key={row.bet_id} />;
                    })}
                  {/* Generate Multiples  */}
                  {betSlipResponse?.combinations?.length > 0 &&
                    betSlipResponse?.combinations.map((row, index) => {
                      return <SelectOfMultipleBets row={row} key={index} />;
                    })}
                </div>
              </>
            ) : (
              <>
                {betTicker.status === "accepted" ||
                  betTicker.status === "approved" ? (
                  <>
                    <div className="empty-slip">
                      <span className="empty-slip-text mb">BET RECEIPT</span>
                      <OkIcon />
                      <span className="empty-slip-text mt">
                        Your bets have been successfully placed
                      </span>
                    </div>
                    <Button
                      onClick={() => handleClickBets("mybets")}
                      className={"btnPrimary place-bet-button"}
                      text="OPEN BETS"
                    />
                  </>
                ) : (
                  <div className="empty-slip">
                    <span className="empty-slip-text mb">
                      Your bet slip is empty!
                    </span>
                    <EmptyFolder />
                    <span className="empty-slip-text mt">
                      Make some selections and they will show up here
                    </span>
                  </div>
                )}
              </>
            )}
            <div className="totalsWrapper">
              {!!balanceInequality && insufficientBalance && (
                <div className="balanceNotification">
                  <span>{`You need ${balanceInequality.toFixed(
                    2
                  )} more to place this bet`}</span>
                  <Link href="/profile/deposit">
                    <span className="depositLink">Click here to deposit</span>
                  </Link>
                </div>
              )}
              {stakesAndReturns()}
              {betTicker.status === "new_offer" && (
                <Warning text="The odds or availability of your selections have changed" />
              )}
              {betTicker.status === "rejected" && (
                <Warning text="Your bet has been rejected by the trader" />
              )}
              {priseChanged && (
                <Warning text="Selection prices have changed. Please review!" />
              )}
              {betTicker.status
                ? betTicker?.message?.map((text, index) => (
                  <Warning text={text} key={index} />
                ))
                : betSlipResponse?.message?.map((text, index) => (
                    <Warning text={text} key={index} />
                  ))}
              {/* {betSlipResponse?.singles?.length > 0 && ( */}
              <>
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
                  renderBetButtons()
                )}
              </>
              {/* )} */}
            </div>
          </>
        ) : (
          <MyBets />
        )}
      </div>
      <BetSlipAds />
    </div>
  );
};
