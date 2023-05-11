import { nextWindow } from "../utils/nextWindow";
import * as constants from "./actionTypes";

const initialState = {
  user: null,
  loggedUser: null,
  on_boarding: {},
  swifty_id: null,
  signup_platform: "",
  user_settings: null,
  sports: [],
  activeSport: null,
  competitionsData: [],
  setMobile: nextWindow?.document.documentElement.clientWidth <= 991,
  selectedBets: [],
  betAmounts: [],
  returnAmounts: [],
  activeSocketSubscribe: null,
  inPlay: false,
  sportsData: {
    sport_id: null,
    market_id: null,
    match_id: null,
    competition_id: null,
  },
  sidebarLeft: {
    data: null,
    isActive: false,
  },
  headerData: null,
};

const rootReducer = (appstate = initialState, action) => {
  let actualReturnAmounts = [...appstate.returnAmounts];
  let includeReturnAmount = actualReturnAmounts.some(
    (item) => item.bet_id === action.payload?.bet_id
  );

  switch (action.type) {
    case constants.SET_USER:
      return { ...appstate, user: action.payload };
    case constants.SET_DATA:
      return { ...appstate, data: action.payload };
    case constants.SET_COUNTRY_PHONE:
      return { ...appstate, countryPhone: action.payload };

    case constants.SET_MOBILE:
      return { ...appstate, setMobile: action.payload };

    case constants.SET_LOGGEDUSER:
      return { ...appstate, loggedUser: action.payload };
    case constants.SET_LOGOUT:
      return { ...appstate, loggedUser: action.payload };
    case constants.ON_BOARDING:
      return { ...appstate, on_boarding: action.payload };
    case constants.SWIFTY_ID:
      return { ...appstate, swifty_id: action.payload };
    case constants.SIGNUP_PLATFORM:
      return { ...appstate, signup_platform: action.payload };
    case constants.USER_SETTINGS:
      return { ...appstate, user_settings: action.payload };
    case constants.SPORT_TYPES:
      return { ...appstate, sports: action.payload };
    case constants.ACTIVE_SPORT:
      return { ...appstate, activeSport: action.payload };
    case constants.COMPETITIONS_DATA:
      return { ...appstate, competitionsData: action.payload };
    case constants.SELECT_BET:
      if (includeReturnAmount) {
        let filteredBets = appstate.selectedBets.filter(
          (row) => row.bet_id !== action.payload.bet_id
        );
        return { ...appstate, selectedBets: filteredBets };
      } else {
        return {
          ...appstate,
          selectedBets: [...appstate.selectedBets, action.payload],
        };
      }
    case constants.REMOVE_BET:
      if (action.payload === "all") {
        return { ...appstate, selectedBets: [] };
      } else {
        let filteredBets = appstate.selectedBets.filter(
          (row) => row.bet_id !== action.payload.bet_id
        );
        return { ...appstate, selectedBets: filteredBets };
      }
    case constants.SET_BET_AMOUNT:
      if (includeReturnAmount) {
        actualReturnAmounts = actualReturnAmounts.filter(
          (row) => row.bet_id !== action.payload?.bet_id
        );
        actualReturnAmounts.push(action.payload);
      } else {
        actualReturnAmounts.push(action.payload);
      }
      return {
        ...appstate,
        betAmounts: actualReturnAmounts,
      };
    case constants.REMOVE_BET_AMOUNT:
      if (action.payload === "all") {
        return { ...appstate, betAmounts: [] };
      } else {
        let filteredBetAmounts = [...appstate.betAmounts];
        filteredBetAmounts = filteredBetAmounts.filter(
          (row) => row.bet_id !== action.payload
        );
        return { ...appstate, betAmounts: filteredBetAmounts };
      }
    case constants.SET_RETURN_AMOUNT:
      if (includeReturnAmount) {
        actualReturnAmounts = actualReturnAmounts.filter(
          (row) => row.bet_id !== action.payload?.bet_id
        );
        actualReturnAmounts.push(action.payload);
      } else {
        actualReturnAmounts.push(action.payload);
      }

      return {
        ...appstate,
        returnAmounts: actualReturnAmounts,
      };
    case constants.REMOVE_RETURN_AMOUNT:
      if (action.payload === "all") {
        return { ...appstate, returnAmounts: [] };
      } else {
        let filteredBetAmounts = [...appstate.returnAmounts];
        filteredBetAmounts = filteredBetAmounts.filter(
          (row) => row.bet_id !== action.payload
        );
        return { ...appstate, returnAmounts: filteredBetAmounts };
      }
    case constants.ACTIVE_SOCKET_SUBSCRIBE:
      return {
        ...appstate,
        activeSocketSubscribe: action.payload,
      };
    case constants.IN_PLAY:
      return {
        ...appstate,
        inPlay: action.payload,
      };
    case constants.SPORT_DATA:
      return {
        ...appstate,
        sportsData: {
          ...appstate.sportsData,
          [action.payload.type]: action.payload.value,
        },
      };
    case constants.SET_SIDEBAR_LEFT:
      return {
        ...appstate,
        sidebarLeft: action.payload,
      };
    case constants.SET_HEADER_DATA:
      return {
        ...appstate,
        headerData: action.payload,
      };

    case constants.SET_SIDEBAR_RIGHT:
      return {
        ...appstate,
        sidebarRight: action.payload,
      };

    default:
      return { ...appstate };
  }
};

export default rootReducer;
