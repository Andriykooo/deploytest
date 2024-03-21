"use client";

import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBet,
  removeBetAmount,
  setBetIsAccepted,
  setBetIsRejected,
  setBetTicker,
  setLoggedUser,
  setNewOfferTimer,
  setPriceIsChanged,
  setReviewBets,
  setSidebarRight,
  setUpdatedBetslipSelections,
  setFreeBetCreditSelect,
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
import { AllSingles } from "./AllSingles/AllSingles";
import { v4 as uuidv4 } from "uuid";
import { useGenerateBetslip } from "@/hooks/useGenerateBetslip";
import FreeBetModal from "./FreeBetModal";
import FreeCreditSelect from "./FreeCreditSelect";
import CombinationInfo from "@/components/modal/CombinationInfo";

import "./SidebarRight.css";
import { useAxiosData } from "@/hooks/useAxiosData";

const emptyBetSlip = {
  singles: [],
  combinations: [],
  total_stakes: 0,
  total_payout: 0,
};

export const SidebarRight = ({ alwaysDisplay }) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const { pathname } = useClientPathname();
  const generateBetslip = useGenerateBetslip();

  const sidebarRight = useSelector((state) => state.sidebarRight);
  const isTablet = useSelector((state) => state.isTablet);
  const isMobile = useSelector((state) => state.setMobile);
  const loggedUser = useSelector((state) => state.loggedUser);
  const selectedBets = useSelector((state) => state.selectedBets);
  const reviewBets = useSelector((state) => state.reviewBets);
  const betTicker = useSelector((state) => state.betTicker);
  const settings = useSelector((state) => state.settings);
  const timer = useSelector((state) => state.newOfferTimer);
  const betIsAccepted = useSelector((state) => state.betIsAccepted);
  const betIsRejected = useSelector((state) => state.betIsRejected);
  const freeBetCreditSelect = useSelector((state) => state.freeBetCreditSelect);
  const updatedBetslipSelections = useSelector(
    (state) => state.updatedBetslipSelections
  );

  const [showCombinationinfo, setShowCombinationInfo] = useState({});
  // const [freeBetCreditSelect, setFreeBetCreditSelect] = useState("");
  const [openFreeModal, setOpenFreeModal] = useState(false);
  const [placeFreeBetLoading, setPlaceFreeBetLoading] = useState(false);
  const [myBets, setMyBets] = useState(false);
  const [placeBetIsLoading, setPlaceBetIsLoading] = useState(false);
  const [scrollToBet, setScrollToBet] = useState();

  const balance = loggedUser?.user_data?.balance;
  const symbol = loggedUser?.user_data?.currency?.symbol;
  const urlGenerateBetSlips = apiUrl.GET_BET_SLIP;

  const suspendedSelection =
    Object.values(updatedBetslipSelections).some(
      (bet) => bet.trading_status?.toLowerCase() === "suspended"
    ) ||
    selectedBets.singles.some(
      (bet) => bet.trading_status?.toLowerCase() === "suspended"
    );

  const insufficientBalance =
    loggedUser?.user_data?.balance === 0 ||
    loggedUser?.user_data?.balance < selectedBets?.total_stakes;
  const balanceInequality =
    loggedUser?.user_data?.balance && selectedBets?.total_stakes
      ? selectedBets?.total_stakes - loggedUser?.user_data?.balance
      : 0;

  const priceChanged = useSelector((state) => state.priceIsChanged);

  const showTimer =
    betTicker.status === "new_offer" &&
    betTicker?.bet_slip?.expire_seconds &&
    timer > 0;

  const showTrederReview =
    reviewBets.singles.length > 0 &&
    (betTicker?.status === "new_offer" ||
      betTicker?.status === "pending" ||
      betTicker?.data?.mode === "pending");

  useAxiosData(() => generateBetslip({ ...selectedBets }), { enabled: false });

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
          dispatch(setBetIsAccepted(true));

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

  const placeBetsHandler = ({ freeBet }) => {
    if (selectedBets.singles.length == 0) return;

    const bets = [];
    const unnamed_favorite = [];

    selectedBets.singles.forEach((selected_row) => {
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

    const tmp = { ...selectedBets, bets: bets };

    if (unnamed_favorite.length > 0) {
      tmp.unnamed_favorite = unnamed_favorite;
    }

    if (freeBet) {
      tmp.use_free_bet = 1;
      tmp.free_bet_id = freeBetCreditSelect?.id;
      setPlaceFreeBetLoading(true);
    } else {
      setPlaceBetIsLoading(true);
    }

    tmp.action = "place";
    placeBetRequest(tmp);
  };

  const placeBetRequest = (tmp) => {
    apiServices
      .post(urlGenerateBetSlips, tmp)
      .then((data) => {
        setPlaceBetIsLoading(false);
        setPlaceFreeBetLoading(false);
        if (data.status == "success") {
          if (data.data.mode == "pending") {
            dispatch(setReviewBets(selectedBets));
            generateBetslip({
              singles: [],
              stakes: [],
              action: "check",
            });

            dispatch(setBetTicker(data));
          }

          if (data.data.mode === "accepted") {
            dispatch(setBetIsAccepted(true));
          }

          if (data.data.mode === "rejected") {
            dispatch(setBetIsRejected(true));
          }

          if (data.data.mode === "accepted") {
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
      .catch(() => {
        setPlaceBetIsLoading(false);
      });
  };

  const isNotStartingPrice = () => {
    const bets = [];
    selectedBets?.singles.forEach((row) => {
      if (updatedBetslipSelections[row.bet_id]) {
        bets.push(row);
      }
    });

    return bets?.some(({ starting_price }) => starting_price === false);
  };

  const renderBetButtons = () => {
    if (priceChanged && isNotStartingPrice()) {
      return (
        <div className="place-bet-container">
          <Button
            className={"btnAction"}
            text={t("common.accept_price_changes")}
            onClick={() => {
              generateBetslip({ ...selectedBets });
              dispatch(setPriceIsChanged(false));
            }}
          />
        </div>
      );
    }

    if (selectedBets.singles.length > 0 && selectedBets.total_stakes === 0) {
      return (
        <div className="place-bet-container btnsGroup">
          <Button
            className={"btnAction"}
            text={t("common.please_enter_stake")}
            disabled
          />

          {selectedBets?.free_bets?.length > 0 && (
            <Button
              className={"btnAction"}
              text={t("common.use_free_credits")}
              disabled
            />
          )}
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
              `${t("common.place_bet")} ` +
              Number(
                selectedBets?.new_total_stakes || selectedBets?.total_stakes
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
        <div className="place-bet-container btnsGroup">
          <CustomLink
            href="/settings/deposit"
            className="btnPrimary place-bet-button"
          >
            <Button
              className={"btnPrimary place-bet-button"}
              text={t("common.please_deposit")}
            />
          </CustomLink>

          {renderUseFreeCreditsButton()}
        </div>
      );
    }

    if (selectedBets.singles.length > 0 && selectedBets.total_stakes > 0) {
      return (
        <div className="place-bet-container btnsGroup">
          <Button
            disabled={
              (selectedBets?.message?.length > 0 &&
                (showTrederReview ||
                  !loggedUser?.user_data?.bet_referral_enabled)) ||
              freeBetCreditSelect?.id
            }
            className={"btnPrimary activeBetButton place-bet-button"}
            text={
              placeBetIsLoading && !placeFreeBetLoading ? (
                <Loader />
              ) : (
                `${t("common.place_bet")} ` +
                Number(
                  selectedBets?.new_total_stakes || selectedBets?.total_stakes
                ).toFixed(2) +
                ` ${
                  loggedUser?.user_data?.currency?.abbreviation ||
                  settings?.default_currency
                }`
              )
            }
            onClick={placeBetsHandler}
          />

          {renderUseFreeCreditsButton()}
        </div>
      );
    }
  };

  const renderUseFreeCreditsButton = () => {
    return (
      selectedBets?.free_bets?.length > 0 && (
        <Button
          className={"btnPrimary activeBetButton place-bet-button"}
          text={placeFreeBetLoading ? <Loader /> : t("common.use_free_credits")}
          disabled={
            selectedBets.total_stakes > +freeBetCreditSelect?.amount ||
            !freeBetCreditSelect?.id
          }
          onClick={() => placeBetsHandler({ freeBet: true })}
        />
      )
    );
  };

  const stakesAndReturns = (data) => (
    <>
      {selectedBets.singles.length > 0 && (
        <>
          <div className="totals-container">
            {/* Total Stakes */}
            <span>{t("common.total_stakes")}: </span>
            <span className="stakes amount">
              {formatNumberWithDecimal(
                data?.new_total_stakes || data?.total_stakes || 0
              )}
            </span>
          </div>
          <div className="totals-container">
            {/* Total Returns */}
            <span>{t("common.total_returns")}:</span>
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

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  useEffect(() => {
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

    if (selectedBets.singles.length > 0) {
      selectedBets.singles.forEach((bet) => {
        if (bet.bet_id) {
          gamingSocket.emit("subscribe_selection", {
            value: bet.bet_id,
          });
        }
      });

      gamingSocket.on("connection", () => {
        selectedBets.singles.forEach((bet) => {
          if (bet.bet_id) {
            gamingSocket.emit("subscribe_selection", {
              value: bet.bet_id,
            });
          }
        });
      });
    }

    return () => {
      selectedBets.singles.forEach((bet) => {
        if (bet.bet_id) {
          gamingSocket.emit("unsubscribe_selection", {
            value: bet.bet_id,
            action_id: uuidv4(),
          });
        }
      });
    };
  }, [loggedUser?.user_data?.player_id]);

  useEffect(() => {
    if (alwaysDisplay && window.document.documentElement.clientWidth > 1400) {
      dispatch(setSidebarRight({ isActive: true }));
    }
  }, [pathname]);

  useEffect(() => {
    const lastSelectionId =
      selectedBets.singles?.[selectedBets.singles.length - 1]?.bet_id;
    const lastSelectionElement = document.getElementById(
      `input_stake_${lastSelectionId}`
    );

    if (lastSelectionElement) {
      const rect = lastSelectionElement.getBoundingClientRect();

      const elementInViewPort =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      if (!elementInViewPort) {
        setScrollToBet(lastSelectionId);
      }
    }

    if (selectedBets?.singles?.length === 0) {
      dispatch(setFreeBetCreditSelect(""));
    }

    if (selectedBets?.free_bets?.length > 0) {
      const isSelectedFreeBetDisabled = selectedBets?.free_bets?.find(
        (item) => item?.id == freeBetCreditSelect?.id
      )?.disabled;

      if (isSelectedFreeBetDisabled) dispatch(setFreeBetCreditSelect(""));
    }
  }, [selectedBets]);

  useEffect(() => {
    if (scrollToBet && sidebarRight.isActive) {
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
      alertToast({
        message: t("common.trader_offer_expired"),
        autoClose: false,
      });
      updateBetStatus("rejected");
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [timer]);

  useEffect(() => {
    const toTop = document.getElementById(`bet-slip-content`);

    let goToTop = false;

    if (betTicker?.status === "new_offer") {
      goToTop = true;
    } else if (betTicker?.status === "approved") {
      dispatch(setBetIsAccepted(true));
      goToTop = true;
    } else if (betTicker?.status === "rejected") {
      dispatch(setBetIsRejected(true));
      goToTop = true;
    }

    if (toTop && !isElementInViewport(toTop) && goToTop) {
      toTop.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [betTicker]);

  const handleFreeBetSelect = (freeBet) => {
    dispatch(setFreeBetCreditSelect(freeBet));

    const tmp = { ...selectedBets };

    tmp.action = "check";

    if (freeBet?.id) {
      tmp.use_free_bet = 1;
      tmp.free_bet_id = freeBet?.id;
    } else {
      tmp.use_free_bet = null;
    }

    generateBetslip(tmp);
  };

  const renderFreebetCredits = () => {
    const freeBetAmount = freeBetCreditSelect?.amount;
    const isStakeHigher = selectedBets.total_stakes > +freeBetAmount;

    return (
      <>
        <div>
          {selectedBets?.free_bets?.map((item) => (
            <FreeCreditSelect
              key={item.id}
              id={item.id}
              freeBet={item}
              active={freeBetCreditSelect?.id == item.id}
              disabled={item?.disabled}
              onSelect={handleFreeBetSelect}
              symbol={symbol}
              onIconClick={() => setOpenFreeModal(true)}
            />
          ))}
        </div>

        {isStakeHigher && (
          <div className={`free-bet-warning stake-high`}>
            <div className="">
              <p className="free-bet-warning_message">
                {t("common.lower_stake_use_credits")}
              </p>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className={classNames("bet-slip-container", {
        active: sidebarRight?.isActive,
      })}
      // onClick={hideBetSlip}
    >
      <div className="sidebar-right" onClick={(e) => e.stopPropagation()}>
        <div id="bet-slip-content" className="bet-slip-content">
          <div className="slip-bets-title slips-bets-title-container">
            <span
              className={
                selectedBets.singles.length < 1 && !isTablet
                  ? "betsStyle betStyleEmpty"
                  : "betsStyle"
              }
            >
              {t("common.bets")}
            </span>
            {isTablet && (
              <span className="betsClose" onClick={hideBetSlip}>
                <CloseIcon />
              </span>
            )}
          </div>
          {isMobile &&
            loggedUser?.user_data &&
            getLocalStorageItem("access_token") && (
              <div className="slip-bets-balance">
                <span>{t("header.balance")}</span>
                <span className="balance">
                  {`${symbol} ${formatNumberWithDecimal(balance)}`}
                </span>
              </div>
            )}
          <div className="slip-bets-title">
            <button
              className={classNames("bet-slip-description", {
                active: !myBets,
              })}
              onClick={() => handleClickBets("betslip")}
            >
              <span
                className={classNames({
                  betStyleEmpty: selectedBets.singles.length < 1 && isTablet,
                })}
              >
                {t("common.betslip")}
              </span>
            </button>
            <button
              className={classNames("bet-slip-description", {
                active: myBets,
              })}
              onClick={() => handleClickBets("mybets")}
            >
              {t("common.my_bets")}
            </button>
          </div>

          {!myBets ? (
            <>
              {showTrederReview && (
                <BetslipDropdown
                  show={selectedBets?.singles?.length > 0}
                  active={betTicker?.status === "new_offer"}
                  name={`${t("common.betslip")} #1`}
                  status={
                    showTimer
                      ? `${t("common.accept_offer")} (${timer}s)`
                      : t("common.pending_trader_review")
                  }
                >
                  <div className="selected-bets">
                    {showTimer && (
                      <div className="offer-timer">
                        <div className="offer-icon">
                          <ClockIcon />
                        </div>
                        <span className="offer-message">
                          {t("common.new_trader_offer")} <br />
                          {t("common.offer_will_expire_in", { timer })}
                        </span>
                      </div>
                    )}
                    {/* Generate Singles  */}
                    {reviewBets?.singles?.length > 0 &&
                      reviewBets?.singles?.map((row) => {
                        return (
                          <SelectedBet bet={row} key={row.bet_id} disabled />
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
                            showCombinationinfo={showCombinationinfo}
                            setShowCombinationInfo={setShowCombinationInfo}
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
                          className={"btnSecondary place-bet-button reject"}
                          text={
                            placeBetIsLoading ? <Loader /> : t("common.reject")
                          }
                          onClick={() => updateBetStatus("rejected")}
                        />
                        <Button
                          className={"btnPrimary place-bet-button"}
                          text={
                            placeBetIsLoading ? <Loader /> : t("common.accept")
                          }
                          onClick={() => updateBetStatus("approved")}
                        />
                      </div>
                    )}
                    {(betTicker?.data?.mode === "rejected" ||
                      betTicker?.data?.mode === "pending" ||
                      betTicker?.status === "pending") && (
                      <div className="place-bet-container">
                        <Button
                          className={"btnPrimary place-bet-button"}
                          text={t("common.pending_trader_review")}
                          disabled
                        />
                      </div>
                    )}
                  </div>
                </BetslipDropdown>
              )}
              <BetslipDropdown
                show={showTrederReview && selectedBets?.singles?.length !== 0}
                active={betTicker?.status !== "new_offer"}
                name={`${t("common.betslip")} #2`}
              >
                {(showTrederReview
                  ? showTrederReview && selectedBets?.singles?.length !== 0
                  : true) && (
                  <>
                    {selectedBets?.singles?.length > 0 ? (
                      <>
                        <div
                          className="remove-all-bets"
                          onClick={() => {
                            dispatch(setUpdatedBetslipSelections({}));
                            dispatch(removeBet("all"));
                            dispatch(removeBetAmount("all"));

                            if (
                              window.document.documentElement.clientWidth < 1400
                            ) {
                              dispatch(setSidebarRight({ isActive: false }));
                            }
                          }}
                        >
                          <XIcon size="9" />
                          <span className="remove-text">
                            {t("common.remove_all_bets")}
                          </span>
                        </div>
                        <div className="selected-bets">
                          {/* Generate Singles  */}
                          {selectedBets?.singles?.length > 0 &&
                            selectedBets?.singles?.map((bet) => {
                              return <SelectedBet bet={bet} key={bet.bet_id} />;
                            })}
                          {selectedBets?.singles?.length > 1 && <AllSingles />}
                          {/* Generate Multiples  */}
                          {selectedBets?.singles?.length > 1 &&
                            selectedBets?.combinations?.length > 0 &&
                            selectedBets?.combinations.map((row, index) => {
                              return (
                                <SelectOfMultipleBets
                                  row={row}
                                  key={index}
                                  showCombinationinfo={showCombinationinfo}
                                  setShowCombinationInfo={
                                    setShowCombinationInfo
                                  }
                                />
                              );
                            })}
                        </div>
                      </>
                    ) : (
                      <>
                        {betIsAccepted ? (
                          <>
                            <div className="empty-slip">
                              <span className="empty-slip-text mb">
                                {t("common.bet_receipt")}
                              </span>
                              <OkIcon />
                              <span className="empty-slip-text mt">
                                {t("common.bets_placed_success")}
                              </span>
                            </div>
                            <Button
                              onClick={() => {
                                dispatch(setBetIsAccepted(false));
                                handleClickBets("mybets");
                              }}
                              className={"btnPrimary place-bet-button"}
                              text={t("common.open_bets")}
                            />
                          </>
                        ) : (
                          <div className="empty-slip">
                            <span className="empty-slip-text mb">
                              {t("common.empty_bet_slip")}
                            </span>
                            <EmptyFolder />
                            <span className="empty-slip-text mt">
                              {t("common.selections_description")}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="totalsWrapper">
                      {!!balanceInequality && insufficientBalance && (
                        <div className="balanceNotification">
                          <span>
                            {t("common.insufficient_balance_message", {
                              balance: balanceInequality.toFixed(2),
                            })}
                          </span>
                          <CustomLink href="/settings/deposit">
                            <span className="depositLink">
                              {t("common.click_here_to_deposit")}
                            </span>
                          </CustomLink>
                        </div>
                      )}
                      {stakesAndReturns(selectedBets)}
                      {(suspendedSelection || priceChanged) && (
                        <Warning
                          text={t("common.odds_availability_changed_message")}
                        />
                      )}
                      {reviewBets?.singles?.length > 0 &&
                        selectedBets?.message?.length > 0 && (
                          <Warning text={t("common.max_bets_under_review")} />
                        )}
                      {betIsRejected && (
                        <Warning text={t("common.your_bet_is_rejected")} />
                      )}
                      {selectedBets?.message?.length > 0 &&
                        selectedBets?.message?.map((text, index) => (
                          <Warning text={text} key={index} />
                        ))}

                      {selectedBets?.singles?.length > 0 &&
                        selectedBets?.free_bets?.length > 0 &&
                        renderFreebetCredits()}

                      {!getLocalStorageItem("access_token") ? (
                        <div className="place-bet-container">
                          <CustomLink href="/login">
                            <Button
                              className={"btnPrimary place-bet-button"}
                              text={t("common.login_to_place_bet")}
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

      {openFreeModal && <FreeBetModal close={() => setOpenFreeModal(false)} />}
      {showCombinationinfo?.modalOpen && (
        <CombinationInfo
          name={showCombinationinfo?.name}
          type={showCombinationinfo?.type}
          setShowModal={() => setShowCombinationInfo({})}
        />
      )}
    </div>
  );
};
