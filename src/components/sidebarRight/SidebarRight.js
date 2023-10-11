"use client";

import classNames from "classnames";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBet,
  removeBetAmount,
  removeReturnValue,
  setBetSlipResponse,
  setBetTicker,
  setLoggedUser,
  setPriceIsChanged,
  setSelectBet,
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
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { getLocalStorageItem } from "@/utils/localStorage";
import { useClientTranslation } from "@/app/i18n/client";

export const SidebarRight = () => {
  const { t } = useClientTranslation("common");
  const dispatch = useDispatch();
  const isTablet = useSelector((state) => state.isTablet);
  const loggedUser = useSelector((state) => state.loggedUser);
  const selectedBets = useSelector((state) => state.selectedBets);
  const betTicker = useSelector((state) => state.betTicker);
  const settings = useSelector((state) => state.settings);
  const betSlipResponse = useSelector((state) => state.betslipResponse);
  const isVerifyMessage = useSelector((state) => state.isVerifyMessage);

  const updatedBetslipSelections = useSelector(
    (state) => state.updatedBetslipSelections
  );
  const { gamingSocket } = useContext(SocketContext);
  const [myBets, setMyBets] = useState(false);
  const [placeBetIsLoading, setPlaceBetIsLoading] = useState(false);
  const [timer, setTimer] = useState(-1);
  const [compireBets, setCompireBets] = useState(false);
  const [isPendingReview, setIsPendingReview] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const emptyBetSlip = {
    singles: [],
    combinations: [],
    total_stakes: 0,
    total_payout: 0,
  };

  const suspendedSelection =
    Object.values(updatedBetslipSelections).some(
      (bet) => bet.trading_status?.toLowerCase() === "suspended"
    ) ||
    betSlipResponse?.singles?.some(
      (bet) => bet.trading_status?.toLowerCase() === "suspended"
    );
  const betSlipContainerRef = useRef(null);

  const hideBetSlip = () => {
    if (betSlipContainerRef.current) {
      betSlipContainerRef.current.style.display = "none";
    }
  };

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
    }

    return () => {
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

      if (selected_row?.trading_status?.toLowerCase() === "suspended") {
        bets.push(bet);
      }

      if (selected_row?.trading_status?.toLowerCase() === "open") {
        bets.push(bet);
      }

      if (selected_row?.trading_status?.toLowerCase() === "unnamed_favorite") {
        const { bet_id, ...unnamedFavoriteBet } = bet;

        unnamed_favorite.push({ event_id: bet_id, ...unnamedFavoriteBet });
      }
    });

    tmp.action = "check";
    dispatch(setBetSlipResponse(tmp));

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
        const formatedResponse = { ...response };
        const unnamed_favorites = [];

        formatedResponse.combinations = formatedResponse.combinations.filter(
          (combination) => {
            const isUnnamedFavorite = combination.type === "unnamed_favorite";

            if (isUnnamedFavorite) {
              unnamed_favorites.push({
                ...combination,
                bet_id: combination.event_id,
                odds_decimal: 0,
              });
            }

            return !isUnnamedFavorite;
          }
        );

        formatedResponse.singles = [
          ...formatedResponse.singles,
          ...unnamed_favorites,
        ];

        if (
          selectedBets.bets.length !== formatedResponse.singles.length &&
          !compireBets
        ) {
          setCompireBets(true);
          dispatch(
            setSelectBet({
              ...selectedBets,
              bets: selectedBets.bets.filter((bet) =>
                formatedResponse.singles.some(
                  (single) =>
                    `${single.bet_provider}-${single.bet_id}` === bet.bet_id
                )
              ),
            })
          );
        } else {
          setCompireBets(false);
        }

        if (isPendingReview) {
          setIsPendingReview(false);
        }

        if (betTicker.status !== "rejected") {
          setIsRejected(false);
        }

        dispatch(setBetSlipResponse(formatedResponse));
      })
      .catch((err) => {
        alertToast({
          message: err?.response?.data?.message,
        });
        dispatch(
          setSelectBet({
            ...selectedBets,
            bets: selectedBets.bets.filter((bet) =>
              betSlipResponse.singles.some(
                (single) =>
                  `${single.bet_provider}-${single.bet_id}` === bet.bet_id
              )
            ),
          })
        );
      });
  }, [selectedBets]);

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

        if (status === "rejected") {
          setIsRejected(true);
        }

        if (status === "accepted") {
          dispatch(setBetSlipResponse(emptyBetSlip));
          dispatch(removeBet("all"));
          dispatch(removeBetAmount("all"));
        }
      })
      .catch((err) => {
        alertToast({
          message: err?.response?.data?.message,
        });
      });
  };

  useEffect(() => {
    if (betTicker.status === "pending" || !betTicker?.status) {
      return;
    }

    if (betTicker.status === "approved") {
      dispatch(setBetSlipResponse(emptyBetSlip));
      dispatch(removeBet("all"));
      dispatch(removeBetAmount("all"));
      getUserData();
    }

    let rejectInterval;

    if (betTicker.status === "new_offer" && betTicker.bet_slip) {
      dispatch(setBetSlipResponse(betTicker.bet_slip));

      dispatch(
        setSelectBet({
          bets: betTicker.bet_slip.singles.map((single) => {
            return {
              bet_id: `${single.bet_provider}-${single.bet_id}`,
              stake: single.new_stake,
              trading_status: "open",
            };
          }),
          stakes: betTicker.bet_slip.combinations.map((combination) => {
            return {
              combination: combination.type,
              stake: combination.new_stake,
            };
          }),
          action: "check",
        })
      );

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

    const bets = [];
    const unnamed_favorite = [];

    selectedBets?.bets?.forEach((selected_row) => {
      const { place, trading_status, ...bet } = selected_row;

      if (selected_row?.trading_status?.toLowerCase() === "open") {
        bets.push(bet);
      }

      if (selected_row?.trading_status?.toLowerCase() === "unnamed_favorite") {
        const { bet_id, ...unnamedFavoriteBet } = bet;

        unnamed_favorite.push({ event_id: bet_id, ...unnamedFavoriteBet });
      }
    });

    setPlaceBetIsLoading(true);

    const tmp = { ...selectedBets, bets: bets };

    if (unnamed_favorite.length > 0) {
      tmp.unnamed_favorite = unnamed_favorite;
    }

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
            setIsPendingReview(true);
            dispatch(setBetTicker(data));
          } else if (data.data.mode == "rejected") {
            dispatch(
              setBetTicker({
                status: "rejected",
                bet_referral_id: "",
              })
            );
          } else if (data.data.mode == "accepted") {
            dispatch(setBetSlipResponse(emptyBetSlip));
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
      .catch((error) => {
        if (error?.response?.data?.message) {
          alertToast({
            message: error?.response?.data?.message,
          });
        }
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

  const priseChanged = useSelector((state) => state.priceIsChanged);

  const renderBetButtons = () => {
    if (betTicker?.status === "new_offer") {
      return (
        <div className="btnsGroup">
          <Button
            className={"btnSecondary place-bet-button rounded-0"}
            text={placeBetIsLoading ? <Loader /> : t("reject")}
            onClick={() => updateBetStatus("rejected")}
          />
          <Button
            className={"btnPrimary place-bet-button rounded-0"}
            text={placeBetIsLoading ? <Loader /> : t("accept")}
            onClick={() => updateBetStatus("accepted")}
          />
        </div>
      );
    }
    if (betTicker?.data?.mode === "pending" && isPendingReview) {
      return (
        <div className="place-bet-container">
          <Button
            className={"btnPrimary place-bet-button"}
            text={t("pending_trader_review")}
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
            text={t("accept_price_changes")}
            onClick={() => {
              dispatch(setPriceIsChanged(false));
            }}
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
            text={t("please_enter_stake")}
            disabled
          />
        </div>
      );
    }

    if (suspendedSelection) {
      return (
        <div className="place-bet-container">
          <Button
            disabled
            className={"btnPrimary place-bet-button"}
            text={
              `${t("place_bet")} ` +
              Number(
                betSlipResponse?.new_total_stakes ||
                  betSlipResponse?.total_stakes
              ).toFixed(2) +
              ` ${
                loggedUser?.user_data?.currency?.abbreviation ||
                settings?.defaultCurrency
              }`
            }
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
              text={t("please_deposit")}
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
                `${t("place_bet")} ` +
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
        <span>{t("total_stakes")}: </span>
        <span className="stakes amount">
          {formatNumberWithDecimal(
            betSlipResponse?.new_total_stakes ||
              betSlipResponse?.total_stakes ||
              0
          )}
        </span>
      </div>

      <div className="totals-container">
        {/* Total Returns */}
        <span>{t("total_returns")}:</span>
        <span className="amount">
          {betSlipResponse.total_payout == "?"
            ? "[?]"
            : formatNumberWithDecimal(
                betSlipResponse?.new_total_payout ||
                  betSlipResponse?.total_payout ||
                  0
              )}
        </span>
      </div>
    </>
  );

  return (
    <div
      className={classNames("bet-slip-container", {
        noVerified: isVerifyMessage,
      })}
      onClick={hideBetSlip}
      ref={betSlipContainerRef}
    >
      <div className="sidebar-right" onClick={(e) => e.stopPropagation()}>
        <div className="bet-slip-content">
          <div className="slip-bets-title slips-bets-title-container">
            <span
              className={
                selectedBets?.bets?.length < 1 && !isTablet
                  ? "betsStyle betStyleEmpty"
                  : "betsStyle"
              }
            >
              {t("bets")}
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
              className={classNames("bet-slip-description", {
                active: !myBets,
              })}
              onClick={() => handleClickBets("betslip")}
            >
              <span
                className={classNames({
                  betStyleEmpty: selectedBets?.length < 1 && isTablet,
                })}
              >
                {t("betslip")}
              </span>
            </button>
            <button
              className={classNames("bet-slip-description", { active: myBets })}
              onClick={() => handleClickBets("mybets")}
            >
              {t("my_bets")}
            </button>
          </div>
          {!myBets ? (
            <>
              {betSlipResponse?.singles?.length > 0 ? (
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

                      dispatch(setBetSlipResponse({ ...emptyBetSlip }));
                      dispatch(removeBet("all"));
                      dispatch(removeBetAmount("all"));
                    }}
                  >
                    <XIcon marginTop={2} />
                    <span className="remove-text">{t("remove_all_bets")}</span>
                  </div>
                  <div className="selected-bets">
                    {/* {betTicker.status === "approved" && (
                      <div className="approvedBetslip">
                        <Image
                          alt="approved"
                          src={images.checkIcon}
                          height={20}
                          width={20}
                        />
                        {t("bet_slip_approved")}
                      </div>
                    )} */}
                    {betTicker.status === "new_offer" &&
                      betTicker?.bet_slip.expireSeconds &&
                      timer > 0 && (
                        <div className="offer-timer">
                          <div className="offer-icon">
                            <ClockIcon />
                          </div>
                          <span className="offer-message">
                            {t("new_trader_offer")} <br />
                            {t("offer_will_expire_in", { timer })}
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
                        <span className="empty-slip-text mb">
                          {t("bet_receipt")}
                        </span>
                        <OkIcon />
                        <span className="empty-slip-text mt">
                          {t("bets_placed_success")}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleClickBets("mybets")}
                        className={"btnPrimary place-bet-button"}
                        text={t("open_bets")}
                      />
                    </>
                  ) : (
                    <div className="empty-slip">
                      <span className="empty-slip-text mb">
                        {t("empty_bet_slip")}
                      </span>
                      <EmptyFolder />
                      <span className="empty-slip-text mt">
                        {t("selections_description")}
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="totalsWrapper">
                {!!balanceInequality && insufficientBalance && (
                  <div className="balanceNotification">
                    <span>
                      {t("insufficient_balance_message", {
                        balance: balanceInequality.toFixed(2),
                      })}
                    </span>
                    <Link href="/profile/deposit">
                      <span className="depositLink">
                        {t("click_here_to_deposit")}
                      </span>
                    </Link>
                  </div>
                )}
                {stakesAndReturns()}
                {(betTicker.status === "new_offer" ||
                  suspendedSelection ||
                  priseChanged) && (
                  <Warning text={t("odds_availability_changed_message")} />
                )}
                {isRejected && (
                  <Warning text={t("bet_user_rejected_message")} />
                )}
                {betTicker.status === "rejected" && !isRejected && (
                  <Warning text={t("bet_rejected_message")} />
                )}
                {betTicker.status &&
                  betSlipResponse?.singles?.length > 0 &&
                  betTicker?.message?.map((text, index) => (
                    <Warning text={text} key={index} />
                  ))}
                {!betTicker.status &&
                  betSlipResponse?.singles?.length > 0 &&
                  betSlipResponse?.message?.map((text, index) => (
                    <Warning text={text} key={index} />
                  ))}
                {!loggedUser?.user_data ||
                !getLocalStorageItem("access_token") ? (
                  <div className="place-bet-container">
                    <Link href="/login">
                      <Button
                        className={"btnPrimary place-bet-button"}
                        text={t("login_to_place_bet")}
                      />
                    </Link>
                  </div>
                ) : (
                  renderBetButtons()
                )}
              </div>
            </>
          ) : (
            <MyBets />
          )}
        </div>
        <BetSlipAds />
      </div>
    </div>
  );
};
