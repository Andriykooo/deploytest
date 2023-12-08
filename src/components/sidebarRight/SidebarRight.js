"use client";

import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBet,
  removeBetAmount,
  removeReturnValue,
  setBetSlipResponse,
  setBetTicker,
  setLoggedUser,
  setNewOfferTimer,
  setPriceIsChanged,
  setReviewBets,
  setSelectBet,
  setSidebarRight,
  setUpdatedBetslipSelections,
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
import { MyBets } from "./MyBets";
import { getUserApi } from "@/utils/apiQueries";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import { useTranslations } from "next-intl";
import { BetslipDropdown } from "./BetslipDropdown/BetslipDropdown";
import { CustomLink } from "../Link/Link";
import { useClientPathname } from "@/hooks/useClientPathname";
import { gamingSocket } from "@/context/socket";
import "./SidebarRight.css";

const emptyBetSlip = {
  singles: [],
  combinations: [],
  total_stakes: 0,
  total_payout: 0,
};

export const SidebarRight = ({ pageLayoutActiveStatus }) => {
  const t = useTranslations("common");
  const dispatch = useDispatch();
  const { pathname } = useClientPathname();

  const sidebarRight = useSelector((state) => state.sidebarRight);
  const isTablet = useSelector((state) => state.isTablet);
  const loggedUser = useSelector((state) => state.loggedUser);
  const selectedBets = useSelector((state) => state.selectedBets);
  const reviewBets = useSelector((state) => state.reviewBets);
  const betTicker = useSelector((state) => state.betTicker);
  const settings = useSelector((state) => state.settings);
  const betSlipResponse = useSelector((state) => state.betslipResponse);
  const timer = useSelector((state) => state.newOfferTimer);
  const updatedBetslipSelections = useSelector(
    (state) => state.updatedBetslipSelections
  );

  const [myBets, setMyBets] = useState(false);
  const [placeBetIsLoading, setPlaceBetIsLoading] = useState(false);
  const [betIsAcceped, setBetIsAccepted] = useState(false);
  const [betIsRejected, setBetIsRejected] = useState(false);
  const [scrollToBet, setScrollToBet] = useState();

  const urlGenerateBetSlips = apiUrl.GET_BET_SLIP;
  const suspendedSelection =
    Object.values(updatedBetslipSelections).some(
      (bet) => bet.trading_status?.toLowerCase() === "suspended"
    ) ||
    betSlipResponse?.singles?.some(
      (bet) => bet.trading_status?.toLowerCase() === "suspended"
    );

  const insufficientBalance =
    loggedUser?.user_data?.balance === 0 ||
    loggedUser?.user_data?.balance < betSlipResponse?.total_stakes;
  const balanceInequality =
    loggedUser?.user_data?.balance && betSlipResponse?.total_stakes
      ? betSlipResponse?.total_stakes - loggedUser?.user_data?.balance
      : 0;

  const priceChanged = useSelector((state) => state.priceIsChanged);

  const showTimer =
    betTicker.status === "new_offer" &&
    betTicker?.bet_slip?.expire_seconds &&
    timer > 0;

  const showTrederReview =
    reviewBets?.singles?.length > 0 &&
    (betTicker?.status === "new_offer" ||
      betTicker?.status === "pending" ||
      betTicker?.data?.mode === "pending");

  const hideBetSlip = () => {
    dispatch(setSidebarRight({ isActive: false }));
  };

  const handleClickBets = (type) => {
    if (type === "betslip") {
      setMyBets(false);
    } else {
      setMyBets(true);
    }
  };

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
        if (status === "approved") {
          setBetIsAccepted(true);

          apiServices.post(urlGenerateBetSlips, {
            bets: [],
            stakes: [],
            action: "place",
            bet_referral_id: betTicker?.bet_referral_id,
          });
        }

        getUserData();
      })
      .finally(() => {
        dispatch(setReviewBets({ ...emptyBetSlip }));
        addLocalStorageItem("new_offer", betTicker?.bet_referral_id);
      });
  };

  const placeBetsHandler = () => {
    if (selectedBets?.bets?.length == 0) return;

    const bets = [];
    const unnamed_favorite = [];

    selectedBets?.bets?.forEach((selected_row) => {
      // eslint-disable-next-line
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
            dispatch(setReviewBets(betSlipResponse));
            dispatch(setBetSlipResponse({ ...emptyBetSlip }));
            dispatch(
              setSelectBet({
                bets: [],
                stakes: [],
                action: "check",
              })
            );

            dispatch(setBetTicker(data));
          }

          if (data.data.mode === "accepted") {
            setBetIsAccepted(true);
          }

          if (data.data.mode === "rejected") {
            setBetIsRejected(true);
          }

          if (data.data.mode === "accepted") {
            dispatch(setBetSlipResponse(emptyBetSlip));
            dispatch(removeBet("all"));
            dispatch(removeBetAmount("all"));
            getUserData();
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

  const renderBetButtons = () => {
    if (priceChanged) {
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
      betSlipResponse.total_stakes === 0
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
                settings?.default_currency
              }`
            }
          />
        </div>
      );
    }

    if (insufficientBalance) {
      return (
        <div className="place-bet-container">
          <CustomLink href="/profile/deposit">
            <Button
              className={"btnPrimary place-bet-button"}
              text={t("please_deposit")}
            />
          </CustomLink>
        </div>
      );
    }

    if (
      betSlipResponse?.singles?.length > 0 &&
      betSlipResponse.total_stakes > 0
    ) {
      return (
        <div className="place-bet-container">
          <Button
            disabled={
              betSlipResponse?.message?.length > 0 &&
              (showTrederReview || !loggedUser?.user_data?.bet_referral_enabled)
            }
            className={"btnPrimary activeBetButton place-bet-button"}
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
                  settings?.default_currency
                }`
              )
            }
            onClick={placeBetsHandler}
          />
        </div>
      );
    }
  };

  const stakesAndReturns = (data) => (
    <>
      {selectedBets.bets.length > 0 && (
        <>
          <div className="totals-container">
            {/* Total Stakes */}
            <span>{t("total_stakes")}: </span>
            <span className="stakes amount">
              {formatNumberWithDecimal(
                data?.new_total_stakes || data?.total_stakes || 0
              )}
            </span>
          </div>
          <div className="totals-container">
            {/* Total Returns */}
            <span>{t("total_returns")}:</span>
            <span className="amount">
              {data.total_payout == "?"
                ? "[?]"
                : formatNumberWithDecimal(
                    data?.new_total_payout || data?.total_payout || 0
                  )}
            </span>
          </div>
        </>
      )}
    </>
  );

  const isElementInViewport = (element) => {
    var rect = element.getBoundingClientRect();

    // Check if the element is completely in the viewport
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  useEffect(() => {
    dispatch(removeBetAmount("all"));
    dispatch(removeReturnValue("all"));

    if (loggedUser?.user_data && getLocalStorageItem("access_token")) {
      apiServices.get(apiUrl.BET_TICKER_LIST).then((response) => {
        const offer = response?.find((bet) => {
          return (
            (bet.status === "new_offer" || bet.status === "pending") &&
            loggedUser?.user_data?.player_id === bet.player_id
          );
        });

        if (offer) {
          dispatch(setReviewBets(offer.bet_slip_json));

          if (offer?.bet_slip_json?.expire_seconds) {
            dispatch(setNewOfferTimer(offer.bet_slip_json.expire_seconds));
          }

          dispatch(
            setBetTicker({
              ...offer,
              bet_slip: offer.bet_slip_json,
              bet_referral_id: offer.bet_ticker_id,
            })
          );
        }
      });
    }

    if (selectedBets.bets.length > 0) {
      selectedBets.bets.forEach((bet) => {
        if (bet.bet_id) {
          gamingSocket.emit("subscribe_selection", {
            value: bet.bet_id,
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    setMyBets(false);

    // Stake
    let tmp = { ...betSlipResponse };
    let racingBetsCounter = 0;

    const bets = [];
    const unnamed_favorite = [];

    if (betIsRejected) {
      setBetIsRejected(false);
    }

    selectedBets?.bets?.forEach((selected_row) => {
      if (selected_row.place) {
        racingBetsCounter++;
      }

      tmp.singles.forEach((single_row) => {
        if (selected_row.bet_id === single_row.bet_id) {
          single_row.stake = selected_row.stake;
        }
      });

      // eslint-disable-next-line
      const { place, trading_status, ...bet } = selected_row;

      if (selected_row?.trading_status?.toLowerCase() === "open") {
        bets.push(bet);

        if (betIsAcceped) {
          setBetIsAccepted(false);
        }
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

        if (response.singles.length > betSlipResponse?.singles.length) {
          const lastBet = response.singles[response.singles.length - 1];
          setScrollToBet(`${lastBet.bet_provider}-${lastBet.bet_id}`);
        }

        dispatch(setBetSlipResponse(formatedResponse));
      })
      .catch((err) => {
        alertToast({
          message: err?.response?.data?.message,
        });
      });
  }, [selectedBets]);

  useEffect(() => {
    if (scrollToBet) {
      const newBetInput = document.getElementById(`input_stake_${scrollToBet}`);

      if (newBetInput && !isElementInViewport(newBetInput)) {
        newBetInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [scrollToBet]);

  useEffect(() => {
    let timeoutId;
    const isNewOffer =
      reviewBets.singles.length > 0 && betTicker?.status === "new_offer";

    if (timer > 0 && isNewOffer) {
      timeoutId = setTimeout(() => {
        dispatch(setNewOfferTimer(+timer - 1));
      }, 1000);
    }

    if (timer === 0 && isNewOffer) {
      alertToast({ message: t("trader_offer_expired"), autoClose: false });
      updateBetStatus("rejected");
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [timer]);

  useEffect(() => {
    if (betTicker?.status === "approved") {
      setBetIsAccepted(true);
    }
  }, [betTicker]);

  return (
    pageLayoutActiveStatus &&
    sidebarRight?.isActive && (
      <div className="bet-slip-container" onClick={hideBetSlip}>
        <div className="sidebar-right" onClick={(e) => e.stopPropagation()}>
          <div className="bet-slip-content">
            <div
              className={classNames(
                "slip-bets-title slips-bets-title-container"
              )}
            >
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
                <span className="betsClose" onClick={hideBetSlip}>
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
                    betStyleEmpty: selectedBets?.bets?.length < 1 && isTablet,
                  })}
                >
                  {t("betslip")}
                </span>
              </button>
              <button
                className={classNames("bet-slip-description", {
                  active: myBets,
                })}
                onClick={() => handleClickBets("mybets")}
              >
                {t("my_bets")}
              </button>
            </div>

            {!myBets ? (
              <>
                {showTrederReview && (
                  <BetslipDropdown
                    show={betSlipResponse?.singles?.length > 0}
                    active={betTicker?.status === "new_offer"}
                    name={`${t("betslip")} #1`}
                    status={
                      showTimer
                        ? `${t("accept_offer")} (${timer}s)`
                        : t("pending_trader_review")
                    }
                  >
                    <div className="selected-bets">
                      {showTimer && (
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
                      {reviewBets?.singles?.length > 0 &&
                        reviewBets?.singles?.map((row) => {
                          return (
                            <SelectedBet row={row} key={row.bet_id} disabled />
                          );
                        })}
                      {/* Generate Multiples  */}
                      {reviewBets?.combinations?.length > 0 &&
                        reviewBets?.combinations.map((row, index) => {
                          return (
                            <SelectOfMultipleBets
                              row={row}
                              key={index}
                              disabled
                            />
                          );
                        })}
                      {betTicker.status === "new_offer" ? (
                        stakesAndReturns(reviewBets)
                      ) : (
                        <Warning text="Your bet has been referred to a trader - please wait as we review it" />
                      )}

                      {betTicker?.status === "new_offer" && (
                        <div className="btnsGroup">
                          <Button
                            className={
                              "btnSecondary place-bet-button rounded-0"
                            }
                            text={placeBetIsLoading ? <Loader /> : t("reject")}
                            onClick={() => updateBetStatus("rejected")}
                          />
                          <Button
                            className={"btnPrimary place-bet-button rounded-0"}
                            text={placeBetIsLoading ? <Loader /> : t("accept")}
                            onClick={() => updateBetStatus("approved")}
                          />
                        </div>
                      )}

                      {(betTicker?.data?.mode === "pending" ||
                        betTicker?.status === "pending") && (
                        <div className="place-bet-container">
                          <Button
                            className={"btnPrimary place-bet-button"}
                            text={t("pending_trader_review")}
                            disabled
                          />
                        </div>
                      )}
                    </div>
                  </BetslipDropdown>
                )}
                <BetslipDropdown
                  show={
                    showTrederReview && betSlipResponse?.singles?.length !== 0
                  }
                  active={betTicker?.status !== "new_offer"}
                  name={`${t("betslip")} #2`}
                >
                  {(showTrederReview
                    ? showTrederReview && betSlipResponse?.singles?.length !== 0
                    : true) && (
                    <>
                      {betSlipResponse?.singles?.length > 0 ? (
                        <>
                          <div
                            className="remove-all-bets"
                            onClick={() => {
                              dispatch(setUpdatedBetslipSelections({}));
                              dispatch(setBetSlipResponse({ ...emptyBetSlip }));
                              dispatch(removeBet("all"));
                              dispatch(removeBetAmount("all"));
                            }}
                          >
                            <XIcon size="9" />
                            <span className="remove-text">
                              {t("remove_all_bets")}
                            </span>
                          </div>
                          <div className="selected-bets">
                            {/* Generate Singles  */}
                            {betSlipResponse?.singles?.length > 0 &&
                              betSlipResponse?.singles?.map((row) => {
                                return (
                                  <SelectedBet row={row} key={row.bet_id} />
                                );
                              })}
                            {/* Generate Multiples  */}
                            {betSlipResponse?.combinations?.length > 0 &&
                              betSlipResponse?.combinations.map(
                                (row, index) => {
                                  return (
                                    <SelectOfMultipleBets
                                      row={row}
                                      key={index}
                                    />
                                  );
                                }
                              )}
                          </div>
                        </>
                      ) : (
                        <>
                          {betIsAcceped ? (
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
                                onClick={() => {
                                  setBetIsAccepted(false);
                                  handleClickBets("mybets");
                                }}
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
                            <CustomLink href="/profile/deposit">
                              <span className="depositLink">
                                {t("click_here_to_deposit")}
                              </span>
                            </CustomLink>
                          </div>
                        )}
                        {stakesAndReturns(betSlipResponse)}
                        {(suspendedSelection || priceChanged) && (
                          <Warning
                            text={t("odds_availability_changed_message")}
                          />
                        )}
                        {reviewBets?.singles?.length > 0 &&
                          betSlipResponse?.message?.length > 0 && (
                            <Warning text={t("max_bets_under_review")} />
                          )}
                        {betIsRejected && (
                          <Warning text={t("your_bet_is_rejected")} />
                        )}
                        {betSlipResponse?.singles?.length > 0 &&
                          betSlipResponse?.message?.map((text, index) => (
                            <Warning text={text} key={index} />
                          ))}
                        {!loggedUser?.user_data ||
                        !getLocalStorageItem("access_token") ? (
                          <div className="place-bet-container">
                            <CustomLink href={`/login?redirect=${pathname}`}>
                              <Button
                                className={"btnPrimary place-bet-button"}
                                text={t("login_to_place_bet")}
                              />
                            </CustomLink>
                          </div>
                        ) : (
                          renderBetButtons()
                        )}
                      </div>
                    </>
                  )}
                </BetslipDropdown>
              </>
            ) : (
              <MyBets />
            )}
          </div>
          <BetSlipAds />
        </div>
      </div>
    )
  );
};
