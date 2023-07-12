import * as constants from "./actionTypes";

const initialState = {
  user: null,
  loggedUser: null,
  on_boarding: {},
  swifty_id: null,
  signup_platform: "",
  user_settings: null,
  language: null,
  sports: [],
  activeSport: null,
  competitionsData: [],
  setMobile: false,
  isTablet: false,
  selectedBets: {
    bets: [],
    stakes: {},
    action: "check",
  },
  betTicker: {
    status: "",
    bet_referral_id: "",
  },
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
  tradingChat: null,
  activePage: null,
  raceCard: null,
};

const rootReducer = (appstate = initialState, action) => {
  let actualReturnAmounts = [...appstate.returnAmounts];
  let includeReturnAmount = actualReturnAmounts.some(
    (item) => item.bet_id === action.payload?.bet_id
  );
  let actualBetAmounts;
  let includeAmount;

  switch (action.type) {
    case constants.BET_TICKER:
      console.log("BET_TICKER", action.payload);
      return { ...appstate, betTicker: action.payload };
    case constants.SET_USER:
      return { ...appstate, user: action.payload };
    case constants.SET_DATA:
      return { ...appstate, data: action.payload };
    case constants.SET_COUNTRY_PHONE:
      return { ...appstate, countryPhone: action.payload };

    case constants.SET_MOBILE:
      return { ...appstate, setMobile: action.payload };
    case constants.SET_TABLET:
      return { ...appstate, isTablet: action.payload };
    case constants.SET_LOGGEDUSER:
      return { ...appstate, loggedUser: action.payload };
    case constants.SET_LOGOUT:
      return { ...appstate, loggedUser: action.payload };
    case constants.ON_BOARDING:
      return {
        ...appstate,
        on_boarding: action.payload,
        language: appstate.language || action.payload.languages[0],
      };
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
      return {
        ...appstate,
        selectedBets: action.payload,
      };
    case constants.REMOVE_BET:
      if (action.payload === "all") {
        return {
          ...appstate,
          selectedBets: {
            bets: [],
            stakes: {},
            action: "check",
          },
        };
      } else {
        let filteredBets = appstate.selectedBets.bets.filter(
          (row) =>
            row.bet_id !==
            `${action.payload.bet_provider}-${action.payload.bet_id}`
        );
        return {
          ...appstate,
          selectedBets: { ...appstate.selectedBets, bets: filteredBets },
        };
      }
    case constants.SET_BET_AMOUNT:
      actualBetAmounts = [...appstate.betAmounts];
      includeAmount = actualBetAmounts.some(
        (item) => item.bet_id === action.payload?.bet_id
      );
      if (includeAmount) {
        actualBetAmounts = actualBetAmounts.filter(
          (row) => row.bet_id !== action.payload?.bet_id
        );
        actualBetAmounts.push(action.payload);
      } else {
        actualBetAmounts.push(action.payload);
      }
      return {
        ...appstate,
        betAmounts: actualBetAmounts,
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
        activePage:
          appstate.activePage ||
          action.payload.find((page) => page.path === "/home"),
      };

    case constants.SET_SIDEBAR_RIGHT:
      return {
        ...appstate,
        sidebarRight: action.payload,
      };

    case constants.SET_LANGUAGE:
      return {
        ...appstate,
        language: action.payload,
      };

    case constants.SET_TRADING_CHAT_SETTINGS:
      return {
        ...appstate,
        tradingChat: action.payload,
      };

    case constants.SET_ACTIVE_PAGE:
      return {
        ...appstate,
        activePage: action.payload,
      };

    case constants.SET_RACE_CARD:
      return {
        ...appstate,
        raceCard: action.payload,
      };

    default:
      return { ...appstate };
  }
};

export default rootReducer;
