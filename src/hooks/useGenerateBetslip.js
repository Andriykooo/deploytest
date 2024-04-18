import {
  mergeSelectedBets,
  setBetIsAccepted,
  setBetIsRejected,
  setSelectBet,
} from "@/store/actions";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "./useDebounce";

export const useGenerateBetslip = () => {
  const dispatch = useDispatch();
  const betIsAccepted = useSelector((state) => state.betIsAccepted);
  const betIsRejected = useSelector((state) => state.betIsRejected);
  const freeBetCreditSelect = useSelector((state) => state.freeBetCreditSelect);

  const delay = useRef(300);

  const [betslipPayload, setBetslipPayload] = useState();

  const debouncedPayload = useDebounce(betslipPayload, delay.current);

  const fetchBetslip = (payload) => {
    apiServices.post(apiUrl.GET_BET_SLIP, payload).then((response) => {
      const formatedResponse = { ...response };
      const unnamed_favorites = {};

      formatedResponse.combinations = formatedResponse.combinations.filter(
        (combination) => {
          const isUnnamedFavorite = combination?.type === "unnamed_favorite";

          if (isUnnamedFavorite) {
            delete combination.stake;

            unnamed_favorites[combination?.event_id] = {
              ...combination,
              bet_id: combination?.event_id,
              odds_decimal: 0,
            };
          }

          return !isUnnamedFavorite;
        }
      );

      dispatch(mergeSelectedBets(formatedResponse));
    });
  };

  useEffect(() => {
    if (debouncedPayload) {
      fetchBetslip(debouncedPayload);
    }
  }, [debouncedPayload]);

  return (selectedBets, debounce) => {
    dispatch(setSelectBet(selectedBets));

    let racingBetsCounter = 0;

    const bets = [];
    const unnamed_favorite = [];

    if (betIsRejected) {
      dispatch(setBetIsRejected(false));
    }

    selectedBets?.singles?.forEach((selected_row) => {
      if (selected_row?.place) {
        racingBetsCounter++;
      }

      // eslint-disable-next-line
      const { place, trading_status, ...bet } = selected_row;

      if (selected_row?.trading_status?.toLowerCase() === "open") {
        const newBet = {
          stake: bet.stake,
          bet_id: bet.bet_id,
        };

        if (bet.starting_price) {
          newBet.starting_price = bet.starting_price;
        }

        if (bet.allow_each_way) {
          newBet.each_way = bet.each_way;
        }

        if (bet.event_id) {
          newBet.event_id = bet.event_id;
        }

        bets.push(newBet);

        if (betIsAccepted) {
          dispatch(setBetIsAccepted(false));
        }
      }

      if (selected_row?.trading_status?.toLowerCase() === "unnamed_favorite") {
        const { bet_id, ...unnamedFavoriteBet } = bet;

        unnamed_favorite.push({ event_id: bet_id, ...unnamedFavoriteBet });
      }
    });

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

    if (
      (freeBetCreditSelect?.id || selectedBets?.free_bet_id) &&
      selectedBets?.use_free_bet !== null
    ) {
      const free_bet_id = selectedBets?.free_bet_id || freeBetCreditSelect?.id;
      payload.use_free_bet = 1;
      payload.free_bet_id = free_bet_id;
    }

    if (unnamed_favorite.length > 0) {
      payload.unnamed_favorite = unnamed_favorite;
    }

    if (debounce) {
      setBetslipPayload(payload);
      delay.current = debounce;
    } else {
      fetchBetslip(payload);
    }
  };
};
