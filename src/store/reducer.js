import Cookies from "js-cookie";
import * as constants from "./actionTypes";
import { cookieName } from "@/app/i18n/settings";

export const initialState = {
  user: null,
  loggedUser: null,
  on_boarding: {},
  swifty_id: null,
  signup_platform: null,
  user_settings: null,
  language: null,
  sports: [],
  activeSport: null,
  competitionsData: [],
  setMobile: false,
  isTablet: false,
  betslipResponse: {
    singles: [],
    combinations: [],
    total_stakes: 0,
    total_payout: 0,
  },
  selectedBets: {
    bets: [],
    stakes: [],
    action: "check",
  },
  betTicker: {
    status: "",
    bet_referral_id: "",
  },
  betAmounts: [],
  returnAmounts: [],
  subscriptions: {},
  updatedSelections: null,
  updatedBetslipSelections: {},
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
  sidebarRight: {
    data: null,
  },
  footer: {
    data: null,
  },
  headerData: null,
  settings: null,
  activePage: null,
  raceCard: null,
  casinoCategory: null,
  pageLayoutContent: {},
  resultedEvents: [],
  favouriteGames: {},
  currentTime: new Date(),
  alertModal: null,
  privacyModal: { isOpen: false, callback: () => {} },
  termsModal: { isOpen: false, callback: () => {} },
  usageStartTime: new Date(),
  promo: null,
  forgotPassword: false,
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
    case constants.ON_BOARDING: {
      const cookieLang = Cookies.get(cookieName);
      const selectedLanguage = action.payload.languages?.find((item) => item.code2.toLowerCase() === cookieLang);

      return {
        ...appstate,
        on_boarding: action.payload,
        language: selectedLanguage || action.payload.languages[0],
      };
    }
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
            stakes: [],
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
          action?.payload?.find((page) => page.path === "/home") ||
          "/home",
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

    case constants.SET_SETTINGS:
      return {
        ...appstate,
        settings: action.payload,
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

    case constants.SET_CASINO_CATEGORY:
      return {
        ...appstate,
        casinoCategory: action.payload,
      };

    case constants.SET_PAGE_LAYOUT_CONTENT:
      return {
        ...appstate,
        pageLayoutContent: action.payload,
      };

    case constants.SET_FOOTER:
      return {
        ...appstate,
        footer: action.payload,
      };

    case constants.SET_UPDATED_SELECTIONS:
      const updatedSelectionsData = { ...appstate.updatedSelections };

      action.payload.forEach((selection) => {
        updatedSelectionsData[selection.data.bet_id] = selection;
      });

      return {
        ...appstate,
        updatedSelections: updatedSelectionsData,
      };

    case constants.ADD_TO_UPDATED_BETSLIP_SELECTIONS:
      return {
        ...appstate,
        updatedBetslipSelections: {
          ...appstate.updatedBetslipSelections,
          [action.payload.bet_id]: action.payload,
        },
      };

    case constants.SET_UPDATED_BETSLIP_SELECTIONS:
      return {
        ...appstate,
        updatedBetslipSelections: action.payload,
      };

    case constants.UPDATE_PAGE_LAYOUT_CONTENT:
      return {
        ...appstate,
        pageLayoutContent: {
          ...appstate.pageLayoutContent,
          [action.payload.slug]: {
            ...appstate.pageLayoutContent[action.payload.slug],
            content: appstate.pageLayoutContent[
              action.payload.slug
            ]?.content?.map((component) => {
              if (component.type === "carousel") {
                return {
                  ...component,
                  [component.type]: component[component.type].map((item) => {
                    if (item.id === action.payload.content.id) {
                      const details = JSON.parse(
                        action.payload.content.details
                      );
                      return {
                        ...item,
                        details: {
                          ...details,
                          image: `${
                            appstate.pageLayoutContent[action.payload.slug]
                              .media_path
                          }/${details.image}`,
                        },
                      };
                    }

                    return item;
                  }),
                };
              }

              if (component.type_id === action.payload.content.id) {
                return {
                  ...component,
                  [component.type]: {
                    ...component[component.type],
                    details: JSON.parse(action.payload.content.details),
                  },
                };
              }

              return component;
            }),
          },
        },
      };

    case constants.SET_SUBSCRIPTIONS:
      return {
        ...appstate,
        subscriptions: { ...appstate.subscriptions, ...action.payload },
      };

    case constants.SET_RESULTED_EVENTS:
      return {
        ...appstate,
        resultedEvents: [...appstate.resultedEvents, action.payload],
      };

    case constants.SET_FAVOURITE_GAMES:
      return {
        ...appstate,
        favouriteGames: action.payload,
      };

    case constants.ADD_TO_FAVOURITE_GAMES:
      if (appstate.favouriteGames[action.payload.id]) {
        break;
      }

      return {
        ...appstate,
        favouriteGames: {
          ...appstate.favouriteGames,
          [action.payload.id]: action.payload,
        },
      };

    case constants.REMOVE_FROM_FAVOURITE_GAMES:
      if (!appstate.favouriteGames[action.payload.id]) {
        break;
      }

      const updatedData = { ...appstate.favouriteGames };

      delete updatedData[action.payload.id];

      return {
        ...appstate,
        favouriteGames: updatedData,
      };

    case constants.SET_CURRENT_TIME:
      return {
        ...appstate,
        currentTime: action.payload,
      };

    case constants.SET_MARKET_OPTIONS:
      return {
        ...appstate,
        marketOptions: action.payload,
      };

    case constants.SET_ALERT_MODAL:
      return {
        ...appstate,
        alertModal: action.payload,
      };

    case constants.SET_PRIVACY_MODAL:
      return {
        ...appstate,
        privacyModal: action.payload,
      };

    case constants.SET_TERMS_MODAL:
      return {
        ...appstate,
        termsModal: action.payload,
      };

    case constants.SET_PROMO:
      return {
        ...appstate,
        promo: action.payload,
      };

    case constants.SET_BETSLIP_RESPONSE:
      return {
        ...appstate,
        betslipResponse: action.payload,
      };

    case constants.DESTROY_SESSION:
      return {
        ...appstate,
        user: null,
        loggedUser: null,
        swifty_id: null,
        signup_platform: null,
        user_settings: null,
        language: null,
        betslipResponse: {
          singles: [],
          combinations: [],
          total_stakes: 0,
          total_payout: 0,
        },
        selectedBets: {
          bets: [],
          stakes: [],
          action: "check",
        },
        betTicker: {
          status: "",
          bet_referral_id: "",
        },
        betAmounts: [],
        returnAmounts: [],
        updatedSelections: null,
        updatedBetslipSelections: {},
        pageLayoutContent: {},
        favouriteGames: {},
        usageStartTime: new Date(),
        promo: null,
        forgotPassword: false,
      };

    case constants.SET_FORGOT_PASSWORD:
      return {
        ...appstate,
        forgotPassword: action.payload,
      };

    default:
      return { ...appstate };
  }
};

export default rootReducer;
